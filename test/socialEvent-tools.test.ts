import {
  CreateSocialEventTool,
  SearchSocialEventsTool,
} from '../src/tools/socialEvent-tools';
import { createMockConfig, createMockUser } from './test-helpers';

describe('Social Event Tools', () => {
  const mockConfig = createMockConfig();
  const mockUser = createMockUser();

  it('CreateSocialEventTool should create without error', () => {
    const tool = new CreateSocialEventTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('jamespot_create_social_event');
  });

  it('SearchSocialEventsTool should create without error', () => {
    const tool = new SearchSocialEventsTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('jamespot_search_social_events');
  });
});
