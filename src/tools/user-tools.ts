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
        try {
          // The API stores the current user info after signIn
          if (self.currentUser) {
            self.logApiResponse('jamespot_get_current_user', self.currentUser);
            return JSON.stringify(self.currentUser, null, 2);
          }
          return `Error: No authenticated user found. Please ensure credentials are provided.`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
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
        try {
          const formattedId = userId.startsWith('user/') ? userId : `user/${userId}`;
          const result = await self.api.user.get(formattedId);
          if (result.error === 0) {
            self.logApiResponse('jamespot_get_user', result);
            return JSON.stringify(result.result, null, 2);
          }
          return `Error: ${result.errorMsg || 'Failed to get user'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
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
        try {
          // Use autocomplete API for user search
          const result = await self.api.user.autocomplete(query, limit);
          self.logApiResponse('jamespot_search_users', result);
          return JSON.stringify(result, null, 2);
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
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
        try {
          // Use userUpdateProfile API
          const result = await self.api.user.userUpdateProfile(input);
          if (result.error === 0) {
            self.logApiResponse('jamespot_update_user_profile', result);
            return `Successfully updated user profile`;
          }
          return `Error: ${result.errorMsg || 'Failed to update profile'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
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
