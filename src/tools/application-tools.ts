import { DynamicStructuredTool } from '@langchain/core/tools';
import { URLSearchParams } from 'url';
import { z } from 'zod';
import { BaseJamespotTool, JamespotToolConfig } from './base-tool';
import { jUserList } from 'jamespot-user-api';

/**
 * Tool to list all applications
 */
export class ListApplicationsTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_list_applications',
      description:
        'List all available applications in Jamespot. Returns application details including name, icon, URL, description, and available actions.',
      schema: z.object({}),
      func: async function() {
        try {
          const result = await self.api.application.list();
          if (result.error === 0) { 
            self.logApiResponse('jamespot_list_applications', result);
            return JSON.stringify(result.result, null, 2);
          }
          return `Error: ${result.errorMsg || 'Failed to list applications'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}


/**
 * Tool to install an application
 */
export class InstallApplicationTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_install_application',
      description:
        'Install application. Application ID must be provided as a "hook" name.',
      schema: z.object({
        hook: z.string().describe('Hook Name.'),
      }),
      func: async function({hook}) {
        try {
          const rToken = await self.api.network.tokenCSRF();
          const result = await self.windowNode.fetch(self.backendUrl+'/?action=manageApps_install&name='+ hook +'&install=1&tokenCSRF=' + rToken.result) as any;
          const resultActivateOld = await self.windowNode.fetch(self.backendUrl+'/?action=manageApps_configure&name='+ hook , 
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
              body: new URLSearchParams({page: 'update-config', use: '1'} ).toString()
          }) as any;

          const resultActivateNew = await self.api.module.setConfiguration(
            {
              moduleName: hook, 
              active: true, 
              accessRight:0
            });

          if (result) {
            self.logApiResponse('jamespot_install_application', {result, resultActivateOld, resultActivateNew});
            return;
          }
          return `Error: ${result.errorMsg || 'Failed to install applications'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}


/**
 * Tool to uninstall an application
 */
export class UninstallApplicationTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_uninstall_application',
      description:
        'Uninstall application. Application ID must be provided as a "hook" name.',
      schema: z.object({
        hook: z.string().describe('Hook Name.'),
      }),
      func: async function({hook}) {
        try {
          const rToken = await self.api.network.tokenCSRF();
          const result = await self.windowNode.fetch(self.backendUrl+'/?action=manageApps_install&name='+ hook +'&install=0&tokenCSRF=' + rToken.result) as any;
          if (result) {
            self.logApiResponse('jamespot_uninstall_application', result);
            return;
          }
          return `Error: ${result.errorMsg || 'Failed to uninstall applications'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

/**
 * Tool to get  an application configuration
 */
export class ApplicationGetConfigurationTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_application_configuration',
      description:
        'Get Application configuration. Application ID must be provided as a "hook" name.',
      schema: z.object({
        hook: z.string().describe('Hook Name.'),
      }),
      func: async function({hook}) {
        try {
          const result = await self.api.module.getConfiguration({moduleName: hook});
          if (result) {
            self.logApiResponse('jamespot_application_configuration', result);
            return;
          }
          return `Error: 'Failed to get applications configuration'`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}







/**
 * Create all application-related tools
 */
export function createApplicationTools(config: JamespotToolConfig, currentUser: jUserList): any[] {
  return [
    new ListApplicationsTool(config, currentUser).createTool(),
    new InstallApplicationTool(config, currentUser).createTool(),
    new UninstallApplicationTool(config, currentUser).createTool(),
    new ApplicationGetConfigurationTool(config, currentUser).createTool(),
    
  ];
}
