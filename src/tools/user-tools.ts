import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { BaseJamespotTool, JamespotToolConfig } from './base-tool';
import { jUserList } from 'jamespot-user-api';

/**
 * Tool to get current user information
 * Note: Returns the cached user info from authentication
 */
export class GetCurrentUserTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_get_current_user',
      description:
        'Get information about the currently authenticated user in Jamespot. Returns user profile including name, email, avatar, and other details.',
      schema: z.object({}),
      func: async function() {
        const toolName = 'jamespot_get_current_user';
        self.logToolInput(toolName, {});

        try {
          // The API stores the current user info after signIn
          if (self.currentUser) {
            self.logApiResponse('cached_user_data', self.currentUser);
            const output = JSON.stringify(self.currentUser, null, 2);
            self.logToolOutput(toolName, output);
            return output;
          }
          const error = `Error: No authenticated user found. Please ensure credentials are provided.`;
          self.logToolOutput(toolName, error);
          return error;
        } catch (error: any) {
          const errorMsg = `Error: ${self.formatError(error)}`;
          self.logToolOutput(toolName, errorMsg);
          return errorMsg;
        }
      },
    } as any);
  }
}

/**
 * Tool to get specific user by ID
 */
export class GetUserTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_get_user',
      description:
        'Get information about a specific user in Jamespot by their user ID or URI (e.g., "user/123").',
      schema: z.object({
        userId: z.string().describe('User ID or URI (e.g., "user/123" or "123")'),
      }),
      func: async function({ userId }: any) {
        const toolName = 'jamespot_get_user';
        self.logToolInput(toolName, { userId });

        try {
          const formattedId = userId.startsWith('user/') ? userId : `user/${userId}`;

          self.logApiCall('api.user.get', { formattedId });
          const { result, time } = await self.measureTime(() => self.api.user.get(formattedId));
          self.logApiResponse('api.user.get', result, time);

          if (result.error === 0) {
            const output = JSON.stringify(result.result, null, 2);
            self.logToolOutput(toolName, output);
            return output;
          }
          const error = `Error: ${result.errorMsg || 'Failed to get user'}`;
          self.logToolOutput(toolName, error);
          return error;
        } catch (error: any) {
          const errorMsg = `Error: ${self.formatError(error)}`;
          self.logToolOutput(toolName, errorMsg);
          return errorMsg;
        }
      },
    } as any);
  }
}

/**
 * Tool to search users
 */
export class SearchUsersTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_search_users',
      description:
        'Search for users in Jamespot by name, email, or other criteria. Returns a list of matching users.',
      schema: z.object({
        query: z.string().describe('Search query (name, email, etc.)'),
        limit: z.number().optional().describe('Maximum number of results (default: 10)'),
      }),
      func: async function({ query, limit = 10 }: any) {
        const toolName = 'jamespot_search_users';
        self.logToolInput(toolName, { query, limit });

        try {
          self.logApiCall('api.user.autocomplete', { query, limit });
          const { result, time } = await self.measureTime(() => self.api.user.autocomplete(query, limit));
          self.logApiResponse('api.user.autocomplete', result, time);

          const output = JSON.stringify(result, null, 2);
          self.logToolOutput(toolName, output);
          return output;
        } catch (error: any) {
          const errorMsg = `Error: ${self.formatError(error)}`;
          self.logToolOutput(toolName, errorMsg);
          return errorMsg;
        }
      },
    } as any);
  }
}

/**
 * Tool to update user profile
 */
export class UpdateUserProfileTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_update_user_profile',
      description:
        'Update the current user profile information in Jamespot (e.g., name, bio, phone).',
      schema: z.object({
        firstName: z.string().optional().describe('User first name'),
        lastName: z.string().optional().describe('User last name'),
        bio: z.string().optional().describe('User biography'),
        phone: z.string().optional().describe('User phone number'),
      }),
      func: async function(input: any) {
        const toolName = 'jamespot_update_user_profile';
        self.logToolInput(toolName, input);

        try {
          self.logApiCall('api.user.userUpdateProfile', input);
          const { result, time } = await self.measureTime(() => self.api.user.userUpdateProfile(input));
          self.logApiResponse('api.user.userUpdateProfile', result, time);

          if (result.error === 0) {
            const output = `Successfully updated user profile`;
            self.logToolOutput(toolName, output);
            return output;
          }
          const error = `Error: ${result.errorMsg || 'Failed to update profile'}`;
          self.logToolOutput(toolName, error);
          return error;
        } catch (error: any) {
          const errorMsg = `Error: ${self.formatError(error)}`;
          self.logToolOutput(toolName, errorMsg);
          return errorMsg;
        }
      },
    } as any);
  }
}

/**
 * Create all user-related tools
 */
export function createUserTools(config: JamespotToolConfig, currentUser: jUserList): any[] {
  return [
    new GetCurrentUserTool(config, currentUser).createTool(),
    new GetUserTool(config, currentUser).createTool(),
    new SearchUsersTool(config, currentUser).createTool(),
    new UpdateUserProfileTool(config, currentUser).createTool(),
  ];
}
