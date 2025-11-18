import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { BaseJamespotTool, JamespotToolConfig } from './base-tool';
import { jUserList } from 'jamespot-user-api';

export class ListGroupsTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_list_groups',
      description:
        'List all groups (communities, teams) that the current user is a member of in Jamespot.',
      schema: z.object({
        limit: z.number().optional().describe('Maximum number of groups to return (default: 50)'),
        visibility: z.boolean().optional().describe('Visibility of the group : public or private'),
      }),
      func: async function({ limit = 50, visibility = true }: any) {
        try {
          const result = await self.api.group.list({ 'type': 'spot', 'public': visibility, limit });
          if (result.error === 0) {
            self.logApiResponse('jamespot_list_groups', result);
            return JSON.stringify(result.result, null, 2);
          }
          return `Error: ${result.errorMsg || 'Failed to list groups'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

export class GetGroupTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_get_group',
      description:
        'Get detailed information about a specific group/community in Jamespot by its ID.',
      schema: z.object({
        groupId: z.string().describe('Group ID (numeric)'),
      }),
      func: async function({ groupId }: any) {
        try {
          const result = await self.api.group.getSpot(groupId);
          if (result.error === 0) {
            self.logApiResponse('jamespot_get_group', result);
            return JSON.stringify(result.result, null, 2);
          }
          return `Error: ${result.errorMsg || 'Failed to get group'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

export class GetGroupMembersTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_get_group_members',
      description:
        'Get the list of members of a specific group/community in Jamespot.',
      schema: z.object({
        groupId: z.string().describe('Group ID (numeric)'),
        limit: z.number().optional().describe('Maximum number of members to return (default: 100)'),
      }),
      func: async function({ groupId, limit = 100 }: any) {
        try {
          const result = await self.api.group.getObjectListJamespotSpotMembers(groupId, undefined, limit);
          if (result.error === 0) {
            self.logApiResponse('jamespot_get_group_members', result);
            return JSON.stringify(result.result, null, 2);
          }
          return `Error: ${result.errorMsg || 'Failed to get group members'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

export class SearchGroupsTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_search_groups',
      description:
        'Search for groups/communities in Jamespot by name or description.',
      schema: z.object({
        query: z.string().describe('Search query for group name or description'),
      }),
      func: async function({ query }: any) {
        try {
          // Use list API with search query for group search
          const result = await self.api.group.list({
            type: 'spot',
            public: true,
            limit: 50,
            query
          });
          if (result.error === 0) {
            self.logApiResponse('jamespot_search_groups', result);
            return JSON.stringify(result.result, null, 2);
          }
          return `Error: ${result.errorMsg || 'Failed to search groups'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

export class CreateGroupTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_create_group',
      description:
        'Create a new group/community in Jamespot. This will create a new collaborative space.',
      schema: z.object({
        type: z.string().describe('Group type (e.g., "spot", "projet"). Default value : "spot"'),
        title: z.string().describe('Group title/name'),
        description: z.string().describe('Group description'),
        privacy: z.union([z.string(), z.number()]).describe('Privacy level: "public" (0), "private" (1), or "secret" (2)'),
        edito: z.string().nullable().optional().describe('Editorial content for the group (optional)'),
        language: z.string().describe('Language code (e.g., "fr", "en")'),
        category: z.string().describe('Category identifier for the group'),
        idCommunity: z.string().optional().describe('Parent community ID if this is a subgroup (optional)'),
      }),
      func: async function(params: any) {
        try {
          const result = await self.api.group.create(params);
          if (result.error === 0) {
            self.logApiResponse('jamespot_create_group', result);
            return JSON.stringify(result.result, null, 2);
          }
          return `Error: ${result.errorMsg || 'Failed to create group'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

export class GetCategoriesConfigurationTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_get_categories_configuration',
      description:
        'Get the configuration of group categories in Jamespot. This returns detailed category settings.',
      schema: z.object({}),
      func: async function() {
        try {
          const result = await self.api.group.getCategoriesConfiguration();
          if (result.error === 0) {
            self.logApiResponse('jamespot_get_categories_configuration', result);
            return JSON.stringify(result.result, null, 2);
          }
          return `Error: ${result.errorMsg || 'Failed to get categories configuration'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

export class GetCategoriesTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_get_categories',
      description:
        'Get the list of available group categories in Jamespot.',
      schema: z.object({}),
      func: async function() {
        try {
          const result = await self.api.group.getCategories();
          if (result.error === 0) {
            self.logApiResponse('jamespot_get_categories', result);
            return JSON.stringify(result.result, null, 2);
          }
          return `Error: ${result.errorMsg || 'Failed to get categories'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

export class CountMembersTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_count_members',
      description:
        'Count the number of members in a specific group/community.',
      schema: z.object({
        uri: z.string().describe('Group URI identifier'),
      }),
      func: async function({ uri }: any) {
        try {
          const result = await self.api.group.countMembers({ uri });
          if (result.error === 0) {
            self.logApiResponse('jamespot_count_members', result);
            return JSON.stringify({ count: result.result }, null, 2);
          }
          return `Error: ${result.errorMsg || 'Failed to count members'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

export class GetPropertiesTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_get_group_properties',
      description:
        'Get the properties of a group that are not within the standard model. This includes additional configuration and settings.',
      schema: z.object({
        groupId: z.string().describe('Group ID (numeric)'),
      }),
      func: async function({ groupId }: any) {
        try {
          const result = await self.api.group.getProperties(groupId);
          if (result.error === 0) {
            self.logApiResponse('jamespot_get_group_properties', result);
            return JSON.stringify(result.result, null, 2);
          }
          return `Error: ${result.errorMsg || 'Failed to get group properties'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

export class AddMemberTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_add_member',
      description:
        'Add a member to a group or change an existing member\'s role. Role levels: 0 (member), 1 (moderator), 2 (admin), 3 (owner).',
      schema: z.object({
        idUser: z.number().describe('User ID to add or modify'),
        role: z.number().describe('Role level: 0 (member), 1 (moderator), 2 (admin), 3 (owner)'),
        idSpot: z.number().describe('Group/Spot ID'),
      }),
      func: async function({ idUser, role, idSpot }: any) {
        try {
          const result = await self.api.group.changeMemberRole({ idUser, role, idSpot });
          if (result.error === 0) {
            self.logApiResponse('jamespot_add_member', result);
            return JSON.stringify({ success: true, message: 'Member role updated successfully' }, null, 2);
          }
          return `Error: ${result.errorMsg || 'Failed to add/update member'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

export function createGroupTools(config: JamespotToolConfig, currentUser: jUserList): any[] {
  return [
    new ListGroupsTool(config, currentUser).createTool(),
    new GetGroupTool(config, currentUser).createTool(),
    new GetGroupMembersTool(config, currentUser).createTool(),
    new SearchGroupsTool(config, currentUser).createTool(),
    new CreateGroupTool(config, currentUser).createTool(),
    new GetCategoriesConfigurationTool(config, currentUser).createTool(),
    new GetCategoriesTool(config, currentUser).createTool(),
    new CountMembersTool(config, currentUser).createTool(),
    new GetPropertiesTool(config, currentUser).createTool(),
    new AddMemberTool(config, currentUser).createTool(),
  ];
}
