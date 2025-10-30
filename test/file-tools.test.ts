import {
  GetFileTool,
  UploadFileTool,
  DuplicateFileTool,
  UpdateFileTool,
  GetFileDownloadStatsTool,
  CopyFileTool,
  ListFileBanksTool,
  GetFoldersTool,
  GetFolderPathTool,
  SearchFilesTool,
  GetFileParentsTool,
  ListRootFoldersTool,
} from '../src/tools/file-tools';
import { createMockConfig, createMockUser } from './test-helpers';

describe('File Tools', () => {
  const mockConfig = createMockConfig();
  const mockUser = createMockUser();

  it('GetFileTool should create without error', () => {
    const tool = new GetFileTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('jamespot_get_file');
  });

  it('UploadFileTool should create without error', () => {
    const tool = new UploadFileTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('jamespot_upload_file');
  });

  it('DuplicateFileTool should create without error', () => {
    const tool = new DuplicateFileTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('jamespot_duplicate_file');
  });

  it('UpdateFileTool should create without error', () => {
    const tool = new UpdateFileTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('jamespot_update_file');
  });

  it('GetFileDownloadStatsTool should create without error', () => {
    const tool = new GetFileDownloadStatsTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('jamespot_get_file_downloads');
  });

  it('CopyFileTool should create without error', () => {
    const tool = new CopyFileTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('jamespot_copy_file');
  });

  it('ListFileBanksTool should create without error', () => {
    const tool = new ListFileBanksTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('jamespot_list_filebanks');
  });

  it('GetFoldersTool should create without error', () => {
    const tool = new GetFoldersTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('jamespot_get_folders');
  });

  it('GetFolderPathTool should create without error', () => {
    const tool = new GetFolderPathTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('jamespot_get_folder_path');
  });

  it('SearchFilesTool should create without error', () => {
    const tool = new SearchFilesTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('jamespot_search_files');
  });

  it('GetFileParentsTool should create without error', () => {
    const tool = new GetFileParentsTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('jamespot_get_file_parents');
  });

  it('ListRootFoldersTool should create without error', () => {
    const tool = new ListRootFoldersTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('jamespot_list_root_folders');
  });
});
