import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { BaseJamespotTool, JamespotToolConfig } from './base-tool';
import { jUserList } from 'jamespot-user-api';

/**
 * Tool to get upload token for file operations
 */
export class GetUploadTokenTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_get_upload_token',
      description:
        'Get an upload token from the Jamespot network API. This token is required for file upload operations and for attaching files to articles. ' +
        'The same token should be used when uploading files and creating articles to automatically attach the uploaded files to the article.',
      schema: z.object({}),
      func: async function() {
        try {
          const result = await self.api.network.token();
          if (result.error === 0) {
            self.logApiResponse('jamespot_get_upload_token', result);
            return JSON.stringify({
              success: true,
              token: result.result,
              message: 'Upload token retrieved successfully. Use this token for file uploads and article creation.',
            }, null, 2);
          }
          return `Error: ${result.errorMsg || 'Failed to get upload token'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

/**
 * Create all network-related tools
 */
export function createNetworkTools(config: JamespotToolConfig, currentUser: jUserList): any[] {
  return [
    new GetUploadTokenTool(config, currentUser).createTool(),
  ];
}
