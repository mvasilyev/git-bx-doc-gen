# Installation & Development Guide

## Quick Installation

### Step 1: Load the Extension
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select this project directory (`/Users/m.a.vasilyev/doc-gen`)

### Step 2: Configure the Extension
1. Click the extension icon in Chrome toolbar
2. Configure your LLM settings:
   - **Base URL**: `https://api.openai.com/v1` (for OpenAI)
   - **API Key**: Your API key (e.g., `sk-...`)
   - **Model**: Choose your preferred model
   - **System Prompt**: Customize or use the default

### Step 3: Test the Extension
1. Navigate to any GitLab merge request page
2. Look for the "📚 Generate Documentation" button
3. Click it to generate documentation

## Development Setup

### Prerequisites
- Node.js 14+ (for validation scripts)
- Chrome browser
- Access to a GitLab instance with merge requests

### Local Development
```bash
# Validate the extension
npm run validate

# Package for distribution
npm run package
```

### Testing Different LLM Providers

#### OpenAI
- Base URL: `https://api.openai.com/v1`
- Models: `gpt-3.5-turbo`, `gpt-4`, `gpt-4-turbo`

#### Anthropic Claude
- Base URL: `https://api.anthropic.com/v1` (if using compatible proxy)
- Models: `claude-3-sonnet-20240229`, `claude-3-opus-20240229`

#### Local/Self-hosted LLMs
- Base URL: Your local API endpoint (e.g., `http://localhost:11434/v1`)
- Model: Your model name

### Debugging

#### Console Logs
- Open DevTools on GitLab page
- Check Console for extension logs
- Look for any error messages

#### Extension Debugging
- Go to `chrome://extensions/`
- Click "Inspect views" > "service worker" (for background script)
- Click "Inspect views" > "popup.html" (for popup debugging)

#### Common Issues
1. **No button appears**: Check if you're on a merge request page
2. **API errors**: Verify your API key and base URL
3. **No diff content**: Ensure you're on the Changes tab

### File Structure
```
├── manifest.json          # Extension configuration
├── content.js             # Main functionality for GitLab pages
├── background.js          # Background service worker
├── popup.html/js          # Configuration interface
├── styles.css             # Extension styling
├── scripts/validate.js    # Validation utilities
└── assets/                # Icons and resources
```

### Making Changes
1. Edit the relevant files
2. Go to `chrome://extensions/`
3. Click the refresh icon on your extension
4. Test your changes on a GitLab page

### Distribution
1. Run `npm run package` to create a zip file
2. Upload to Chrome Web Store (if publishing)
3. Or distribute the zip file for manual installation
