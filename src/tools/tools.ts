import { JamespotToolConfig } from './base-tool';
import { createUserTools } from './user-tools';
import { createGroupTools } from './group-tools';
import { createContentTools } from './content-tools';
import { createMessengerTools } from './messenger-tools';
import { createApplicationTools } from './application-tools';
import { createImageSearchTools } from './image-search-tools';
import { createFileTools } from './file-tools';
import { createNetworkTools } from './network-tools';
import { jUserList } from 'jamespot-user-api';

export { BaseJamespotTool, JamespotToolConfig } from './base-tool';
export * from './user-tools';
export * from './group-tools';
export * from './content-tools';
export * from './messenger-tools';
export * from './application-tools';
export * from './image-search-tools';
export * from './file-tools';
export * from './network-tools';

export async function createJamespotTools(
  toolConfig: JamespotToolConfig
): Promise<any[]> {

  // Login to get session cookie
  const loginResult = await toolConfig.api.user.signIn(toolConfig.credentials.email, toolConfig.credentials.password);

  if (loginResult.error === 0) {
      console.log('✓ Login successful!');
      console.log('User ID:', loginResult.result.id);
      console.log('User Name:', loginResult.result.firstname, loginResult.result.lastname);
  } else {
      console.error('✗ Login failed:', loginResult.errorMsg);
      return;
  }
  const currentUser : jUserList = loginResult.result;

  // Collect all tools
  const tools: any[] = [];
  tools.push(...createUserTools(toolConfig, currentUser));
  tools.push(...createGroupTools(toolConfig, currentUser));
  tools.push(...createContentTools(toolConfig, currentUser));
  tools.push(...createMessengerTools(toolConfig, currentUser));
  tools.push(...createApplicationTools(toolConfig, currentUser));
  tools.push(...createImageSearchTools(toolConfig, currentUser));
  tools.push(...createFileTools(toolConfig, currentUser));
  tools.push(...createNetworkTools(toolConfig, currentUser));

  return tools;
}
