import {
  SearchUnsplashImagesTool,
  GetUnsplashImageDetailsTool,
  GetRandomUnsplashImageTool,
} from '../src/tools/image-search-tools';
import { createMockConfig, createMockUser } from './test-helpers';

describe('Image Search Tools', () => {
  const mockConfig = createMockConfig();
  const mockUser = createMockUser();

  it('SearchUnsplashImagesTool should create without error', () => {
    const tool = new SearchUnsplashImagesTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('search_unsplash_images');
  });

  it('GetUnsplashImageDetailsTool should create without error', () => {
    const tool = new GetUnsplashImageDetailsTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('get_unsplash_image_details');
  });

  it('GetRandomUnsplashImageTool should create without error', () => {
    const tool = new GetRandomUnsplashImageTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('get_random_unsplash_image');
  });
});
