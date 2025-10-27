import { GetCurrentUserTool, GetUserTool, SearchUsersTool, UpdateUserProfileTool } from '../src/tools/user-tools';
import { createMockConfig, createMockUser } from './test-helpers';

describe('User Tools', () => {
  const mockConfig = createMockConfig();
  const mockUser = createMockUser();

  it('GetCurrentUserTool should create without error', () => {
    const tool = new GetCurrentUserTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('jamespot_get_current_user');
  });

  it('GetUserTool should create without error', () => {
    const tool = new GetUserTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('jamespot_get_user');
  });

  it('SearchUsersTool should create without error', () => {
    const tool = new SearchUsersTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('jamespot_search_users');
  });

  it('UpdateUserProfileTool should create without error', () => {
    const tool = new UpdateUserProfileTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('jamespot_update_user_profile');
  });
});
