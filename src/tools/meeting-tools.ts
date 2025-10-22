import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { BaseJamespotTool, JamespotToolConfig } from './base-tool';
import { jUserList } from 'jamespot-user-api';

export class CreateMeetingTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_create_meeting',
      description:
        'Create a new meeting in Jamespot. ' +
        'A meeting must have a title, start date, end date, and an audience (people who can read the meeting) in the publishTo parameter. ' +
        'Date format should be YYYY-MM-DD or YYYY-MM-DD HH:MM:SS. ' +
        'Returns meeting details including a urlPath. To create a full URL, combine the backend URL with the urlPath. ' +
        'Example: if backend is https://example.jamespot.pro and urlPath is /article/123, the full URL is https://example.jamespot.pro/article/123. ' +
        'IMPORTANT: To attach files to a meeting, use the same token that was used to upload the files. Get a token using jamespot_get_upload_token, upload files with jamespot_upload_file using that token, then create the meeting with the same token.',
      schema: z.object({
        title: z.string().describe('Meeting title'),
        dateStart: z.string().describe('Meeting start date (format: YYYY-MM-DD or YYYY-MM-DD HH:MM:SS)'),
        dateEnd: z.string().describe('Meeting end date (format: YYYY-MM-DD or YYYY-MM-DD HH:MM:SS)'),
        agenda: z.string().optional().describe('Meeting agenda (HTML supported)'),
        report: z.string().optional().describe('Meeting report/minutes (HTML supported)'),
        place: z.string().optional().describe('Meeting location/place name'),
        address: z.string().optional().describe('Meeting address'),
        allDay: z.boolean().optional().describe('Whether this is an all-day meeting (default: false)'),
        publishTo: z.string().describe('Audience parameter containing uris for users or groups, separated by commas. Uris have the form "type"/"ID". eg: user/123, spot/123'),
        textColor: z.string().optional().describe('Text color for the meeting'),
        bgColor: z.string().optional().describe('Background color for the meeting'),
        noGestion: z.boolean().optional().describe('Disable meeting management features'),
        urlGestion: z.string().optional().describe('Management URL for the meeting'),
        token: z.string().optional().describe('Upload token from jamespot_get_upload_token. Required if you want to attach files that were uploaded with this token.'),
      }),
      func: async function({
        title,
        dateStart,
        dateEnd,
        agenda,
        report,
        place,
        address,
        allDay,
        publishTo,
        textColor,
        bgColor,
        noGestion,
        urlGestion,
        token,
      }: any) {
        try {
          // Cast to any because the API accepts agenda and report fields even though
          // the TypeScript signature uses SocialEventCreation
          const result = await self.api.meeting.create({
            title,
            dateStart,
            dateEnd,
            agenda,
            report,
            place,
            address,
            allDay,
            publishTo,
            textColor,
            bgColor,
            noGestion,
            urlGestion,
            token,
          } as any);
          if (result.error === 0) {
            self.logApiResponse('jamespot_create_meeting', result);
            const meeting: any = result.result[0];
            const urlPath = `/article/${meeting.id}`;

            const response: any = {
              success: true,
              message: 'Meeting created successfully',
              meeting: {
                id: meeting.id,
                uri: meeting.uri,
                title: meeting?.title || title,
                dateStart: meeting.dateStart || dateStart,
                dateEnd: meeting.dateEnd || dateEnd,
                place: meeting.place || place,
                urlPath: urlPath,
              },
            };

            if (self.backendUrl) {
              response.meeting.fullUrl = `${self.backendUrl}${urlPath}`;
            }

            return JSON.stringify(response, null, 2);
          }
          return `Error: ${result.errorMsg || 'Failed to create meeting'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

export class UpdateMeetingTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_update_meeting',
      description:
        'Update an existing meeting in Jamespot. ' +
        'Requires the meeting URI and any fields to update. ' +
        'Date format should be YYYY-MM-DD or YYYY-MM-DD HH:MM:SS.',
      schema: z.object({
        uri: z.string().describe('Meeting URI (e.g., "article/123" or just "123")'),
        title: z.string().optional().describe('Updated meeting title'),
        dateStart: z.string().optional().describe('Updated start date (format: YYYY-MM-DD or YYYY-MM-DD HH:MM:SS)'),
        dateEnd: z.string().optional().describe('Updated end date (format: YYYY-MM-DD or YYYY-MM-DD HH:MM:SS)'),
        agenda: z.string().optional().describe('Updated meeting agenda (HTML supported)'),
        report: z.string().optional().describe('Updated meeting report/minutes (HTML supported)'),
        place: z.string().optional().describe('Updated location/place name'),
        address: z.string().optional().describe('Updated address'),
        allDay: z.boolean().optional().describe('Whether this is an all-day meeting'),
        publishTo: z.string().optional().describe('Updated audience uris separated by commas'),
        textColor: z.string().optional().describe('Text color for the meeting'),
        bgColor: z.string().optional().describe('Background color for the meeting'),
        noGestion: z.boolean().optional().describe('Disable meeting management features'),
        urlGestion: z.string().optional().describe('Management URL for the meeting'),
        token: z.string().optional().describe('Upload token if attaching new files'),
      }),
      func: async function({ uri, ...updateFields }: any) {
        try {
          const formattedUri = uri.startsWith('article/') ? uri : `article/${uri}`;
          // Cast to any because the API accepts agenda and report fields even though
          // the TypeScript signature uses SocialEventUpdate
          const result = await self.api.meeting.update({
            uri: formattedUri,
            ...updateFields,
          } as any);
          if (result.error === 0) {
            self.logApiResponse('jamespot_update_meeting', result);
            return JSON.stringify(
              {
                success: true,
                message: 'Meeting updated successfully',
                meeting: result.result,
              },
              null,
              2,
            );
          }
          return `Error: ${result.errorMsg || 'Failed to update meeting'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

export class GetMeetingTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_get_meeting',
      description: 'Get details of a specific meeting in Jamespot by its ID or URI. Includes agenda and report if available.',
      schema: z.object({
        meetingId: z.string().describe('Meeting ID or URI (e.g., "article/789" or "789")'),
      }),
      func: async function({ meetingId }: any) {
        try {
          const formattedId = meetingId.startsWith('article/') ? meetingId : `article/${meetingId}`;
          const result = await self.api.article.get(formattedId);
          if (result.error === 0) {
            self.logApiResponse('jamespot_get_meeting', result);
            // Verify it's actually a meeting
            if (result.result?.type !== 'meeting') {
              return `Error: The article with ID ${meetingId} is not a meeting (type: ${result.result?.type})`;
            }
            return JSON.stringify(result.result, null, 2);
          }
          return `Error: ${result.errorMsg || 'Failed to get meeting'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

export class SearchMeetingsTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_search_meetings',
      description:
        'Search for meetings in Jamespot by keywords. ' +
        'Returns a list of meetings matching the search criteria.',
      schema: z.object({
        query: z.string().describe('Search query for meeting title, agenda, or report'),
        limit: z.number().optional().describe('Maximum number of results (default: 20)'),
      }),
      func: async function({ query, limit = 20 }: any) {
        try {
          const result = await self.api.article.search({
            query: query,
            type: 'meeting',
            limit,
          });
          if (result.error === 0) {
            self.logApiResponse('jamespot_search_meetings', result);
            return JSON.stringify(result.result, null, 2);
          }
          return `Error: ${result.errorMsg || 'Failed to search meetings'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

export class ListMeetingsTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_list_meetings',
      description:
        'List meetings in Jamespot with optional filters. ' +
        'Can filter by group, date range, and other criteria.',
      schema: z.object({
        groupUri: z.string().optional().describe('Filter by group URI (e.g., "spot/123")'),
        limit: z.number().optional().describe('Maximum number of results (default: 20)'),
        offset: z.number().optional().describe('Number of results to skip for pagination (default: 0)'),
      }),
      func: async function({ groupUri, limit = 20, offset = 0 }: any) {
        try {
          const payload: any = {
            type: 'meeting',
            limit,
            offset,
          };
          if (groupUri) {
            payload.uiObjectLink = groupUri;
          }
          const result = await self.api.article.list(payload);
          if (result.error === 0) {
            self.logApiResponse('jamespot_list_meetings', result);
            return JSON.stringify(result.result, null, 2);
          }
          return `Error: ${result.errorMsg || 'Failed to list meetings'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

export class DeleteMeetingTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_delete_meeting',
      description: 'Delete a meeting from Jamespot by its ID. This action cannot be undone.',
      schema: z.object({
        meetingId: z.number().describe('Meeting ID to delete'),
      }),
      func: async function({ meetingId }: any) {
        try {
          const result = await self.api.article.delete(meetingId);
          if (result.error === 0) {
            self.logApiResponse('jamespot_delete_meeting', result);
            return JSON.stringify(
              {
                success: true,
                message: `Meeting ${meetingId} deleted successfully`,
              },
              null,
              2,
            );
          }
          return `Error: ${result.errorMsg || 'Failed to delete meeting'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

export function createMeetingTools(config: JamespotToolConfig, currentUser: jUserList): any[] {
  return [
    new CreateMeetingTool(config, currentUser).createTool(),
    new UpdateMeetingTool(config, currentUser).createTool(),
    new GetMeetingTool(config, currentUser).createTool(),
    new SearchMeetingsTool(config, currentUser).createTool(),
    new ListMeetingsTool(config, currentUser).createTool(),
    new DeleteMeetingTool(config, currentUser).createTool(),
  ];
}
