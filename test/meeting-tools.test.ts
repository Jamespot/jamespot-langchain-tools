import {
  CreateMeetingTool,
  SearchMeetingsTool,
} from '../src/tools/meeting-tools';
import { createMockConfig, createMockUser } from './test-helpers';

describe('Meeting Tools', () => {
  const mockConfig = createMockConfig();
  const mockUser = createMockUser();

  it('CreateMeetingTool should create without error', () => {
    const tool = new CreateMeetingTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('jamespot_create_meeting');
  });

  it('SearchMeetingsTool should create without error', () => {
    const tool = new SearchMeetingsTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('jamespot_search_meetings');
  });
});
