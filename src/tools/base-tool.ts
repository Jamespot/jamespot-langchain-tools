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
   * Log tool usage
   */
  protected logToolUsage(toolName: string, params?: any): void {
    const timestamp = new Date().toISOString();
    console.log(`\n🔧 [${timestamp}] Tool used: ${toolName}`);
    if (params && Object.keys(params).length > 0) {
      console.log(`   Parameters: ${JSON.stringify(params)}`);
    }
  }

  /**
   * Log API response in debug mode
   */
  protected logApiResponse(toolName: string, result: any): void {
    if (this.debug) {
      console.log(`\n🔍 [${toolName}] API Response:`);
      console.log(JSON.stringify(result, null, 2));
      console.log('');
    }
  }
}
