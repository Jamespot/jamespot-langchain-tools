import {
  ListGroupsTool,
  GetGroupTool,
  GetGroupMembersTool,
  SearchGroupsTool,
  CreateGroupTool,
  GetCategoriesConfigurationTool,
  GetCategoriesTool,
  CountMembersTool,
  GetPropertiesTool,
  AddMemberTool,
} from '../src/tools/group-tools';
import { createMockConfig, createMockUser } from './test-helpers';

describe('Group Tools', () => {
  const mockConfig = createMockConfig();
  const mockUser = createMockUser();

  it('ListGroupsTool should create without error', () => {
    const tool = new ListGroupsTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('jamespot_list_groups');
  });

  it('GetGroupTool should create without error', () => {
    const tool = new GetGroupTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('jamespot_get_group');
  });

  it('GetGroupMembersTool should create without error', () => {
    const tool = new GetGroupMembersTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('jamespot_get_group_members');
  });

  it('SearchGroupsTool should create without error', () => {
    const tool = new SearchGroupsTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('jamespot_search_groups');
  });

  it('CreateGroupTool should create without error', () => {
    const tool = new CreateGroupTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('jamespot_create_group');
  });

  it('GetCategoriesConfigurationTool should create without error', () => {
    const tool = new GetCategoriesConfigurationTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('jamespot_get_categories_configuration');
  });

  it('GetCategoriesTool should create without error', () => {
    const tool = new GetCategoriesTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('jamespot_get_categories');
  });

  it('CountMembersTool should create without error', () => {
    const tool = new CountMembersTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('jamespot_count_members');
  });

  it('GetPropertiesTool should create without error', () => {
    const tool = new GetPropertiesTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('jamespot_get_group_properties');
  });

  it('AddMemberTool should create without error', () => {
    const tool = new AddMemberTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('jamespot_add_member');
  });
});
