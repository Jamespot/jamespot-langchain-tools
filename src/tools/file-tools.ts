import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { BaseJamespotTool, JamespotToolConfig } from './base-tool';
import { jUserList } from 'jamespot-user-api';

/**
 * Tool to get file details
 */
export class GetFileTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_get_file',
      description:
        'Get detailed information about a specific file by its ID. Returns file metadata including title, size, type, upload date, and download URL.',
      schema: z.object({
        idFile: z.number().describe('File ID to retrieve'),
      }),
      func: async function({ idFile }: any) {
        try {
          const result = await self.api.file.get(idFile);
          if (result.error === 0) {
            self.logApiResponse('jamespot_get_file', result);
            return JSON.stringify(result.result, null, 2);
          }
          return `Error: ${result.errorMsg || 'Failed to get file'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

/**
 * Tool to upload a file from URL
 */
export class UploadFileTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_upload_file',
      description:
        'Upload a file to Jamespot from a URL. Use this to add external files or images to the platform. ' +
        'Returns upload result with file information. Requires a token which can be obtained from the network API.',
      schema: z.object({
        url: z.string().describe('URL of the file to upload (must be publicly accessible)'),
        attrName: z.string().describe('Attribute name for the file (e.g., "file", "image", "document")'),
        token: z.string().describe('Upload token obtained from the network API. The token value must be obtained from the network tool, and kept to be use after, during the article creation.'),
      }),
      func: async function({ url, attrName, token }: any) {
        try {
          const result = await self.api.file.upload({ url, attrName, token });
          self.logApiResponse('jamespot_upload_file', result);
          return JSON.stringify({
            success: true,
            message: 'File uploaded successfully',
            result: result,
          }, null, 2);
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

/**
 * Tool to duplicate a file
 */
export class DuplicateFileTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_duplicate_file',
      description:
        'Duplicate an existing file and create a new article with it. Returns the new file ID and article information.',
      schema: z.object({
        idFile: z.number().describe('File ID to duplicate'),
        title: z.string().describe('Title for the new file/article'),
        publishTo: z.array(z.string()).optional().describe('Array of URIs to publish to (e.g., ["spot/123", "user/456"])'),
      }),
      func: async function({ idFile, title, publishTo }: any) {
        try {
          const result = await self.api.file.duplicate(idFile, title, publishTo);
          if (result.error === 0) {
            self.logApiResponse('jamespot_duplicate_file', result);
            return JSON.stringify({
              success: true,
              message: 'File duplicated successfully',
              newFileId: result.result.idFile,
              article: result.result.article,
            }, null, 2);
          }
          return `Error: ${result.errorMsg || 'Failed to duplicate file'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

/**
 * Tool to update file title
 */
export class UpdateFileTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_update_file',
      description:
        'Update the title of an existing file.',
      schema: z.object({
        idFile: z.number().describe('File ID to update'),
        title: z.string().describe('New title for the file'),
      }),
      func: async function({ idFile, title }: any) {
        try {
          const result = await self.api.file.updateFile(idFile, title);
          if (result.error === 0) {
            self.logApiResponse('jamespot_update_file', result);
            return JSON.stringify({
              success: true,
              message: 'File title updated successfully',
            }, null, 2);
          }
          return `Error: ${result.errorMsg || 'Failed to update file'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

/**
 * Tool to get file download statistics
 */
export class GetFileDownloadStatsTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_get_file_downloads',
      description:
        'Get download statistics for a file, including list of users who downloaded it and download count.',
      schema: z.object({
        fileId: z.number().describe('File ID to get download statistics for'),
      }),
      func: async function({ fileId }: any) {
        try {
          const result = await self.api.file.getDownload(fileId);
          if (result.error === 0) {
            self.logApiResponse('jamespot_get_file_downloads', result);
            return JSON.stringify({
              download_count: result.result.count,
              downloads: result.result.list,
            }, null, 2);
          }
          return `Error: ${result.errorMsg || 'Failed to get download statistics'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

/**
 * Tool to copy a file
 */
export class CopyFileTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_copy_file',
      description:
        'Copy a file from one location to another. Useful for organizing files across different folders or groups.',
      schema: z.object({
        idFile: z.number().describe('File ID to copy'),
        attrName: z.string().describe('Attribute name for the copy operation'),
        token: z.string().describe('Security token for the operation'),
      }),
      func: async function({ idFile, attrName, token }: any) {
        try {
          const result = await self.api.file.copy({ id: idFile, attrName, token });
          if (result.error === 0) {
            self.logApiResponse('jamespot_copy_file', result);
            return JSON.stringify({
              success: true,
              message: 'File copied successfully',
              file: result.result,
            }, null, 2);
          }
          return `Error: ${result.errorMsg || 'Failed to copy file'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

/**
 * Tool to list file banks
 */
export class ListFileBanksTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_list_filebanks',
      description:
        'List all available file banks (file repositories). Returns information about each file bank including recent files and root folder.',
      schema: z.object({}),
      func: async function() {
        try {
          const result = await self.api.filebank.getBanks();
          self.logApiResponse('jamespot_list_filebanks', result);
          return JSON.stringify(result, null, 2);
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

/**
 * Tool to get folders in a file bank
 */
export class GetFoldersTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_get_folders',
      description:
        'Get folders within a specific parent folder or file bank. Returns list of subfolders with their metadata.',
      schema: z.object({
        parentURI: z.string().describe('Parent folder URI (e.g., "folder/123")'),
      }),
      func: async function({ parentURI }: any) {
        try {
          const result = await self.api.filebank.getFolders(parentURI);
          if (result.error === 0) {
            self.logApiResponse('jamespot_get_folders', result);
            return JSON.stringify(result.result, null, 2);
          }
          return `Error: ${result.errorMsg || 'Failed to get folders'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

/**
 * Tool to get documents in a folder
 */
export class GetDocumentsInFolderTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_get_folder_documents',
      description:
        'Get all documents within a specific folder. Returns paginated list of files and their metadata.',
      schema: z.object({
        folderURI: z.string().describe('Folder URI to list documents from (e.g., "folder/123")'),
      }),
      func: async function({ folderURI }: any) {
        try {
          const result = await self.api.filebank.getDocuments(folderURI);
          if (result.error === 0) {
            self.logApiResponse('jamespot_get_folder_documents', result);
            return JSON.stringify({
              total: result.result.cnt,
              page: result.result.page,
              limit: result.result.limit,
              documents: result.result.data,
            }, null, 2);
          }
          return `Error: ${result.errorMsg || 'Failed to get documents'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

/**
 * Tool to get folder path/breadcrumb
 */
export class GetFolderPathTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_get_folder_path',
      description:
        'Get the hierarchical path (breadcrumb) for a folder. Returns all parent folders from root to the specified folder.',
      schema: z.object({
        uri: z.string().describe('Folder URI to get path for (e.g., "folder/123")'),
        mode: z.enum(['full', 'browse']).optional().describe('Mode: "full" for complete details or "browse" for basic info (default: browse)'),
      }),
      func: async function({ uri, mode }: any) {
        try {
          const result = await self.api.filebank.getPath({ uri, mode });
          if (result.error === 0) {
            self.logApiResponse('jamespot_get_folder_path', result);
            return JSON.stringify(result.result, null, 2);
          }
          return `Error: ${result.errorMsg || 'Failed to get folder path'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

/**
 * Tool to search files and folders
 */
export class SearchFilesTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_search_files',
      description:
        'Search for files and folders within a file bank by query string. Returns paginated search results.',
      schema: z.object({
        uri: z.string().describe('File bank URI to search within (e.g., "filebank/123")'),
        query: z.string().describe('Search query text'),
        limit: z.number().optional().describe('Maximum number of results (default: 20)'),
        page: z.number().optional().describe('Page number for pagination (default: 1)'),
      }),
      func: async function({ uri, query, limit, page }: any) {
        try {
          const result = await self.api.filebank.searchContent({ uri, query, limit, page });
          if (result.error === 0) {
            self.logApiResponse('jamespot_search_files', result);
            return JSON.stringify({
              total: result.result.cnt,
              page: result.result.page,
              limit: result.result.limit,
              results: result.result.data,
            }, null, 2);
          }
          return `Error: ${result.errorMsg || 'Failed to search files'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

/**
 * Tool to get parent folders of an item
 */
export class GetFileParentsTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_get_file_parents',
      description:
        'Get all parent folders of a specific file or folder. Useful for understanding file location in the hierarchy.',
      schema: z.object({
        id: z.number().describe('File or folder ID'),
      }),
      func: async function({ id }: any) {
        try {
          const result = await self.api.filebank.getParents({ id });
          if (result.error === 0) {
            self.logApiResponse('jamespot_get_file_parents', result);
            return JSON.stringify(result.result, null, 2);
          }
          return `Error: ${result.errorMsg || 'Failed to get parent folders'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

/**
 * Tool to list root folders
 */
export class ListRootFoldersTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_list_root_folders',
      description:
        'List all root-level folders in file banks. Optionally search root folders by query.',
      schema: z.object({
        query: z.string().optional().describe('Optional search query to filter root folders'),
        limit: z.number().optional().describe('Maximum number of results (default: 20)'),
        page: z.number().optional().describe('Page number for pagination (default: 1)'),
      }),
      func: async function({ query, limit, page }: any) {
        try {
          const result = await self.api.filebank.getRootFolders({ query, limit, page });
          if (result.error === 0) {
            self.logApiResponse('jamespot_list_root_folders', result);
            return JSON.stringify({
              total: result.result.cnt,
              page: result.result.page,
              limit: result.result.limit,
              folders: result.result.data,
            }, null, 2);
          }
          return `Error: ${result.errorMsg || 'Failed to list root folders'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

/**
 * Create all file-related tools
 */
export function createFileTools(config: JamespotToolConfig, currentUser: jUserList): any[] {
  return [
    new GetFileTool(config, currentUser).createTool(),
    new UploadFileTool(config, currentUser).createTool(),
    new DuplicateFileTool(config, currentUser).createTool(),
    new UpdateFileTool(config, currentUser).createTool(),
    new GetFileDownloadStatsTool(config, currentUser).createTool(),
    new CopyFileTool(config, currentUser).createTool(),
    new ListFileBanksTool(config, currentUser).createTool(),
    new GetFoldersTool(config, currentUser).createTool(),
    new GetDocumentsInFolderTool(config, currentUser).createTool(),
    new GetFolderPathTool(config, currentUser).createTool(),
    new SearchFilesTool(config, currentUser).createTool(),
    new GetFileParentsTool(config, currentUser).createTool(),
    new ListRootFoldersTool(config, currentUser).createTool(),
  ];
}
