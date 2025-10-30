import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { BaseJamespotTool, JamespotToolConfig } from './base-tool';
import { jUserList, jUserView } from 'jamespot-user-api';
import { integer } from 'zod/v4/core/regexes';

export class CreateArticleTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_create_article',
      description:
        'Create a new article or post in Jamespot.'+
        'An article must have an audience (people who can read the article) in the publishTo parameter. If an article is to be published in a group but you dont know the group Id, first try to get the group by its name, and use its uri.'+
        'Returns article details including a urlPath. To create a full URL, combine the backend URL with the urlPath. '+
        'Example: if backend is https://example.jamespot.pro and urlPath is /article/123, the full URL is https://example.jamespot.pro/article/123. '+
        'IMPORTANT: To attach files to an article, use the same token that was used to upload the files. Get a token using jamespot_get_upload_token, upload files with jamespot_upload_file using that token, then create the article with the same token. In this case, don\'t reference the same image in the HTML description text.',
      schema: z.object({
        title: z.string().describe('Article title'),
        description: z.string().describe('Article content (HTML supported)'),
        publishTo: z.string().describe('This audience parameter contains uris for users or groups, separated by commas. Uris have the form "type"/"ID of object (must be a number)". eg : user/123, spot/123'),
        token: z.string().optional().describe('Upload token from jamespot_get_upload_token. Required if you want to attach files that were uploaded with this token.'),
      }),
      func: async function({ title, description, publishTo, token}: any) {
        try {
          const result = await self.api.article.create({
            title,
            description,
            publishTo,
            token,
          });
          if (result.error === 0) {
            self.logApiResponse('jamespot_create_article', result);
            const article = result.result[0];
            const urlPath = `/article/${article.id}`;

            // Return structured information for the agent
            const response: any = {
              success: true,
              message: 'Article created successfully',
              article: {
                id: article.id,
                uri: article.uri,
                title: article?.title || title,
                urlPath: urlPath
              }
            };

            // Include full URL if backend URL is available
            if (self.backendUrl) {
              response.article.fullUrl = `${self.backendUrl}${urlPath}`;
            }

            return JSON.stringify(response, null, 2);
          }
          return `Error: ${result.errorMsg || 'Failed to create article'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

export class GetArticleTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_get_article',
      description:
        'Get details of a specific article/post in Jamespot by its ID.',
      schema: z.object({
        articleId: z.string().describe('Article ID or URI (e.g., "article/789")'),
      }),
      func: async function({ articleId }: any) {
        try {
          let payload = {};
          if (Number.isInteger(articleId)) {
              payload = {idArticle: articleId};
          } else {
              payload = {uri: articleId};
          }
          const result = await self.api.article.get(payload);
          if (result.error === 0) {
            self.logApiResponse('jamespot_get_article', result);
            return JSON.stringify(result.result, null, 2);
          }
          return `Error: ${result.errorMsg || 'Failed to get article'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

export class SearchArticlesTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_search_articles',
      description:
        'Search for articles/posts in Jamespot by keywords.',
      schema: z.object({
        query: z.string().optional().describe('Fulltext search query for article title or content.'),
        groupFilter:z.number().optional().describe('Optional, but must be provided to narrow search to articles published in this group. Value must be a spot ID'),
        authorFilter:z.number().optional().describe('Optional, but must be provided to narrow search to articles published by this author. Value must be a user ID'),
        limit: z.number().optional().describe('Maximum number of results (default: 20)'),
      }),
      func: async function({ query, groupFilter, authorFilter, limit = 20 }: any) {
        try {

          let searchQuery = {
            limit,
          } as any;

          if (query && query != '*') {
            searchQuery.keywords =  query;
          }
          searchQuery.filters = [];
          searchQuery.filters.push({
              field: 'mainType',
              value: 'article'
            });

          if (groupFilter) {
            searchQuery.filters.push({
              field: '__sec__',
              value: 's' + groupFilter
            });
          }
          if (authorFilter) {
            searchQuery.filters.push({
              field: 'idUser',
              value: authorFilter
            });
          }

          const result = await self.api.search.searchQuery(searchQuery);
          if (result.error === 0) {
            self.logApiResponse('jamespot_search_articles', result);
            return JSON.stringify(result.result, null, 2);
          }
          return `Error: ${result.errorMsg || 'Failed to search articles'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

export class CommentArticleTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'jamespot_comment_article',
      description:
        'Add a comment to an existing article or post in Jamespot.',
      schema: z.object({
        idArticle: z.number().describe('Article ID to comment on'),
        comment: z.string().describe('Comment text (HTML supported)'),
      }),
      func: async function({ idArticle, comment }: any) {
        try {
          const rToken = await self.api.network.token();
          const result = await self.api.article.addComment({
            idArticle,
            token: rToken.result,
            content: comment,
            sendAlert: true,
            alertAuthor: false,
          });
          if (result.error === 0) {
            self.logApiResponse('jamespot_comment_article', result);
            return `Successfully added comment to article`;
          }
          return `Error: ${result.errorMsg || 'Failed to add comment'}`;
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

export function createContentTools(config: JamespotToolConfig, currentUser: jUserList): any[] {
  return [
    new CreateArticleTool(config, currentUser).createTool(),
    new GetArticleTool(config, currentUser).createTool(),
    new SearchArticlesTool(config, currentUser).createTool(),
    new CommentArticleTool(config, currentUser).createTool(),
  ];
}
