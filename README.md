# Jamespot LangChain Tools

LangChain tools for integrating Jamespot API with AI agents. This package provides a set of structured tools that allow LangChain agents to interact with the Jamespot platform.

## Features

- 🤖 **60 LangChain tools** for Jamespot API operations and external services
- 🛠️ **Utility tools**: Get connection context, manage dates and times for scheduling
- 👥 **User management**: Get, search, and update user profiles
- 👫 **Group operations**: List, search groups and manage members
- 📝 **Content management**: Create, search articles and add comments
- 📅 **Social events**: Create, update, manage social events with full calendar integration
- 🤝 **Meetings**: Create meetings with agenda and reports, manage participants
- 💬 **Messenger**: Send messages and manage discussions
- 📱 **Application management**: Install, configure, and manage Jamespot applications
- 🖼️ **Unsplash images**: Search and find high-quality, free-to-use professional images
- 📁 **File & folder management**: Upload, organize, search files and navigate file banks
- 🔌 **Network utilities**: Token management for file uploads and article attachments
- 🤖 **Multiple LLM providers**: Support for OpenAI, Safebrain, and Mistral AI
- 🔐 **Automatic authentication**: Handle token management transparently
- 📦 **TypeScript support**: Full type safety with TypeScript
- 🎯 **Flexible configuration**: Choose which tools to include
- 🇫🇷 **French documentation**: Complete guide available in French (GUIDE-FR.md)

## Installation

```bash
# Install dependencies
pnpm install

# Build the project
pnpm build
```

## Configuration

### Environment Variables

This project uses environment variables defined in a `.env` file. Copy the `.env.example` file to `.env` and configure the following variables:

```bash
cp .env.example .env
```

#### Required Variables

| Variable | Description |
|----------|-------------|
| `JAMESPOT_URL` | Your Jamespot instance URL (e.g., `https://your-instance.jamespot.com`) |
| `JAMESPOT_EMAIL` | Email address for Jamespot authentication |
| `JAMESPOT_PASSWORD` | Password for Jamespot authentication |
| `OPENAI_API_KEY`, `SAFEBRAIN_API_KEY`, or `MISTRAL_API_KEY` | API key for your chosen LLM provider |

#### LLM Provider Configuration

| Variable | Description |
|----------|-------------|
| `LLM_PROVIDER` | Choose your LLM provider: `openai`, `safebrain`, or `mistral` (default: `openai`) |
| `LLM_MODEL` | Model name (e.g., `gpt-4`, `gpt-4-turbo`) - optional, uses provider defaults |
| `LLM_TEMPERATURE` | Temperature for LLM (0.0 to 1.0) - default: 0 |
| `LLM_MAX_TOKENS` | Maximum tokens for LLM response - optional |

#### OpenAI Configuration (when LLM_PROVIDER=openai)

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | OpenAI API key (starts with `sk-`) |

#### Safebrain Configuration (when LLM_PROVIDER=safebrain)

| Variable | Description |
|----------|-------------|
| `SAFEBRAIN_API_KEY` | Safebrain API key in format `sk_live_...` (required) |
| `SAFEBRAIN_INSTANCE` | Your Safebrain instance domain, e.g., `your-company.safebrain.ai` (required) |
| `SAFEBRAIN_BOT_ID` | The bot ID to use for chat completions (required) |
| `SAFEBRAIN_GROUP_ID` | The group ID where the bot is configured (required) |
| `SAFEBRAIN_MODEL` | Model name (optional, defaults to `gpt-4o`). Available: `gpt-4o`, `gpt-4`, `gpt-4-turbo`, `claude-3-5-sonnet` |
| `SAFEBRAIN_BASE_URL` | Custom base URL (optional, auto-constructed from instance/bot/group if not provided) |

#### Mistral AI Configuration (when LLM_PROVIDER=mistral)

