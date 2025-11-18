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
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import * as readline from 'readline';


// Check for debug mode
const DEBUG = process.argv.includes('--debug') || process.env.DEBUG === 'true';

// Check for print mode (-p or --print)
const printModeIndexShort = process.argv.indexOf('-p');
const printModeIndexLong = process.argv.indexOf('--print');
const printModeIndex = printModeIndexShort !== -1 ? printModeIndexShort : printModeIndexLong;
const PRINT_MODE = printModeIndex !== -1;
const PRINT_QUERY = PRINT_MODE && printModeIndex + 1 < process.argv.length
    ? process.argv.slice(printModeIndex + 1)
        .filter(arg => !arg.startsWith('--') && arg !== '-p' && arg !== '--print')
        .join(' ')
    : null;

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

        // Handle print mode (-p or --print)
        if (PRINT_MODE) {
            if (!PRINT_QUERY) {
                console.error('Error: -p/--print requires a query argument');
                console.error('Usage: npm run chat -- -p "your question here"');
                console.error('   or: npm run chat -- --print "your question here"');
                process.exit(1);
            }

            console.log('📤 Query:', PRINT_QUERY);
            console.log('');

            try {
                let systemPrompt = process.env.SYSTEM_PROMPT;
                const conversationHistory: Array<any> = [];

                if (systemPrompt && systemPrompt.trim()) {
                    conversationHistory.push(new SystemMessage(systemPrompt));
                }

                conversationHistory.push(new HumanMessage(PRINT_QUERY));

                if (DEBUG) {
                    console.log('📊 Conversation history before invoke:');
                    console.log(JSON.stringify(conversationHistory, null, 2));
                }

                const result = await agent.invoke(
                    { messages: conversationHistory },
                    { recursionLimit: 15 }
                );

                const messages = result.messages || [];
                const lastMessage = messages[messages.length - 1];

                let agentResponse = '';
                if (lastMessage) {
                    if (typeof lastMessage.content === 'string') {
                        agentResponse = lastMessage.content;
                    } else if (lastMessage.content && typeof lastMessage.content === 'object') {
                        agentResponse = JSON.stringify(lastMessage.content, null, 2);
                    }
                }

                if (agentResponse) {
                    console.log(agentResponse);
                } else {
                    console.log('(No response)');
                }

                process.exit(0);
            } catch (error: any) {
                console.error('Error:', error.message || String(error));
                if (DEBUG && error.stack) {
                    console.error('Stack:', error.stack);
                }
                if (DEBUG && error.response) {
                    console.error('Response:', error.response);
                }
                process.exit(1);
            }
        }

        // Interactive mode
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
        if (systemPrompt && systemPrompt.trim()) {
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
                        const timestamp = new Date().toISOString();
                        console.log(`\n${'='.repeat(80)}`);
                        console.log(`💬 [${timestamp}] NEW REQUEST FROM USER`);
                        console.log(`${'='.repeat(80)}`);
                        console.log('\n📥 USER INPUT:');
                        console.log(input);
                        console.log('\n📊 Conversation history length:', conversationHistory.length);
                        console.log(`${'='.repeat(80)}\n`);
                    }

                    // Show thinking indicator
                    console.log('\n🤔 Thinking...\n');

                    // Invoke agent with conversation history
                    const startTime = Date.now();
                    const result = await agent.invoke(
                        {
                            messages: conversationHistory
                        },
                        {
                            recursionLimit: 15  // Limite à 15 appels LLM max par question
                        }
                    );
                    const executionTime = Date.now() - startTime;

                    // Extract the last message from the agent
                    const messages = result.messages || [];

                    if (debugEnabled) {
                        console.log(`\n${'='.repeat(80)}`);
                        console.log(`🤖 AGENT RESPONSE (completed in ${executionTime}ms)`);
                        console.log(`${'='.repeat(80)}`);
                        console.log(`\n📊 Total messages in result: ${messages.length}`);

                        console.log('\n📨 All messages:');
                        messages.forEach((msg: any, idx: number) => {
                            const msgType = msg.constructor.name;
                            const role = msg._getType ? msg._getType() : 'unknown';

                            console.log(`\n  [${idx + 1}] ${msgType} (${role})`);

                            if (msg.tool_calls && msg.tool_calls.length > 0) {
                                console.log(`      🔧 Tool calls:`, msg.tool_calls.map((tc: any) => tc.name));
                            }

                            if (msg.content) {
                                const contentPreview = typeof msg.content === 'string' ?
                                    msg.content.substring(0, 150) + (msg.content.length > 150 ? '...' : '') :
                                    JSON.stringify(msg.content).substring(0, 150);
                                console.log(`      Content: ${contentPreview}`);
                            }
                        });
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
                            console.log('\n📤 FINAL RESPONSE TO USER:');
                            const truncated = agentResponse.length > 500 ?
                                agentResponse.substring(0, 500) + '\n... (truncated)' :
                                agentResponse;
                            console.log(truncated);
                            console.log(`\n${'='.repeat(80)}\n`);
                        }

                        console.log('Agent:', agentResponse);
                    } else {
                        console.log('Agent: (No response)');
                        if (debugEnabled) {
                            console.log(`\n${'='.repeat(80)}\n`);
                        }
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
