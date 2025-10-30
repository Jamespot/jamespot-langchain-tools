import {
  SendMessageTool,
  ListRecentDiscussionsTool,
  GetOrCreateDiscussionTool,
  GetSpotDiscussionTool,
  CreateSpotDiscussionTool,
  GetMessageReadsTool,
} from '../src/tools/messenger-tools';
import { createMockConfig, createMockUser } from './test-helpers';

describe('Messenger Tools', () => {
  const mockConfig = createMockConfig();
  const mockUser = createMockUser();

  it('SendMessageTool should create without error', () => {
    const tool = new SendMessageTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('jamespot_send_message');
  });

  it('ListRecentDiscussionsTool should create without error', () => {
    const tool = new ListRecentDiscussionsTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('jamespot_list_recent_discussions');
  });

  it('GetOrCreateDiscussionTool should create without error', () => {
    const tool = new GetOrCreateDiscussionTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('jamespot_get_or_create_discussion');
  });

  it('GetSpotDiscussionTool should create without error', () => {
    const tool = new GetSpotDiscussionTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('jamespot_get_spot_discussion');
  });

  it('CreateSpotDiscussionTool should create without error', () => {
    const tool = new CreateSpotDiscussionTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('jamespot_create_spot_discussion');
  });

  it('GetMessageReadsTool should create without error', () => {
    const tool = new GetMessageReadsTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('jamespot_get_message_reads');
  });
});
