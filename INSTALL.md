# Installation & Development Guide

This project provides separate versions for Chrome and Firefox browsers.

## Chrome Version

### Quick Installation

#### Step 1: Load the Extension
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the root directory of this project (contains `manifest.json`)

#### Step 2: Configure the Extension
1. Click the extension icon in Chrome toolbar
2. Configure your LLM settings:
   - **Base URL**: `https://api.openai.com/v1` (for OpenAI) or `http://localhost:11434` (for Ollama)
   - **API Key**: Your API key (e.g., `sk-...`) - not needed for local Ollama
   - **Model**: Choose your preferred model
   - **System Prompt**: Customize or use the default

#### Step 3: Test the Extension
1. Navigate to any GitLab merge request page
2. Look for the "📚 Generate Documentation" button
3. Click it to generate documentation

## Firefox Version

### Quick Installation

#### Step 1: Load the Extension
1. Open Firefox and go to `about:debugging`
2. Click "This Firefox" tab
3. Click "Load Temporary Add-on"
4. Select the `manifest.json` file from the `firefox-version` directory

#### Step 2: Configure the Extension
1. Click the extension icon in Firefox toolbar
2. Configure your LLM settings (same as Chrome)
3. Save the configuration

**Note**: Firefox temporary add-ons are removed when you restart the browser.

## Local Ollama Setup

Both versions support local Ollama integration:

1. **Install Ollama**
   ```bash
   curl -fsSL https://ollama.ai/install.sh | sh
   ```

2. **Start Ollama**
   ```bash
   ollama serve
   ```

3. **Pull a model**
   ```bash
   ollama pull llama2
   ```

4. **Configure extension**
   - Open the extension popup
   - Click "🔗 Use local Ollama" if available
   - Select your preferred model from the dropdown

## Development Setup

### Prerequisites
- Node.js 14+ (for validation scripts)
- Chrome browser (for Chrome version)
- Firefox browser 57.0+ (for Firefox version)
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
- Base URL: Your local API endpoint (e.g., `http://localhost:11434`)
- Model: Your model name

#### Local Ollama
- Base URL: `http://localhost:11434`
- API Key: Not required
- Models: Automatically detected from your local Ollama installation

### Debugging

#### Console Logs
- Open DevTools on GitLab page
- Check Console for extension logs
- Look for any error messages

#### Extension Debugging

**Chrome:**
- Go to `chrome://extensions/`
- Click "Inspect views" > "service worker" (for background script)
- Click "Inspect views" > "popup.html" (for popup debugging)

**Firefox:**
- Go to `about:debugging`
- Click "This Firefox" tab
- Find your extension and click "Inspect" for background script debugging
- For popup debugging, right-click the extension icon and select "Inspect Element"

#### Common Issues

**Chrome:**
1. **No button appears**: Check if you're on a merge request page
2. **API errors**: Verify your API key and base URL
3. **No diff content**: Ensure you're on the Changes tab

**Firefox:**
1. **Extension disappears**: Firefox temporary add-ons are removed on restart
2. **Not loading**: Make sure you're selecting the manifest.json from firefox-version directory
3. **API errors**: Same as Chrome - verify API key and endpoint

**Ollama:**
1. **Not detected**: Make sure Ollama is running (`ollama serve`)
2. **No models**: Pull a model first (`ollama pull llama2`)
3. **Connection errors**: Check if port 11434 is accessible

### File Structure

**Chrome Version (Root Directory):**
```
├── manifest.json          # Chrome extension configuration (V3)
├── content.js             # Main functionality for GitLab pages
├── background.js          # Background service worker
├── popup.html/js          # Configuration interface
├── styles.css             # Extension styling
├── scripts/validate.js    # Validation utilities
└── assets/                # Icons and resources
```

**Firefox Version (`firefox-version/` Directory):**
```
├── manifest.json          # Firefox extension configuration (V2)
├── content.js             # Main functionality for GitLab pages
├── background.js          # Background scripts (non-persistent)
├── popup.html/js          # Configuration interface
├── styles.css             # Extension styling
└── assets/                # Icons and resources
```

### Making Changes

**Chrome Development:**
1. Edit the relevant files in the root directory
2. Go to `chrome://extensions/`
3. Click the refresh icon on your extension
4. Test your changes on a GitLab page

**Firefox Development:**
1. Edit the relevant files in the `firefox-version` directory
2. Go to `about:debugging`
3. Click "Reload" on your extension
4. Test your changes on a GitLab page

### Distribution
1. Run `npm run package` to create a zip file
2. Upload to Chrome Web Store / Firefox Add-ons (if publishing)
3. Or distribute the zip file for manual installation

### Key Differences

| Feature | Chrome Version | Firefox Version |
|---------|---------------|-----------------|
| Manifest Version | V3 | V2 |
| Installation | Permanent | Temporary |
| Background Scripts | Service Worker | Non-persistent |
| API | `chrome` | `browser` with `chrome` fallback |
| Action | `action` | `browser_action` |

### Security Notes

- Both versions store configuration locally in browser storage
- API keys are only sent to your configured LLM endpoint
- Local Ollama provides complete privacy (no external API calls)
- No data is sent to third parties beyond your chosen LLM provider
