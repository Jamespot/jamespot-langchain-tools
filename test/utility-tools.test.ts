import { GetCurrentDateTimeTool } from '../src/tools/utility-tools';
import { createMockConfig, createMockUser } from './test-helpers';

describe('Utility Tools', () => {
  const mockConfig = createMockConfig();
  const mockUser = createMockUser();

  it('GetCurrentDateTimeTool should create without error', () => {
    const tool = new GetCurrentDateTimeTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('jamespot_get_current_datetime');
  });
});
