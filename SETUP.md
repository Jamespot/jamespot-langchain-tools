# Setup and Build Instructions

## ✅ Project Successfully Created!

The `jamespot-langchain-tools` project has been created and built successfully with **60 LangChain tools** for Jamespot API integration.

## Project Structure

```
jamespot-langchain-tools/
├── package.json              # Project configuration
├── tsconfig.json            # TypeScript configuration
├── README.md                # Full documentation (English)
├── GUIDE-FR.md              # Complete guide (French)
├── SETUP.md                 # This file
├── SUCCESS.md               # Success indicators
├── .env.example             # Environment variable template
├── .env                     # Your local configuration (not versioned)
├── .gitignore              # Git ignore rules
├── src/                     # Source files
│   ├── chat.ts             # Interactive chat interface
│   ├── llm/
│   │   └── llm-factory.ts  # LLM provider factory (OpenAI/Safebrain)
│   ├── tools/
│   │   ├── base-tool.ts          # Base class for all tools
│   │   ├── tools.ts              # Main tool factory
│   │   ├── utility-tools.ts      # Utility tools (3)
│   │   ├── user-tools.ts         # User tools (4)
│   │   ├── group-tools.ts        # Group tools (10)
│   │   ├── content-tools.ts      # Content tools (4)
│   │   ├── socialEvent-tools.ts  # Social event tools (6)
│   │   ├── meeting-tools.ts      # Meeting tools (6)
│   │   ├── messenger-tools.ts    # Messenger tools (6)
│   │   ├── application-tools.ts  # Application tools (4)
│   │   ├── image-search-tools.ts # Image search tools (3)
│   │   ├── file-tools.ts         # File management tools (13)
│   │   └── network-tools.ts      # Network utilities (1)
│   └── utils/
│       └── WindowNode.ts         # Node.js adapter for API
└── dist/                    # Compiled JavaScript (after build)
    ├── chat.js
    ├── llm/
    │   └── llm-factory.js
    ├── tools/
    │   └── [all compiled tools]
    └── utils/
        └── WindowNode.js
```

## Installation

### Prerequisites

- **Node.js**: >= 20.17.0 < 21.0.0
- **pnpm**: >= 9.9.0 < 10
- **Jamespot instance**: Access credentials required
- **LLM Provider**: OpenAI or Safebrain account

### Install Dependencies

```bash
pnpm install
```

## Configuration

### Step 1: Create .env file

```bash
cp .env.example .env
```

### Step 2: Configure LLM Provider

#### Option A: Using Safebrain (Recommended)

```bash
# .env file
LLM_PROVIDER=safebrain
SAFEBRAIN_API_KEY=sk_live_your-api-key-here
SAFEBRAIN_INSTANCE=your-company.safebrain.ai
SAFEBRAIN_BOT_ID=123
SAFEBRAIN_GROUP_ID=456
```

