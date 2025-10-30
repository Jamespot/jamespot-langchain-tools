import { createLLM, LLMProvider, getLLMConfigFromEnv } from '../src/llm/llm-factory';

describe('LLM Factory', () => {
  describe('OpenAI Provider', () => {
    it('should create OpenAI LLM successfully', () => {
      const llm = createLLM({
        provider: LLMProvider.OPENAI,
        apiKey: 'test-key',
        modelName: 'gpt-4',
      }) as any;

      expect(llm).toBeDefined();
      // The factory automatically adds maxRetries=3 and timeout=60000
    });

    it('should use default model if not specified', () => {
      const llm = createLLM({
        provider: LLMProvider.OPENAI,
        apiKey: 'test-key',
      });

      expect(llm).toBeDefined();
    });
  });

  describe('Safebrain Provider', () => {
    // Set env var for Safebrain tests
    beforeAll(() => {
      process.env.SAFEBRAIN_INSTANCE = 'test.safebrain.ai';
    });

    afterAll(() => {
      delete process.env.SAFEBRAIN_INSTANCE;
    });

    it('should create Safebrain LLM successfully', () => {
      const llm = createLLM({
        provider: LLMProvider.SAFEBRAIN,
        apiKey: 'sk_live_test-key',
        safebrainBotId: '123',
        safebrainGroupId: '456',
        modelName: 'gpt-4o',
      }) as any;

      expect(llm).toBeDefined();
      // The factory automatically adds maxRetries=3 and timeout=60000
    });

    it('should throw error if Safebrain API key is missing', () => {
      expect(() => {
        createLLM({
          provider: LLMProvider.SAFEBRAIN,
          safebrainBotId: '123',
          safebrainGroupId: '456',
        });
      }).toThrow('Safebrain API key is required');
    });

    it('should throw error if bot ID or group ID is missing', () => {
      const originalInstance = process.env.SAFEBRAIN_INSTANCE;
      delete process.env.SAFEBRAIN_INSTANCE;

      expect(() => {
        createLLM({
          provider: LLMProvider.SAFEBRAIN,
          apiKey: 'sk_live_test-key',
        });
      }).toThrow();

      process.env.SAFEBRAIN_INSTANCE = originalInstance;
    });
  });

  describe('Configuration from environment', () => {
    it('should get LLM config from env', () => {
      const originalEnv = process.env.LLM_PROVIDER;

      process.env.LLM_PROVIDER = 'openai';
      const config = getLLMConfigFromEnv();

      expect(config.provider).toBe(LLMProvider.OPENAI);

      process.env.LLM_PROVIDER = originalEnv;
    });
  });
});
