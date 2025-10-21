import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { BaseJamespotTool, JamespotToolConfig } from './base-tool';
import { jUserList } from 'jamespot-user-api';
import { createApi } from 'unsplash-js';
import type { ApiResponse } from 'unsplash-js/dist/helpers/response';
import type { Random, Full } from 'unsplash-js/dist/methods/photos/types';
import type { Photos } from 'unsplash-js/dist/methods/search/types/response';

/**
 * Unsplash API configuration
 * Access key should be provided via environment variable: UNSPLASH_ACCESS_KEY
 */
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || '';

/**
 * Create Unsplash API client
 */
function createUnsplashClient() {
  if (!UNSPLASH_ACCESS_KEY) {
    throw new Error('UNSPLASH_ACCESS_KEY environment variable is not set');
  }
  return createApi({
    accessKey: UNSPLASH_ACCESS_KEY,
  });
}

/**
 * Tool to search Unsplash images
 */
export class SearchUnsplashImagesTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'search_unsplash_images',
      description:
        'Search for high-quality, free-to-use images from Unsplash. ' +
        'Unsplash provides beautiful, professional photos that can be used freely. ' +
        'Returns image URLs at multiple resolutions (thumb, small, regular, full, raw), photographer information, and image metadata. ' +
        'For article images, use the regular resolution, in landscape orientation, and take randomly in the first result page.' +
        'IMPORTANT: Requires UNSPLASH_ACCESS_KEY environment variable to be set.',
      schema: z.object({
        query: z.string().describe('Search query for images (e.g., "mountains", "coffee", "workspace")'),
        page: z.number().min(1).optional().describe('Page number for pagination (default: 1)'),
        perPage: z.number().min(1).max(30).optional().describe('Number of results per page (default: 10, max: 30)'),
        orderBy: z.enum(['relevant', 'latest']).optional()
          .describe('Sort order: relevant or latest (default: relevant)'),
        orientation: z.enum(['landscape', 'portrait', 'squarish']).optional()
          .describe('Filter by image orientation'),
        color: z.enum(['black_and_white', 'black', 'white', 'yellow', 'orange', 'red', 'purple', 'magenta', 'green', 'teal', 'blue']).optional()
          .describe('Filter by color'),
        contentFilter: z.enum(['low', 'high']).optional()
          .describe('Content safety filter level (default: low)'),
      }),
      func: async function({ query, page = 1, perPage = 10, orderBy, orientation, color, contentFilter }) {
        try {
          if (!UNSPLASH_ACCESS_KEY) {
            return 'Error: UNSPLASH_ACCESS_KEY environment variable is not set. Please configure your Unsplash API access key.';
          }

          const unsplash = createUnsplashClient();

          const result: ApiResponse<Photos> = await unsplash.search.getPhotos({
            query,
            page,
            perPage,
            orderBy,
            orientation,
            color,
            contentFilter,
          });

          if (result.type === 'error') {
            return `Error: ${result.errors ? result.errors.join(', ') : 'Failed to search images'}`;
          }

          const data = result.response;

          // Format results for the agent
          const formattedResults = {
            total: data.total,
            total_pages: data.total_pages,
            current_page: page,
            per_page: perPage,
            images: data.results.map(photo => ({
              id: photo.id,
              description: photo.description || photo.alt_description || 'No description',
              urls: {
                thumb: photo.urls.thumb,
                small: photo.urls.small,
                regular: photo.urls.regular,
                full: photo.urls.full,
                raw: photo.urls.raw,
              },
              dimensions: {
                width: photo.width,
                height: photo.height,
              },
              color: photo.color,
              photographer: {
                name: photo.user.name,
                username: photo.user.username,
                profile_url: photo.user.links.html,
                portfolio_url: photo.user.portfolio_url,
              },
              links: {
                html: photo.links.html,
                download: photo.links.download,
              },
              likes: photo.likes,
            })),
          };

          self.logApiResponse('search_unsplash_images', formattedResults);
          return JSON.stringify(formattedResults, null, 2);
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

/**
 * Tool to get detailed information about a specific Unsplash image
 */
export class GetUnsplashImageDetailsTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'get_unsplash_image_details',
      description:
        'Get detailed information about a specific Unsplash image by its ID. ' +
        'Returns comprehensive metadata including EXIF data, location, tags, statistics, and high-resolution download URLs.',
      schema: z.object({
        id: z.string().describe('Unsplash image ID'),
      }),
      func: async function({ id }) {
        try {
          if (!UNSPLASH_ACCESS_KEY) {
            return 'Error: UNSPLASH_ACCESS_KEY environment variable is not set. Please configure your Unsplash API access key.';
          }

          const unsplash = createUnsplashClient();

          const result = await unsplash.photos.get({ photoId: id });

          if (result.type === 'error') {
            return `Error: ${result.errors ? result.errors.join(', ') : 'Failed to get image details'}`;
          }

          const photo = result.response;

          const details = {
            id: photo.id,
            description: photo.description || photo.alt_description || 'No description',
            created_at: photo.created_at,
            updated_at: photo.updated_at,
            dimensions: {
              width: photo.width,
              height: photo.height,
            },
            color: photo.color,
            blur_hash: photo.blur_hash,
            urls: photo.urls,
            links: photo.links,
            likes: photo.likes,
            photographer: {
              name: photo.user.name,
              username: photo.user.username,
              bio: photo.user.bio,
              location: photo.user.location,
              portfolio_url: photo.user.portfolio_url,
              profile_url: photo.user.links.html,
            },
            exif: photo.exif,
            location: photo.location,
            related_collections: photo.related_collections,
          };

          self.logApiResponse('get_unsplash_image_details', details);
          return JSON.stringify(details, null, 2);
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

/**
 * Tool to get random Unsplash images
 */
export class GetRandomUnsplashImageTool extends BaseJamespotTool {
  createTool() {
    const self = this;
    return new DynamicStructuredTool({
      name: 'get_random_unsplash_image',
      description:
        'Get one or more random images from Unsplash. Optionally filter by collections, topics, username, query, or orientation. ' +
        'Useful for getting inspiration or placeholder images.',
      schema: z.object({
        count: z.number().min(1).max(30).optional().describe('Number of random images to retrieve (default: 1, max: 30)'),
        query: z.string().optional().describe('Limit selection to photos matching a search term'),
        username: z.string().optional().describe('Limit selection to a specific user\'s photos'),
        orientation: z.enum(['landscape', 'portrait', 'squarish']).optional()
          .describe('Filter by image orientation'),
        contentFilter: z.enum(['low', 'high']).optional()
          .describe('Content safety filter level (default: low)'),
        collections: z.string().optional().describe('Public collection ID(s) to filter by (comma-separated)'),
        topics: z.string().optional().describe('Public topic ID(s) to filter by (comma-separated)'),
      }),
      func: async function({ count = 1, query, username, orientation, contentFilter, collections, topics }) {
        try {
          if (!UNSPLASH_ACCESS_KEY) {
            return 'Error: UNSPLASH_ACCESS_KEY environment variable is not set. Please configure your Unsplash API access key.';
          }

          const unsplash = createUnsplashClient();

          const params: any = {
            count,
            orientation,
            contentFilter,
          };

          if (query) params.query = query;
          if (username) params.username = username;
          if (collections) params.collectionIds = collections.split(',');
          if (topics) params.topicIds = topics.split(',');

          const result: ApiResponse<Random | Random[]> = await unsplash.photos.getRandom(params);

          if (result.type === 'error') {
            return `Error: ${result.errors ? result.errors.join(', ') : 'Failed to get random images'}`;
          }

          // Response is either a single photo object or an array of photos depending on count
          const photos: Random[] = Array.isArray(result.response) ? result.response : [result.response];

          const formattedResults = {
            count: photos.length,
            images: photos.map(photo => ({
              id: photo.id,
              description: photo.description || photo.alt_description || 'No description',
              urls: {
                thumb: photo.urls.thumb,
                small: photo.urls.small,
                regular: photo.urls.regular,
                full: photo.urls.full,
                raw: photo.urls.raw,
              },
              dimensions: {
                width: photo.width,
                height: photo.height,
              },
              color: photo.color,
              photographer: {
                name: photo.user.name,
                username: photo.user.username,
                profile_url: photo.user.links.html,
              },
              links: {
                html: photo.links.html,
                download: photo.links.download,
              },
              likes: photo.likes,
            })),
          };

          self.logApiResponse('get_random_unsplash_image', formattedResults);
          return JSON.stringify(formattedResults, null, 2);
        } catch (error: any) {
          return `Error: ${self.formatError(error)}`;
        }
      },
    } as any);
  }
}

/**
 * Create all image search tools
 */
export function createImageSearchTools(config: JamespotToolConfig, currentUser: jUserList): any[] {
  return [
    new SearchUnsplashImagesTool(config, currentUser).createTool(),
    new GetUnsplashImageDetailsTool(config, currentUser).createTool(),
    new GetRandomUnsplashImageTool(config, currentUser).createTool(),
  ];
}