Get your credentials:
1. Go to [https://app.safebrain.ai](https://app.safebrain.ai)
2. **API Key**: Settings → API Keys
3. **Bot ID**: Bots section
4. **Group ID**: Groups section

#### Option B: Using OpenAI

```bash
# .env file
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-your-openai-api-key
```

#### Option C: Using Mistral AI

```bash
# .env file
LLM_PROVIDER=mistral
MISTRAL_API_KEY=your-mistral-api-key-here
# Optional: MISTRAL_MODEL=mistral-large-latest
```

Get your credentials:
1. Go to [https://console.mistral.ai/api-keys](https://console.mistral.ai/api-keys)
2. Create a new API key
3. Choose your model (default: `mistral-large-latest`)
   - `mistral-large-latest`: Most capable, complex tasks
   - `mistral-medium-latest`: Balanced performance/cost
   - `mistral-small-latest`: Fast and cost-effective
   - `codestral-latest`: Specialized for code

### Step 3: Configure Jamespot

```bash
# .env file
JAMESPOT_URL=https://your-instance.jamespot.pro
JAMESPOT_EMAIL=your-email@example.com
JAMESPOT_PASSWORD=your-password
```

### Step 4: Optional Configuration

```bash
# Unsplash (for image search)
UNSPLASH_ACCESS_KEY=your-unsplash-key

# System prompt
SYSTEM_PROMPT=You are a helpful Jamespot assistant.

# Debug mode
DEBUG=false

# LLM settings
LLM_TEMPERATURE=0
LLM_MAX_TOKENS=2000
```

## Building

```bash
# Build the project
pnpm build

# Watch mode for development
pnpm dev
```

## Running the Agent

### Interactive Chat Mode

```bash
# Start the interactive chat
pnpm chat

# With debug mode
pnpm chat:debug
```

You'll see:
```
🚀 Starting Jamespot AI Agent...

--- Connecting to plaform ---
✓ Login successful!
User ID: 3
User Name: Paul Giraudon
✓ Created 60 tools

📊 LLM Configuration:
   Provider: safebrain
   Model: gpt-4o
   Temperature: 0
   Bot ID: 17481
   Group ID: 3015
   API Key: ✓ Set

✓ Agent ready!
============================================================
You can now chat with the Jamespot AI Agent
Type "exit" or "quit" to end the conversation
============================================================

You:
```

## Available Tools (60 Total)

### Utility Tools (3)
1. `jamespot_get_connection_context` - Get backend URL and current user
2. `jamespot_get_current_datetime` - Get current date/time
3. `jamespot_calculate_date` - Calculate dates

### User Tools (4)
4. `jamespot_get_current_user` - Get authenticated user
5. `jamespot_get_user` - Get specific user
6. `jamespot_search_users` - Search users
7. `jamespot_update_user_profile` - Update profile

### Group Tools (10)
8. `jamespot_list_groups` - List groups
9. `jamespot_get_group` - Get group details
10. `jamespot_get_group_members` - Get members
11. `jamespot_search_groups` - Search groups
12. `jamespot_create_group` - Create group
13. `jamespot_get_categories_configuration` - Get categories config
14. `jamespot_get_categories` - Get categories
15. `jamespot_count_members` - Count members
16. `jamespot_get_group_properties` - Get properties
17. `jamespot_add_member` - Add/modify member

### Content Tools (4)
18. `jamespot_create_article` - Create article
19. `jamespot_get_article` - Get article
20. `jamespot_search_articles` - Search articles
21. `jamespot_comment_article` - Add comment

### Social Event Tools (6)
22. `jamespot_create_social_event` - Create event
23. `jamespot_update_social_event` - Update event
24. `jamespot_get_social_event` - Get event
25. `jamespot_search_social_events` - Search events
26. `jamespot_list_social_events` - List events
27. `jamespot_delete_social_event` - Delete event

### Meeting Tools (6)
28. `jamespot_create_meeting` - Create meeting
29. `jamespot_update_meeting` - Update meeting
30. `jamespot_get_meeting` - Get meeting
31. `jamespot_search_meetings` - Search meetings
32. `jamespot_list_meetings` - List meetings
33. `jamespot_delete_meeting` - Delete meeting

### Messenger Tools (6)
34. `jamespot_send_message` - Send message
35. `jamespot_list_recent_discussions` - List discussions
36. `jamespot_get_or_create_discussion` - Get/create discussion
37. `jamespot_get_spot_discussion` - Get group discussion
38. `jamespot_create_spot_discussion` - Create group discussion
39. `jamespot_get_message_reads` - Get read status

### Application Tools (4)
40. `jamespot_list_applications` - List apps
41. `jamespot_install_application` - Install app
42. `jamespot_uninstall_application` - Uninstall app
43. `jamespot_application_configuration` - Get config

### Image Search Tools (3)
44. `search_unsplash_images` - Search Unsplash images
45. `get_unsplash_image_details` - Get image details
46. `get_random_unsplash_image` - Get random image

### File Tools (13)
47. `jamespot_get_file` - Get file details
48. `jamespot_upload_file` - Upload file
49. `jamespot_duplicate_file` - Duplicate file
50. `jamespot_update_file` - Update file
51. `jamespot_get_file_downloads` - Get download stats
52. `jamespot_copy_file` - Copy file
53. `jamespot_list_filebanks` - List filebanks
54. `jamespot_get_folders` - Get folders
55. `jamespot_get_folder_documents` - Get documents
56. `jamespot_get_folder_path` - Get folder path
57. `jamespot_search_files` - Search files
58. `jamespot_get_file_parents` - Get parent folders
59. `jamespot_list_root_folders` - List root folders

### Network Tools (1)
60. `jamespot_get_upload_token` - Get upload token

## Testing

### Run Example Chat

```bash
pnpm chat
```

Try these commands:
- "Qui suis-je ?" (Who am I?)
- "Liste tous mes groupes" (List my groups)
- "Crée un article sur les bonnes pratiques" (Create article)
- "Planifie une réunion demain à 14h" (Schedule meeting)

## Development Commands

```bash
# Build
pnpm build

# Watch mode (auto-rebuild)
pnpm dev

# Chat mode
pnpm chat

# Chat with debug
pnpm chat:debug

# Lint
pnpm lint

# Fix linting issues
pnpm lint:fix
```

## Troubleshooting

### Error: "OPENAI_API_KEY environment variable is missing"

**Solution**:
1. Check `.env` file exists
2. Verify `LLM_PROVIDER` is set correctly
3. Add corresponding API key
4. Rebuild: `pnpm build`

### Error: "Safebrain Bot ID and Group ID are required"

**Solution**: Add to `.env`:
```bash
SAFEBRAIN_BOT_ID=your-bot-id
SAFEBRAIN_GROUP_ID=your-group-id
```

### Error: "Login failed"

**Solution**: Verify Jamespot credentials in `.env`

### Build Errors

**Solutions**:
- Ensure Node.js >= 20.17.0 < 21.0.0
- Run `pnpm clean-install`
- Delete `node_modules` and reinstall

### Agent Not Responding

**Solutions**:
1. Check internet connection
2. Verify LLM provider is accessible
3. Enable debug mode: `pnpm chat:debug`
4. Check `.env` configuration

## Key Features

### 1. Multiple LLM Providers
- OpenAI (GPT-4, GPT-3.5)
- Safebrain (GPT-4o, Claude 3.5 Sonnet)
- Mistral AI (Mistral Large, Codestral, etc.)

### 2. Date/Time Management
- Agent knows current date/time
- Can calculate relative dates ("tomorrow", "next week")
- Proper timezone handling

### 3. File Attachment Workflow
```
1. Get upload token
2. Upload file with token
3. Create content with same token
4. Files automatically attach
```

### 4. Structured Content Creation
- HTML support in articles
- Rich formatting (headers, lists, etc.)
- Image attachment support
- Minimum 1000 words (configurable)

### 5. Connection Context
- Agent knows its backend URL
- Can construct full URLs
- Knows current user info

## Next Steps

1. **Customize System Prompt** - Edit `SYSTEM_PROMPT` in `.env`
2. **Add Custom Tools** - Extend `src/tools/` directory
3. **Integrate with Your App** - Use tools in your LangChain application
4. **Read Documentation** - Check `GUIDE-FR.md` (French) or `README.md` (English)

## Success Indicators ✅

✅ **60 tools created successfully**
✅ **LLM provider configured (OpenAI or Safebrain)**
✅ **Jamespot connection established**
✅ **Chat interface working**
✅ **TypeScript compiled without errors**
✅ **All dependencies installed**

## Documentation

- **English**: `README.md`
- **French**: `GUIDE-FR.md`
- **Setup**: `SETUP.md` (this file)
- **Success**: `SUCCESS.md`

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the documentation
3. Enable debug mode to see detailed logs
4. Create an issue on the project repository

## License

ISC

---

**Project Status**: ✅ Ready to use
**Last Updated**: October 2024
**Version**: 1.0.0
