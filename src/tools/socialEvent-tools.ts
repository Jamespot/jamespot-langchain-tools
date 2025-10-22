import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { BaseJamespotTool, JamespotToolConfig } from './base-tool';
import { jUserList } from 'jamespot-user-api';

export class CreateSocialEventTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_create_social_event',
      description:
        'Create a new social event in Jamespot. ' +
        'A social event must have a title, start date, end date, and an audience (people who can read the event) in the publishTo parameter. ' +
        'Date format should be YYYY-MM-DD or YYYY-MM-DD HH:MM:SS. ' +
        'Returns event details including a urlPath. To create a full URL, combine the backend URL with the urlPath. ' +
        'Example: if backend is https://example.jamespot.pro and urlPath is /article/123, the full URL is https://example.jamespot.pro/article/123. ' +
        'IMPORTANT: To attach files to a social event, use the same token that was used to upload the files. Get a token using jamespot_get_upload_token, upload files with jamespot_upload_file using that token, then create the event with the same token.',
      schema: z.object({
        title: z.string().describe('Event title'),
        dateStart: z.string().describe('Event start date (format: YYYY-MM-DD or YYYY-MM-DD HH:MM:SS)'),
        dateEnd: z.string().describe('Event end date (format: YYYY-MM-DD or YYYY-MM-DD HH:MM:SS)'),
        description: z.string().optional().describe('Event description (HTML supported)'),
        place: z.string().optional().describe('Event location/place name'),
        address: z.string().optional().describe('Event address'),
        allDay: z.boolean().optional().describe('Whether this is an all-day event (default: false)'),
        publishTo: z.string().describe('Audience parameter containing uris for users or groups, separated by commas. Uris have the form "type"/"ID". eg: user/123, spot/123'),
        socialEventUseCeiling: z.boolean().optional().describe('Whether to use a participant ceiling/limit'),
        socialEventCeiling: z.number().optional().describe('Maximum number of participants allowed'),
        textColor: z.string().optional().describe('Text color for the event'),
        bgColor: z.string().optional().describe('Background color for the event'),
        hideFromCalendar: z.boolean().optional().describe('Hide event from calendar view'),
        noGestion: z.boolean().optional().describe('Disable event management features'),
        useQrcode: z.boolean().optional().describe('Enable QR code for the event'),
        urlGestion: z.string().optional().describe('Management URL for the event'),
        token: z.string().optional().describe('Upload token from jamespot_get_upload_token. Required if you want to attach files that were uploaded with this token.'),
      }),
      func: async function({
        title,
        dateStart,
        dateEnd,
        description,
        place,
        address,
        allDay,
        publishTo,
        socialEventUseCeiling,
        socialEventCeiling,
        textColor,
        bgColor,
        hideFromCalendar,
        noGestion,
        useQrcode,
        urlGestion,
        token,
      }: any) {
        try {
          const result = await self.api.socialEvent.create({
            title,
            dateStart,
            dateEnd,
            description,
            place,
            address,
            allDay,
            publishTo,
            socialEventUseCeiling,
            socialEventCeiling,
            textColor,
            bgColor,
            hideFromCalendar,
            noGestion,
            useQrcode,
            urlGestion,
            token,
          });
          if (result.error === 0) {
            self.logApiResponse('jamespot_create_social_event', result);
            const event: any = result.result[0];
            const urlPath = `/article/${event.id}`;

            const response: any = {
              success: true,
              message: 'Social event created successfully',
              event: {
                id: event.id,
                uri: event.uri,
                title: event?.title || title,
                dateStart: event.dateStart || dateStart,
                dateEnd: event.dateEnd || dateEnd,
                place: event.place || place,
                urlPath: urlPath,
              },
            };

            if (self.backendUrl) {
              response.event.fullUrl = `${self.backendUrl}${urlPath}`;
            }

            return JSON.stringify(response, null, 2);
          }
          return `Error: ${result.errorMsg || 'Failed to create social event'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

export class UpdateSocialEventTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_update_social_event',
      description:
        'Update an existing social event in Jamespot. ' +
        'Requires the event URI and any fields to update. ' +
        'Date format should be YYYY-MM-DD or YYYY-MM-DD HH:MM:SS.',
      schema: z.object({
        uri: z.string().describe('Event URI (e.g., "article/123" or just "123")'),
        title: z.string().optional().describe('Updated event title'),
        dateStart: z.string().optional().describe('Updated start date (format: YYYY-MM-DD or YYYY-MM-DD HH:MM:SS)'),
        dateEnd: z.string().optional().describe('Updated end date (format: YYYY-MM-DD or YYYY-MM-DD HH:MM:SS)'),
        description: z.string().optional().describe('Updated event description (HTML supported)'),
        place: z.string().optional().describe('Updated location/place name'),
        address: z.string().optional().describe('Updated address'),
        allDay: z.boolean().optional().describe('Whether this is an all-day event'),
        publishTo: z.string().optional().describe('Updated audience uris separated by commas'),
        socialEventUseCeiling: z.boolean().optional().describe('Whether to use a participant ceiling/limit'),
        socialEventCeiling: z.number().optional().describe('Maximum number of participants allowed'),
        textColor: z.string().optional().describe('Text color for the event'),
        bgColor: z.string().optional().describe('Background color for the event'),
        hideFromCalendar: z.boolean().optional().describe('Hide event from calendar view'),
        noGestion: z.boolean().optional().describe('Disable event management features'),
        useQrcode: z.boolean().optional().describe('Enable QR code for the event'),
        urlGestion: z.string().optional().describe('Management URL for the event'),
        token: z.string().optional().describe('Upload token if attaching new files'),
      }),
      func: async function({ uri, ...updateFields }: any) {
        try {
          const formattedUri = uri.startsWith('article/') ? uri : `article/${uri}`;
          const result = await self.api.socialEvent.update({
            uri: formattedUri,
            ...updateFields,
          });
          if (result.error === 0) {
            self.logApiResponse('jamespot_update_social_event', result);
            return JSON.stringify(
              {
                success: true,
                message: 'Social event updated successfully',
                event: result.result,
              },
              null,
              2,
            );
          }
          return `Error: ${result.errorMsg || 'Failed to update social event'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

export class GetSocialEventTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_get_social_event',
      description: 'Get details of a specific social event in Jamespot by its ID or URI.',
      schema: z.object({
        eventId: z.string().describe('Event ID or URI (e.g., "article/789" or "789")'),
      }),
      func: async function({ eventId }: any) {
        try {
          const formattedId = eventId.startsWith('article/') ? eventId : `article/${eventId}`;
          const result = await self.api.article.get(formattedId);
          if (result.error === 0) {
            self.logApiResponse('jamespot_get_social_event', result);
            // Verify it's actually a social event
            if (result.result?.type !== 'socialEvent') {
              return `Error: The article with ID ${eventId} is not a social event (type: ${result.result?.type})`;
            }
            return JSON.stringify(result.result, null, 2);
          }
          return `Error: ${result.errorMsg || 'Failed to get social event'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

export class SearchSocialEventsTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_search_social_events',
      description:
        'Search for social events in Jamespot by keywords. ' +
        'Returns a list of events matching the search criteria.',
      schema: z.object({
        query: z.string().describe('Search query for event title or content'),
        limit: z.number().optional().describe('Maximum number of results (default: 20)'),
      }),
      func: async function({ query, limit = 20 }: any) {
        try {
          const result = await self.api.article.search({
            query: query,
            type: 'socialEvent',
            limit,
          });
          if (result.error === 0) {
            self.logApiResponse('jamespot_search_social_events', result);
            return JSON.stringify(result.result, null, 2);
          }
          return `Error: ${result.errorMsg || 'Failed to search social events'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

export class ListSocialEventsTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_list_social_events',
      description:
        'List social events in Jamespot with optional filters. ' +
        'Can filter by group, date range, and other criteria.',
      schema: z.object({
        groupUri: z.string().optional().describe('Filter by group URI (e.g., "spot/123")'),
        limit: z.number().optional().describe('Maximum number of results (default: 20)'),
        offset: z.number().optional().describe('Number of results to skip for pagination (default: 0)'),
      }),
      func: async function({ groupUri, limit = 20, offset = 0 }: any) {
        try {
          const payload: any = {
            type: 'socialEvent',
            limit,
            offset,
          };
          if (groupUri) {
            payload.uiObjectLink = groupUri;
          }
          const result = await self.api.article.list(payload);
          if (result.error === 0) {
            self.logApiResponse('jamespot_list_social_events', result);
            return JSON.stringify(result.result, null, 2);
          }
          return `Error: ${result.errorMsg || 'Failed to list social events'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

export class DeleteSocialEventTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_delete_social_event',
      description: 'Delete a social event from Jamespot by its ID. This action cannot be undone.',
      schema: z.object({
        eventId: z.number().describe('Event ID to delete'),
      }),
      func: async function({ eventId }: any) {
        try {
          const result = await self.api.article.delete(eventId);
          if (result.error === 0) {
            self.logApiResponse('jamespot_delete_social_event', result);
            return JSON.stringify(
              {
                success: true,
                message: `Social event ${eventId} deleted successfully`,
              },
              null,
              2,
            );
          }
          return `Error: ${result.errorMsg || 'Failed to delete social event'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

export function createSocialEventTools(config: JamespotToolConfig, currentUser: jUserList): any[] {
  return [
    new CreateSocialEventTool(config, currentUser).createTool(),
    new UpdateSocialEventTool(config, currentUser).createTool(),
    new GetSocialEventTool(config, currentUser).createTool(),
    new SearchSocialEventsTool(config, currentUser).createTool(),
    new ListSocialEventsTool(config, currentUser).createTool(),
    new DeleteSocialEventTool(config, currentUser).createTool(),
  ];
}
