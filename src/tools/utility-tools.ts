import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { BaseJamespotTool, JamespotToolConfig } from './base-tool';
import { jUserList } from 'jamespot-user-api';

export class GetCurrentDateTimeTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_get_current_datetime',
      description:
        'Get the current date and time. ' +
        'Use this tool to know what date and time it is right now, which is essential for creating events, meetings, or understanding relative dates like "tomorrow", "next week", etc. ' +
        'Returns the current date and time in multiple formats useful for Jamespot API calls.',
      schema: z.object({
        timezone: z.string().optional().describe('Timezone to use (e.g., "Europe/Paris", "America/New_York"). Defaults to server timezone.'),
      }),
      func: async function({ timezone }: any) {
        try {
          const now = new Date();

          // Apply timezone if provided
          const dateStr = timezone
            ? now.toLocaleString('en-US', { timeZone: timezone })
            : now.toISOString();

          const currentDate = timezone ? new Date(dateStr) : now;

          // Format for Jamespot API (YYYY-MM-DD HH:MM:SS)
          const formatDateForJamespot = (date: Date): string => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
          };

          // Format for date only (YYYY-MM-DD)
          const formatDateOnly = (date: Date): string => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
          };

          // Calculate some useful relative dates
          const tomorrow = new Date(currentDate);
          tomorrow.setDate(tomorrow.getDate() + 1);

          const nextWeek = new Date(currentDate);
          nextWeek.setDate(nextWeek.getDate() + 7);

          const nextMonth = new Date(currentDate);
          nextMonth.setMonth(nextMonth.getMonth() + 1);

          const response = {
            current: {
              datetime: formatDateForJamespot(currentDate),
              date: formatDateOnly(currentDate),
              iso: currentDate.toISOString(),
              timestamp: currentDate.getTime(),
              timezone: timezone || 'server default',
              dayOfWeek: currentDate.toLocaleDateString('en-US', { weekday: 'long' }),
              time: `${String(currentDate.getHours()).padStart(2, '0')}:${String(currentDate.getMinutes()).padStart(2, '0')}`,
            },
            helpful_relative_dates: {
              tomorrow: formatDateOnly(tomorrow),
              next_week: formatDateOnly(nextWeek),
              next_month: formatDateOnly(nextMonth),
            },
            format_info: {
              for_jamespot_datetime: 'YYYY-MM-DD HH:MM:SS (e.g., "2025-10-21 14:30:00")',
              for_jamespot_date: 'YYYY-MM-DD (e.g., "2025-10-21")',
              note: 'Use datetime format for specific times, date format for all-day events',
            },
          };

          self.logApiResponse('jamespot_get_current_datetime', response);
          return JSON.stringify(response, null, 2);
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

export class CalculateDateTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_calculate_date',
      description:
        'Calculate a date by adding or subtracting days, hours, or minutes from a base date. ' +
        'Useful for scheduling events relative to a specific date. ' +
        'If no base date is provided, uses the current date/time.',
      schema: z.object({
        baseDate: z.string().optional().describe('Base date to calculate from (format: YYYY-MM-DD or YYYY-MM-DD HH:MM:SS). Defaults to current date/time.'),
        days: z.number().optional().describe('Number of days to add (positive) or subtract (negative)'),
        hours: z.number().optional().describe('Number of hours to add (positive) or subtract (negative)'),
        minutes: z.number().optional().describe('Number of minutes to add (positive) or subtract (negative)'),
        timezone: z.string().optional().describe('Timezone to use (e.g., "Europe/Paris"). Defaults to server timezone.'),
      }),
      func: async function({ baseDate, days = 0, hours = 0, minutes = 0, timezone }: any) {
        try {
          // Parse base date or use current date
          let date: Date;
          if (baseDate) {
            date = new Date(baseDate.replace(' ', 'T'));
          } else {
            date = new Date();
          }

          // Apply timezone if provided
          if (timezone) {
            const dateStr = date.toLocaleString('en-US', { timeZone: timezone });
            date = new Date(dateStr);
          }

          // Calculate new date
          date.setDate(date.getDate() + days);
          date.setHours(date.getHours() + hours);
          date.setMinutes(date.getMinutes() + minutes);

          // Format for Jamespot API (YYYY-MM-DD HH:MM:SS)
          const formatDateForJamespot = (d: Date): string => {
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const hours = String(d.getHours()).padStart(2, '0');
            const minutes = String(d.getMinutes()).padStart(2, '0');
            const seconds = String(d.getSeconds()).padStart(2, '0');
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
          };

          // Format for date only (YYYY-MM-DD)
          const formatDateOnly = (d: Date): string => {
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
          };

          const response = {
            result: {
              datetime: formatDateForJamespot(date),
              date: formatDateOnly(date),
              iso: date.toISOString(),
              timestamp: date.getTime(),
              dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'long' }),
            },
            calculation: {
              base_date: baseDate || 'current date/time',
              days_added: days,
              hours_added: hours,
              minutes_added: minutes,
              timezone: timezone || 'server default',
            },
          };

          self.logApiResponse('jamespot_calculate_date', response);
          return JSON.stringify(response, null, 2);
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

export function createUtilityTools(config: JamespotToolConfig, currentUser: jUserList): any[] {
  return [
    new GetCurrentDateTimeTool(config, currentUser).createTool(),
    new CalculateDateTool(config, currentUser).createTool(),
  ];
}
