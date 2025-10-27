import { GetUploadTokenTool } from '../src/tools/network-tools';
import { createMockConfig, createMockUser } from './test-helpers';

describe('Network Tools', () => {
  const mockConfig = createMockConfig();
  const mockUser = createMockUser();

  it('GetUploadTokenTool should create without error', () => {
    const tool = new GetUploadTokenTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('jamespot_get_upload_token');
  });
});
