// IMPORTANT: Polyfill window object BEFORE importing jamespot-user-api
// The library expects window to be available
(global as any).window = {};

import { config } from 'dotenv';
// Load environment variables from .env file
config();

import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { JamespotUserApi, Network } from 'jamespot-user-api';
import { WindowNode } from './utils/WindowNode';
import { createJamespotTools } from './tools/tools';
import { createLLM, getLLMConfigFromEnv, displayLLMConfig } from './llm/llm-factory';
import * as readline from 'readline';


// Check for debug mode
const DEBUG = process.argv.includes('--debug') || process.env.DEBUG === 'true';

async function main() {
    // Configuration
    const BACKEND_URL = process.env.JAMESPOT_URL;
    const EMAIL = process.env.JAMESPOT_EMAIL;
    const PASSWORD = process.env.JAMESPOT_PASSWORD;

    // 1. Create the WindowNode adapter with your Jamespot backend URL
    const windowNode = new WindowNode(BACKEND_URL);

    // 2. Create the Network instance with the WindowNode adapter
    const network = new Network(windowNode);

    // 3. Initialize the JamespotUserApi with the network
    const api = new JamespotUserApi(network);


    try {
        console.log('🚀 Starting Jamespot AI Agent...\n');

        if (DEBUG) {
            console.log('⚠️  DEBUG MODE ENABLED\n');
        }


        console.log('\n--- Connecting to plaform ---');

        // Create tools (await because it's async)
        console.log('Creating Jamespot tools...');
        const tools = await createJamespotTools({
            api: api,
            backendUrl: BACKEND_URL,
            windowNode: windowNode,
            credentials: {
                email: EMAIL,
                password: PASSWORD,
            },
            debug: DEBUG
        });

        console.log(`✓ Created ${tools.length} tools\n`);

        // Create LLM
        console.log('Creating LLM...');
        const llmConfig = getLLMConfigFromEnv();
        displayLLMConfig(llmConfig);

        const llm = createLLM(llmConfig);

        // Create agent
        console.log('Creating agent...');
        const agent = createReactAgent({
            llm,
            tools
        });

        console.log('✓ Agent ready!\n');
        console.log('='.repeat(60));
        console.log('You can now chat with the Jamespot AI Agent');
        console.log('Type "exit" or "quit" to end the conversation');
        if (DEBUG) {
            console.log('Type "debug on" or "debug off" to toggle debug output');
        }
        console.log('='.repeat(60));
        console.log('');

        // Create readline interface for user input
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        // Conversation history
        const conversationHistory: Array<{ role: string; content: string }> = [];

        let systemPrompt = process.env.SYSTEM_PROMPT;
        if (systemPrompt) {
            conversationHistory.push({
                            role: 'system',
                            content: systemPrompt
            });

        }


        // Debug mode toggle
        let debugEnabled = DEBUG;

        // Function to handle user input
        const askQuestion = () => {
            rl.question('\nYou: ', async (userInput) => {
                const input = userInput.trim();

                // Check for exit commands
                if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
                    console.log('\n👋 Goodbye!');
                    rl.close();
                    process.exit(0);
                    return;
                }

                // Check for debug toggle commands
                if (input.toLowerCase() === 'debug on') {
                    debugEnabled = true;
                    console.log('\n✓ Debug mode enabled');
                    askQuestion();
                    return;
                }
                if (input.toLowerCase() === 'debug off') {
                    debugEnabled = false;
                    console.log('\n✓ Debug mode disabled');
                    askQuestion();
                    return;
                }

                // Skip empty input
                if (!input) {
                    askQuestion();
                    return;
                }

                try {
                    // Add user message to history
                    conversationHistory.push({
                        role: 'user',
                        content: input
                    });

                    if (debugEnabled) {
                        console.log('\n📝 User input added to history');
                        console.log('Current conversation length:', conversationHistory.length);
                    }

                    // Show thinking indicator
                    console.log('\n🤔 Thinking...\n');

                    // Invoke agent with conversation history
                    if (debugEnabled) {
                        console.log('🔄 Invoking agent...');
                        console.log('Messages being sent:', JSON.stringify(conversationHistory, null, 2));
                        console.log('');
                    }

                    const result = await agent.invoke({
                        messages: conversationHistory
                    });

                    if (debugEnabled) {
                        console.log('\n📥 Raw agent result:');
                        console.log(JSON.stringify(result, null, 2));
                        console.log('');
                    }

                    // Extract the last message from the agent
                    const messages = result.messages || [];

                    if (debugEnabled) {
                        console.log('📨 All messages in result:');
                        messages.forEach((msg: any, idx: number) => {
                            console.log(`\nMessage ${idx + 1}:`, {
                                type: msg.constructor.name,
                                role: msg._getType ? msg._getType() : 'unknown',
                                content: typeof msg.content === 'string' ?
                                    msg.content.substring(0, 100) + (msg.content.length > 100 ? '...' : '') :
                                    msg.content,
                                toolCalls: msg.tool_calls || msg.additional_kwargs?.tool_calls,
                            });
                        });
                        console.log('');
                    }

                    const lastMessage = messages[messages.length - 1];

                    let agentResponse = '';
                    if (lastMessage) {
                        if (typeof lastMessage.content === 'string') {
                            agentResponse = lastMessage.content;
                        } else if (lastMessage.content && typeof lastMessage.content === 'object') {
                            agentResponse = JSON.stringify(lastMessage.content, null, 2);
                        }
                    }

                    // Add agent response to history
                    if (agentResponse) {
                        conversationHistory.push({
                            role: 'assistant',
                            content: agentResponse
                        });

                        if (debugEnabled) {
                            console.log('📤 Agent response added to history');
                            console.log('Response length:', agentResponse.length, 'characters\n');
                        }

                        console.log('Agent:', agentResponse);
                    } else {
                        console.log('Agent: (No response)');
                    }

                } catch (error) {
                    console.error('\n❌ Error:', error instanceof Error ? error.message : String(error));
                }

                // Continue conversation
                askQuestion();
            });
        };

        // Start the conversation
        askQuestion();

    } catch (error) {
        console.error('Error initializing agent:', error);
        process.exit(1);
    }
}

main();
