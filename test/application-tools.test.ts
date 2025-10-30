import {
  ListApplicationsTool,
  InstallApplicationTool,
  UninstallApplicationTool,
  ApplicationGetConfigurationTool,
} from '../src/tools/application-tools';
import { createMockConfig, createMockUser } from './test-helpers';

describe('Application Tools', () => {
  const mockConfig = createMockConfig();
  const mockUser = createMockUser();

  it('ListApplicationsTool should create without error', () => {
    const tool = new ListApplicationsTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('jamespot_list_applications');
  });

  it('InstallApplicationTool should create without error', () => {
    const tool = new InstallApplicationTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('jamespot_install_application');
  });

  it('UninstallApplicationTool should create without error', () => {
    const tool = new UninstallApplicationTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('jamespot_uninstall_application');
  });

  it('ApplicationGetConfigurationTool should create without error', () => {
    const tool = new ApplicationGetConfigurationTool(mockConfig, mockUser);
    const createdTool = tool.createTool();
    expect(createdTool).toBeDefined();
    expect(createdTool.name).toBe('jamespot_application_configuration');
  });
});
