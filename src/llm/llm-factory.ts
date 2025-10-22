import { ChatOpenAI } from '@langchain/openai';

/**
 * Supported LLM providers
 */
export enum LLMProvider {
  OPENAI = 'openai',
  SAFEBRAIN = 'safebrain',
}

/**
 * Configuration for creating an LLM instance
 */
export interface LLMConfig {
  provider: LLMProvider;
  modelName?: string;
  temperature?: number;
  apiKey?: string;
  baseURL?: string;
  maxTokens?: number;
  // Safebrain-specific configuration
  safebrainBotId?: string;
  safebrainGroupId?: string;
}

/**
 * Factory function to create LLM instances based on provider
 */
export function createLLM(config: LLMConfig): ChatOpenAI {
  const {
    provider,
    modelName,
    temperature = 0,
    apiKey,
    baseURL,
    maxTokens,
  } = config;

  switch (provider) {
    case LLMProvider.OPENAI:
      return new ChatOpenAI({
        modelName: modelName || 'gpt-4',
        temperature,
        openAIApiKey: apiKey || process.env.OPENAI_API_KEY,
        maxTokens,
      });

    case LLMProvider.SAFEBRAIN:
      // Safebrain has an OpenAI-compatible endpoint at:
      // /api/v2/bots/{bot_id}/groups/{group_id}/chat/completions
      const safebrainInstance = process.env.SAFEBRAIN_INSTANCE;
      const safebrainBotId = config.safebrainBotId || process.env.SAFEBRAIN_BOT_ID;
      const safebrainGroupId = config.safebrainGroupId || process.env.SAFEBRAIN_GROUP_ID;
      const safebrainApiKey = apiKey || process.env.SAFEBRAIN_API_KEY;
      const safebrainModel = modelName || process.env.SAFEBRAIN_MODEL || 'gpt-4o';

      if (!safebrainApiKey) {
        throw new Error(
          'Safebrain API key is required. Set SAFEBRAIN_API_KEY environment variable or pass apiKey in config.'
        );
      }

      if (!safebrainInstance) {
        throw new Error(
          'Safebrain instance is required. Set SAFEBRAIN_INSTANCE environment variable (e.g., "your-instance.safebrain.ai").'
        );
      }

      if (!safebrainBotId || !safebrainGroupId) {
        throw new Error(
          'Safebrain Bot ID and Group ID are required. Set SAFEBRAIN_BOT_ID and SAFEBRAIN_GROUP_ID environment variables.'
        );
      }

      // Construct the OpenAI-compatible endpoint URL
      const safebrainBaseURL = baseURL || `https://${safebrainInstance}/api/v2/bots/${safebrainBotId}/groups/${safebrainGroupId}`;
      console.log("Using : " + safebrainBaseURL);
      return new ChatOpenAI({
        modelName: safebrainModel,
        temperature,
        apiKey: safebrainApiKey,
        configuration: {
          baseURL: safebrainBaseURL,
          defaultHeaders: {
            'Authorization': `Bearer ${safebrainApiKey}`,
          },
        },
        maxTokens,
      });

    default:
      throw new Error(`Unsupported LLM provider: ${provider}`);
  }
}

/**
 * Get LLM configuration from environment variables
 */
export function getLLMConfigFromEnv(): LLMConfig {
  const providerStr = process.env.LLM_PROVIDER?.toLowerCase();

  // Determine provider
  let provider: LLMProvider;
  if (providerStr === 'safebrain') {
    provider = LLMProvider.SAFEBRAIN;
  } else {
    // Default to OpenAI for backward compatibility
    provider = LLMProvider.OPENAI;
  }

  return {
    provider,
    modelName: process.env.LLM_MODEL,
    temperature: process.env.LLM_TEMPERATURE ? parseFloat(process.env.LLM_TEMPERATURE) : 0,
    apiKey: provider === LLMProvider.SAFEBRAIN ? process.env.SAFEBRAIN_API_KEY : process.env.OPENAI_API_KEY,
    baseURL: process.env.SAFEBRAIN_BASE_URL,
    maxTokens: process.env.LLM_MAX_TOKENS ? parseInt(process.env.LLM_MAX_TOKENS) : undefined,
    safebrainBotId: process.env.SAFEBRAIN_BOT_ID,
    safebrainGroupId: process.env.SAFEBRAIN_GROUP_ID,
  };
}

/**
 * Display current LLM configuration (without sensitive data)
 */
export function displayLLMConfig(config: LLMConfig): void {
  console.log('\n📊 LLM Configuration:');
  console.log(`   Provider: ${config.provider}`);
  console.log(`   Model: ${config.modelName || 'default'}`);
  console.log(`   Temperature: ${config.temperature}`);

  if (config.provider === LLMProvider.SAFEBRAIN) {
    if (config.baseURL) {
      console.log(`   Base URL: ${config.baseURL}`);
    }
    if (config.safebrainBotId) {
      console.log(`   Bot ID: ${config.safebrainBotId}`);
    }
    if (config.safebrainGroupId) {
      console.log(`   Group ID: ${config.safebrainGroupId}`);
    }
  }

  if (config.maxTokens) {
    console.log(`   Max Tokens: ${config.maxTokens}`);
  }

  // Show API key presence without revealing it
  const apiKeyPresent = config.apiKey ? '✓ Set' : '✗ Not set';
  console.log(`   API Key: ${apiKeyPresent}`);
  console.log('');
}
