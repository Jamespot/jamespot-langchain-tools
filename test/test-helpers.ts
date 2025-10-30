import { JamespotToolConfig } from '../src/tools/base-tool';
import { JamespotUserApi, jUserList } from 'jamespot-user-api';

/**
 * Create a mock JamespotToolConfig for testing
 */
export function createMockConfig(): JamespotToolConfig {
  return {
    api: {} as JamespotUserApi,
    windowNode: {} as any,
    credentials: {
      email: 'test@example.com',
      password: 'test-password',
    },
    debug: false,
    backendUrl: 'https://test.jamespot.com',
  };
}

/**
 * Create a mock current user for testing
 */
export function createMockUser(): jUserList {
  return {
    id: 123,
    firstname: 'Test',
    lastname: 'User',
    email: 'test@example.com',
    mainType: 'user',
    type: 'user',
    uri: 'user/123',
  } as any;
}
