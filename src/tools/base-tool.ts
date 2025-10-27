import type { JamespotUserApi } from 'jamespot-user-api';
import { jUserList } from 'jamespot-user-api';
import { WindowNode } from '../utils/WindowNode';

/**
 * Base configuration for Jamespot tools
 */
export interface JamespotToolConfig {
  api: JamespotUserApi,
  windowNode: WindowNode,
  credentials: {
    email: string;
    password: string;
    token?: string;
  },
  debug: boolean,
  backendUrl: string,
}

/**
 * Base class for creating Jamespot LangChain tools
 */
export abstract class BaseJamespotTool {
  protected api: JamespotUserApi;
  protected windowNode: WindowNode;
  protected credentials?: JamespotToolConfig['credentials'];
  protected debug: boolean;
  protected backendUrl: string;
  protected currentUser: jUserList;

  constructor(config: JamespotToolConfig, currentUser: jUserList) {
    this.api = config.api;
    this.windowNode = config.windowNode;
    this.currentUser = currentUser;
    this.credentials = config.credentials;
    this.debug = config.debug || false;
    this.backendUrl = config.backendUrl;
  }

  /**
   * Format API errors for LangChain
   */
  protected formatError(error: unknown): string {
    if (typeof error === 'object' && error !== null) {
      if ('errorMsg' in error && typeof error.errorMsg === 'string') {
        return error.errorMsg;
      }
      if ('message' in error && typeof error.message === 'string') {
        return error.message;
      }
    }
    return String(error);
  }

  /**
   * Log tool input (what the tool receives)
   */
  protected logToolInput(toolName: string, params: any): void {
    if (!this.debug) return;

    const timestamp = new Date().toISOString();
    console.log(`\n${'='.repeat(80)}`);
    console.log(`🔧 [${timestamp}] TOOL CALLED: ${toolName}`);
    console.log(`${'='.repeat(80)}`);
    console.log('\n📥 INPUT (received from LLM):');
    console.log(JSON.stringify(params, null, 2));
  }

  /**
   * Log tool output (what the tool returns to LLM)
   */
  protected logToolOutput(toolName: string, result: string): void {
    if (!this.debug) return;

    console.log('\n📤 OUTPUT (returned to LLM):');
    const truncated = result.length > 500 ? result.substring(0, 500) + '\n... (truncated)' : result;
    console.log(truncated);
    console.log(`\n${'='.repeat(80)}\n`);
  }

  /**
   * Log API call before execution
   */
  protected logApiCall(apiMethod: string, params?: any): void {
    if (!this.debug) return;

    console.log(`\n🌐 API CALL: ${apiMethod}`);
    if (params && Object.keys(params).length > 0) {
      console.log('Parameters:', JSON.stringify(params, null, 2));
    }
  }

  /**
   * Log API response
   */
  protected logApiResponse(apiMethod: string, result: any, executionTime?: number): void {
    if (!this.debug) return;

    console.log(`\n📨 API RESPONSE from ${apiMethod}:`);
    if (executionTime !== undefined) {
      console.log(`⏱️  Execution time: ${executionTime}ms`);
    }

    // Log success/error status
    if (result && typeof result === 'object' && 'error' in result) {
      const status = result.error === 0 ? '✅ SUCCESS' : '❌ ERROR';
      console.log(`Status: ${status}`);
      if (result.error !== 0 && result.errorMsg) {
        console.log(`Error: ${result.errorMsg}`);
      }
    }

    console.log('Full response:', JSON.stringify(result, null, 2));
  }

  /**
   * Measure execution time of an async function
   */
  protected async measureTime<T>(fn: () => Promise<T>): Promise<{ result: T; time: number }> {
    const start = Date.now();
    const result = await fn();
    const time = Date.now() - start;
    return { result, time };
  }
}