| Variable | Description |
|----------|-------------|
| `MISTRAL_API_KEY` | Mistral API key (required) - Get it from [https://console.mistral.ai/api-keys](https://console.mistral.ai/api-keys) |
| `MISTRAL_MODEL` | Model name (optional, defaults to `mistral-large-latest`). Available models: `mistral-large-latest`, `mistral-medium-latest`, `mistral-small-latest`, `codestral-latest`, `open-mistral-7b`, `open-mixtral-8x7b`, `open-mixtral-8x22b` |

#### Optional Variables

| Variable | Description |
|----------|-------------|
| `UNSPLASH_ACCESS_KEY` | Unsplash API access key for image search tools (optional, only needed if using image tools) |
| `SYSTEM_PROMPT` | Custom system prompt for the AI agent |
| `DEBUG` | Enable debug mode (`true` or `false`) |

#### Getting an Unsplash Access Key

To use the Unsplash image search tools:
1. Create a free account at [Unsplash Developers](https://unsplash.com/developers)
2. Create a new application
3. Copy your Access Key from the application dashboard
4. Add it to your `.env` file as `UNSPLASH_ACCESS_KEY`

**Note:** The free tier provides 50 requests per hour. For production use, you can apply for a higher rate limit (5,000 requests/hour).

#### Example .env Files

**Using OpenAI:**
```bash
# LLM Provider Configuration
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-your-openai-api-key-here

# Jamespot Configuration
JAMESPOT_URL=https://your-jamespot-instance.com
JAMESPOT_EMAIL=your-email@example.com
JAMESPOT_PASSWORD=your-password

# Optional: Unsplash API Configuration (for image search tools)
UNSPLASH_ACCESS_KEY=your-unsplash-access-key-here

# Optional: Custom system prompt
SYSTEM_PROMPT=You are a helpful assistant for the Jamespot platform.
```

**Using Safebrain:**
```bash
# LLM Provider Configuration
LLM_PROVIDER=safebrain
SAFEBRAIN_API_KEY=sk_live_your-safebrain-api-key-here
SAFEBRAIN_INSTANCE=your-company.safebrain.ai
SAFEBRAIN_BOT_ID=123
SAFEBRAIN_GROUP_ID=456
# Optional: SAFEBRAIN_MODEL=gpt-4o

# Jamespot Configuration
JAMESPOT_URL=https://your-jamespot-instance.com
JAMESPOT_EMAIL=your-email@example.com
JAMESPOT_PASSWORD=your-password

# Optional: Unsplash API Configuration (for image search tools)
UNSPLASH_ACCESS_KEY=your-unsplash-access-key-here

# Optional: Custom system prompt
SYSTEM_PROMPT=You are a helpful assistant for the Jamespot platform.
```

**Using Mistral AI:**
```bash
# LLM Provider Configuration
LLM_PROVIDER=mistral
MISTRAL_API_KEY=your-mistral-api-key-here
# Optional: MISTRAL_MODEL=mistral-large-latest

# Jamespot Configuration
JAMESPOT_URL=https://your-jamespot-instance.com
JAMESPOT_EMAIL=your-email@example.com
JAMESPOT_PASSWORD=your-password

# Optional: Unsplash API Configuration (for image search tools)
UNSPLASH_ACCESS_KEY=your-unsplash-access-key-here

# Optional: Custom system prompt
SYSTEM_PROMPT=You are a helpful assistant for the Jamespot platform.
```

**Getting Mistral Credentials:**

1. **API Key**: Go to [https://console.mistral.ai/api-keys](https://console.mistral.ai/api-keys) and create a new API key
2. **Model Selection**: Choose from various models based on your needs:
   - `mistral-large-latest`: Most capable model for complex tasks
   - `mistral-medium-latest`: Balanced performance and cost
   - `mistral-small-latest`: Fast and cost-effective
   - `codestral-latest`: Specialized for code generation

**Getting Safebrain Credentials:**

1. **API Key**: Go to [https://app.safebrain.ai](https://app.safebrain.ai) → Settings → API Keys
2. **Instance**: Your Safebrain instance domain (e.g., `your-company.safebrain.ai`)
3. **Bot ID**: Navigate to the Bots section and copy the bot ID
4. **Group ID**: Navigate to the Groups section and copy the group ID where your bot is configured

## Quick Start

```typescript
import { createJamespotTools } from 'jamespot-langchain-tools';

// Create all tools
const tools = createJamespotTools({
  backendUrl: 'https://your-instance.jamespot.com',
  credentials: {
    email: 'user@example.com',
    password: 'password'
  }
});

// Use with LangChain agent
import { ChatOpenAI } from '@langchain/openai';
import { createReactAgent } from '@langchain/langgraph/prebuilt';

const llm = new ChatOpenAI({ modelName: 'gpt-4' });
const agent = createReactAgent({ llm, tools });

// Agent can now interact with Jamespot
const result = await agent.invoke({
  messages: [{
    role: 'user',
    content: 'Find all groups with "Marketing" in the name'
  }]
});
```

## Available Tools

### Utility Tools (3 tools)

| Tool Name | Description |
|-----------|-------------|
| `jamespot_get_connection_context` | Get backend URL and current user info |
| `jamespot_get_current_datetime` | Get current date/time in Jamespot formats |
| `jamespot_calculate_date` | Calculate dates by adding/subtracting days, hours, minutes |

### User Tools (4 tools)

| Tool Name | Description |
|-----------|-------------|
| `jamespot_get_current_user` | Get current authenticated user info |
| `jamespot_get_user` | Get specific user by ID |
| `jamespot_search_users` | Search users by name/email |
| `jamespot_update_user_profile` | Update current user profile |

### Group Tools (10 tools)

| Tool Name | Description |
|-----------|-------------|
| `jamespot_list_groups` | List user's groups |
| `jamespot_get_group` | Get specific group details |
| `jamespot_get_group_members` | Get group members list |
| `jamespot_search_groups` | Search groups by name |
| `jamespot_create_group` | Create new group/community |
| `jamespot_get_categories_configuration` | Get group categories configuration |
| `jamespot_get_categories` | Get available categories |
| `jamespot_count_members` | Count group members |
| `jamespot_get_group_properties` | Get additional group properties |
| `jamespot_add_member` | Add member or change member role |

### Content Tools (4 tools)

| Tool Name | Description |
|-----------|-------------|
| `jamespot_create_article` | Create new article/post |
| `jamespot_get_article` | Get article by ID |
| `jamespot_search_articles` | Search articles |
| `jamespot_comment_article` | Add comment to article |

### Social Event Tools (6 tools)

| Tool Name | Description |
|-----------|-------------|
| `jamespot_create_social_event` | Create new social event with dates, location, attendees |
| `jamespot_update_social_event` | Update existing social event |
| `jamespot_get_social_event` | Get social event details by ID |
| `jamespot_search_social_events` | Search social events by keywords |
| `jamespot_list_social_events` | List social events with filters |
| `jamespot_delete_social_event` | Delete a social event |

### Meeting Tools (6 tools)

| Tool Name | Description |
|-----------|-------------|
| `jamespot_create_meeting` | Create meeting with agenda and reports |
| `jamespot_update_meeting` | Update existing meeting |
| `jamespot_get_meeting` | Get meeting details including agenda |
| `jamespot_search_meetings` | Search meetings by keywords |
| `jamespot_list_meetings` | List meetings with filters |
| `jamespot_delete_meeting` | Delete a meeting |

### Messenger Tools (6 tools)

| Tool Name | Description |
|-----------|-------------|
| `jamespot_send_message` | Send message in discussion |
| `jamespot_list_recent_discussions` | List recent discussions |
| `jamespot_get_or_create_discussion` | Get or create user discussion |
| `jamespot_get_spot_discussion` | Get group discussion |
| `jamespot_create_spot_discussion` | Create group discussion |
| `jamespot_get_message_reads` | Get message read status |

### Application Tools (4 tools)

| Tool Name | Description |
|-----------|-------------|
| `jamespot_list_applications` | List all available applications |
| `jamespot_install_application` | Install application by hook name |
| `jamespot_uninstall_application` | Uninstall application by hook name |
| `jamespot_application_configuration` | Get application configuration |

### Image Search Tools (3 tools)

| Tool Name | Description |
|-----------|-------------|
| `search_unsplash_images` | Search high-quality Unsplash images with filters |
| `get_unsplash_image_details` | Get detailed info about a specific Unsplash image |
| `get_random_unsplash_image` | Get random Unsplash images with optional filters |

### File Tools (13 tools)

| Tool Name | Description |
|-----------|-------------|
| `jamespot_get_file` | Get file details by ID |
| `jamespot_upload_file` | Upload file from URL |
| `jamespot_duplicate_file` | Duplicate a file and create new article |
| `jamespot_update_file` | Update file title |
| `jamespot_get_file_downloads` | Get file download statistics |
| `jamespot_copy_file` | Copy file to another location |
| `jamespot_list_filebanks` | List all available file banks |
| `jamespot_get_folders` | Get folders within a parent folder |
| `jamespot_get_folder_documents` | Get documents in a folder |
| `jamespot_get_folder_path` | Get folder breadcrumb/path |
| `jamespot_search_files` | Search files and folders |
| `jamespot_get_file_parents` | Get parent folders of a file |
| `jamespot_list_root_folders` | List root-level folders |

### Network Tools (1 tool)

| Tool Name | Description |
|-----------|-------------|
| `jamespot_get_upload_token` | Get upload token for file operations and article attachments |

## Advanced Usage

### Selective Tool Loading

```typescript
// Load only user and group tools
const tools = createJamespotTools({
  backendUrl: 'https://your-instance.jamespot.com',
  credentials: { email: '...', password: '...' },
  tools: {
    user: true,
    group: true,
    content: false  // Exclude content tools
  }
});
```

### Using Existing API Instance

```typescript
import { createJamespotUserApi } from 'jamespot-user-api';
import { createJamespotToolsWithApi } from 'jamespot-langchain-tools';

// Create API instance with custom configuration
const api = createJamespotUserApi('https://your-instance.jamespot.com');

// Create tools with the API instance
const tools = createJamespotToolsWithApi(api, {
  email: 'user@example.com',
  password: 'password'
});
```

## Examples

### Example 1: Simple Agent

```typescript
import { ChatOpenAI } from '@langchain/openai';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { createJamespotTools } from 'jamespot-langchain-tools';

const tools = createJamespotTools({
  backendUrl: 'https://your-instance.jamespot.com',
  credentials: {
    email: 'user@example.com',
    password: 'password'
  }
});

const llm = new ChatOpenAI({ modelName: 'gpt-4', temperature: 0 });
const agent = createReactAgent({ llm, tools });

// Ask the agent to perform tasks
const result = await agent.invoke({
  messages: [{
    role: 'user',
    content: 'Get my user profile and then list all groups I belong to'
  }]
});

console.log(result);
```

### Example 2: Content Creation Agent

```typescript
// Agent that can create and manage content
const result = await agent.invoke({
  messages: [{
    role: 'user',
    content: `Create a new article titled "Weekly Update" with content
              "This week's accomplishments..." in the Marketing group`
  }]
});
```

### Example 3: Research Agent

```typescript
// Agent that can search and gather information
const result = await agent.invoke({
  messages: [{
    role: 'user',
    content: `Find all articles about "project alpha" and summarize the main points`
  }]
});
```

### Example 4: File Attachment Agent

```typescript
// Agent that can upload images and attach them to articles
const result = await agent.invoke({
  messages: [{
    role: 'user',
    content: `Search for an Unsplash image about "teamwork",
              upload it to Jamespot, and create an article about collaboration
              in the Marketing group with the image attached`
  }]
});

// The agent will:
// 1. Use search_unsplash_images to find a suitable image
// 2. Use jamespot_get_upload_token to get a token
// 3. Use jamespot_upload_file with the image URL and token
// 4. Use jamespot_search_groups to find the Marketing group
// 5. Use jamespot_create_article with the same token to create the article with the image attached
```

### Example 5: Manual File Attachment Workflow

If you want to manually orchestrate the file attachment workflow:

```typescript
import { createJamespotTools } from 'jamespot-langchain-tools';

const tools = createJamespotTools({
  backendUrl: 'https://your-instance.jamespot.com',
  credentials: {
    email: 'user@example.com',
    password: 'password'
  }
});

// Step 1: Get an upload token
const getTokenTool = tools.find(t => t.name === 'jamespot_get_upload_token');
const tokenResult = await getTokenTool.invoke({});
const token = JSON.parse(tokenResult).token;

// Step 2: Upload a file using the token
const uploadFileTool = tools.find(t => t.name === 'jamespot_upload_file');
await uploadFileTool.invoke({
  url: 'https://example.com/image.jpg',
  attrName: 'file',
  token: token
});

// Step 3: Create article with the same token (files auto-attach)
const createArticleTool = tools.find(t => t.name === 'jamespot_create_article');
const articleResult = await createArticleTool.invoke({
  title: 'Article with Attached Image',
  description: 'This article has an image attached',
  publishTo: 'spot/123',  // Group ID
  token: token  // IMPORTANT: Use the same token!
});

console.log('Article created with attached file:', articleResult);
```

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Watch mode
pnpm dev

# Run examples
pnpm test
```

## Architecture

```
src/
├── chat.ts                    # Interactive chat interface
├── llm/
│   └── llm-factory.ts        # LLM provider factory (OpenAI/Safebrain)
├── tools/
│   ├── base-tool.ts          # Base class for all tools
│   ├── tools.ts              # Main tool factory
│   ├── utility-tools.ts      # Utility tools (3)
│   ├── user-tools.ts         # User-related tools (4)
│   ├── group-tools.ts        # Group-related tools (10)
│   ├── content-tools.ts      # Content-related tools (4)
│   ├── socialEvent-tools.ts  # Social event tools (6)
│   ├── meeting-tools.ts      # Meeting tools (6)
│   ├── messenger-tools.ts    # Messenger tools (6)
│   ├── application-tools.ts  # Application tools (4)
│   ├── image-search-tools.ts # Image search tools (3)
│   ├── file-tools.ts         # File management tools (13)
│   └── network-tools.ts      # Network utilities (1)
└── utils/
    └── WindowNode.ts         # Node.js adapter for API
```

## Requirements

- Node.js >= 20.17.0
- LangChain Core >= 0.3.0
- jamespot-user-api (local link)

## Error Handling

All tools include built-in error handling and return descriptive error messages to the agent:

```typescript
// Example error output
"Error: Authentication failed"
"Error: Group not found"
"Error: Invalid article ID format"
```

This allows the AI agent to understand what went wrong and potentially retry or ask for clarification.

## TypeScript Support

The package is written in TypeScript and includes full type definitions:

```typescript
import type {
  JamespotToolConfig,
  CreateJamespotToolsConfig
} from 'jamespot-langchain-tools';
```

## Contributing

This package wraps the `jamespot-user-api` and exposes it to LangChain agents. To add new tools:

1. Create a new tool class extending `BaseJamespotTool`
2. Implement the `createTool()` method
3. Define the Zod schema for input validation
4. Add the tool to the appropriate category file or create a new one
5. Export from `index.ts`

## License

ISC
