import {
  CreateArticleTool,
  GetArticleTool,
  SearchArticlesTool,
  CommentArticleTool,
} from '../src/tools/content-tools';
import { createMockConfig, createMockUser } from './test-helpers';

describe('Content Tools', () => {
  const mockConfig = createMockConfig();
  const mockUser = createMockUser();

  it('CreateArticleTool should create without error', () => {
    const tool = new CreateArticleTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('jamespot_create_article');
  });

  it('GetArticleTool should create without error', () => {
    const tool = new GetArticleTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('jamespot_get_article');
  });

  it('SearchArticlesTool should create without error', () => {
    const tool = new SearchArticlesTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('jamespot_search_articles');
  });

  it('CommentArticleTool should create without error', () => {
    const tool = new CommentArticleTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('jamespot_comment_article');
  });
});
