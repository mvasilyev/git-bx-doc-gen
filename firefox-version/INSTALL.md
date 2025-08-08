# Installation & Development Guide (Firefox Version)

## Quick Installation

### Step 1: Load the Extension
1. Open Firefox and go to `about:debugging`
2. Click "This Firefox" tab
3. Click "Load Temporary Add-on"
4. Select the `manifest.json` file from this directory

### Step 2: Configure the Extension
1. Click the extension icon in Firefox toolbar
2. Configure your LLM settings:
   - **Base URL**: `https://api.openai.com/v1` (for OpenAI) or `http://localhost:11434` (for Ollama)
   - **API Key**: Your API key (e.g., `sk-...`) - not needed for local Ollama
   - **Model**: Choose your preferred model
   - **System Prompt**: Customize or use the default

### Step 3: Test the Extension
1. Navigate to any GitLab merge request page
2. Look for the "📚 Generate Documentation" button
3. Click it to generate documentation

### Local Ollama Setup (Optional)
1. Install Ollama: `curl -fsSL https://ollama.ai/install.sh | sh`
2. Start Ollama: `ollama serve`
3. Pull a model: `ollama pull llama2`
4. In the extension popup, click "🔗 Use local Ollama" if available

## Development Setup

### Prerequisites
- Node.js 14+ (for validation scripts)
- Firefox browser (57.0+)
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
- Go to `about:debugging`
- Click "This Firefox" tab
- Find your extension and click "Inspect" for background script debugging
- For popup debugging, right-click the extension icon and select "Inspect Element"

#### Common Issues
1. **No button appears**: Check if you're on a merge request page
2. **API errors**: Verify your API key and base URL
3. **No diff content**: Ensure you're on the Changes tab

### File Structure
```
├── manifest.json          # Firefox extension configuration (V2)
├── content.js             # Main functionality for GitLab pages
├── background.js          # Background scripts (non-persistent)
├── popup.html/js          # Configuration interface
├── styles.css             # Extension styling
├── scripts/validate.js    # Validation utilities
└── assets/                # Icons and resources
```

### Making Changes
1. Edit the relevant files
2. Go to `about:debugging`
3. Click "Reload" on your extension
4. Test your changes on a GitLab page

### Distribution
1. Run `npm run package` to create a zip file
2. Upload to Firefox Add-ons (if publishing)
3. Or distribute the zip file for manual installation

### Firefox-Specific Notes
- **Temporary Installation**: Firefox add-ons are temporary and will be removed on browser restart
- **Manifest V2**: This version uses Manifest V2 for maximum Firefox compatibility
- **Browser API**: Uses `browser` API with `chrome` fallback for cross-browser compatibility
- **Non-persistent Background**: Background scripts are non-persistent for better performance
