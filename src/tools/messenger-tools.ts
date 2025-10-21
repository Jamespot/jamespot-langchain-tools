import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { BaseJamespotTool, JamespotToolConfig } from './base-tool';
import { jUserList } from 'jamespot-user-api';

/**
 * Tool to send a message in a discussion
 */
export class SendMessageTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_send_message',
      description:
        'Send a message in an existing messenger discussion.',
      schema: z.object({
        message: z.string().describe('Message content to send'),
        idDiscussion: z.string().describe('Discussion ID'),
      }),
      func: async function({ message, idDiscussion }: any) {
        try {
          const result = await self.api.messenger.sendMessage(message, idDiscussion);
          if (result.error === 0) {
            self.logApiResponse('jamespot_send_message', result);
            return JSON.stringify({ success: true, message: 'Message sent successfully' }, null, 2);
          }
          return `Error: ${result.errorMsg || 'Failed to send message'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

/**
 * Tool to retrieve last recent discussions
 */
export class ListRecentDiscussionsTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_list_recent_discussions',
      description:
        'Retrieve last recent discussions.',
      schema: z.object({}),
      func: async function({ }: any) {
        try {
          const result = await self.api.network.post({o: "messenger", f: "listRecentDiscussions"});
          if (result.error === 0) {
            self.logApiResponse('jamespot_list_recent_discussions', result);
            return JSON.stringify(result.result, null, 2);
          }
          return `Error: ${result.errorMsg || 'Cant retrieve discussions'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}



/**
 * Tool to get or create a discussion between two users
 */
export class GetOrCreateDiscussionTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_get_or_create_discussion',
      description:
        'Get an existing discussion or create a new one between two users. Returns the discussion details.',
      schema: z.object({
        idSender: z.number().describe('Sender user ID'),
        idUserTo: z.number().describe('Recipient user ID'),
      }),
      func: async function({ idSender, idUserTo }: any) {
        try {
          const result = await self.api.messenger.getOrCreateDiscussion(idSender, idUserTo);
          if (result.error === 0) {
            self.logApiResponse('jamespot_get_or_create_discussion', result);
            return JSON.stringify(result.result, null, 2);
          }
          return `Error: ${result.errorMsg || 'Failed to get or create discussion'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}


/**
 * Tool to get a group/spot discussion
 */
export class GetSpotDiscussionTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_get_spot_discussion',
      description:
        'Get the messenger discussion for a specific group/spot.',
      schema: z.object({
        uri: z.string().describe('Group/Spot URI'),
      }),
      func: async function({ uri }: any) {
        try {
          const result = await self.api.messenger.getSpotDiscussion({ uri });
          if (result.error === 0) {
            self.logApiResponse('jamespot_get_spot_discussion', result);
            return JSON.stringify(result.result, null, 2);
          }
          return `Error: ${result.errorMsg || 'Failed to get spot discussion'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

/**
 * Tool to create a group/spot discussion
 */
export class CreateSpotDiscussionTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_create_spot_discussion',
      description:
        'Create a new messenger discussion for a group/spot.',
      schema: z.object({
        uri: z.string().describe('Group/Spot URI'),
      }),
      func: async function({ uri }: any) {
        try {
          const result = await self.api.messenger.createSpotDiscussion({ uri });
          if (result.error === 0) {
            self.logApiResponse('jamespot_create_spot_discussion', result);
            return JSON.stringify(result.result, null, 2);
          }
          return `Error: ${result.errorMsg || 'Failed to create spot discussion'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

/**
 * Tool to get message read status
 */
export class GetMessageReadsTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_get_message_reads',
      description:
        'Get the list of messages that were not already read by this current user.',
      schema: z.object({
        uriMessage: z.string().describe('Message URI'),
        limit: z.number().optional().describe('Maximum number of results (optional)'),
        page: z.number().optional().describe('Page number for pagination (optional)'),
      }),
      func: async function({ uriMessage, limit, page }: any) {
        try {
          const payload: any = { uriMessage };
          if (limit) payload.limit = limit;
          if (page) payload.page = page;

          const result = await self.api.messenger.getMessageReads(payload);
          if (result.error === 0) {
            self.logApiResponse('jamespot_get_message_reads', result);
            return JSON.stringify(result.result, null, 2);
          }
          return `Error: ${result.errorMsg || 'Failed to get message reads'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

export function createMessengerTools(config: JamespotToolConfig, currentUser: jUserList): any[] {
  return [
    new SendMessageTool(config, currentUser).createTool(),
    new GetOrCreateDiscussionTool(config, currentUser).createTool(),
    new GetSpotDiscussionTool(config, currentUser).createTool(),
    new CreateSpotDiscussionTool(config, currentUser).createTool(),
    new GetMessageReadsTool(config, currentUser).createTool(),
    new ListRecentDiscussionsTool(config, currentUser).createTool(),
  ];
}
