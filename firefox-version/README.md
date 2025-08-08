# GitLab MR Documentation Generator (Firefox Version)

A Firefox extension that automatically generates comprehensive documentation for GitLab merge requests using AI/LLM integration.

## Features

- **Automatic Diff View**: Automatically switches to the Changes tab on GitLab merge request pages
- **AI-Powered Documentation**: Generates comprehensive documentation using your choice of LLM (OpenAI, Anthropic, or custom)
- **Flexible Configuration**: Configurable base URL, API key, model, and system prompts
- **GitLab Integration**: Seamlessly integrates with GitLab's UI with a dedicated button
- **Copy & Save**: Easy copying of generated documentation
- **Multiple LLM Support**: Works with OpenAI GPT models, Anthropic Claude, and any OpenAI-compatible API
- **Local Ollama Support**: Automatic detection and integration with local Ollama for privacy-focused usage

## Installation

### From Source

1. Clone or download this repository
2. Navigate to the `firefox-version` directory
3. Open Firefox and navigate to `about:debugging`
4. Click "This Firefox" tab
5. Click "Load Temporary Add-on"
6. Select the `manifest.json` file from the `firefox-version` directory
7. The extension will be installed temporarily

**Note**: Firefox temporary add-ons are removed when you restart the browser. You'll need to reload the extension after each restart.

### Local Ollama Setup

For privacy-focused usage with local Ollama, see [OLLAMA_INTEGRATION.md](OLLAMA_INTEGRATION.md) for detailed setup instructions.

## Configuration

1. Click the extension icon in your Firefox toolbar
2. Configure your LLM settings:
   - **Base URL**: API endpoint (e.g., `https://api.openai.com/v1`)
   - **API Key**: Your API key for the chosen service
   - **Model**: Select from supported models or enter a custom one
   - **System Prompt**: Customize how the AI generates documentation

## Usage

1. Navigate to any GitLab merge request page
2. The extension will automatically switch to the Changes tab
3. Click the "📚 Generate Documentation" button that appears in the merge request actions
4. Wait for the AI to analyze the diff and generate documentation
5. Review, copy, or save the generated documentation

## Supported Platforms

- **GitLab.com**: Full support
- **Self-hosted GitLab**: Works with any GitLab instance
- **LLM Providers**:
  - OpenAI (GPT-3.5, GPT-4, GPT-4 Turbo)
  - Anthropic (Claude 3 Sonnet, Claude 3 Opus)
  - Any OpenAI-compatible API
  - Local Ollama (privacy-focused, no API key required)

## Firefox-Specific Notes

- Uses Manifest V2 for maximum Firefox compatibility
- Compatible with Firefox 57.0 and later
- Uses `browser` API with fallback to `chrome` API
- Background scripts are non-persistent for better performance

## Privacy & Security

- All configuration is stored locally in Firefox's sync storage
- API keys are never transmitted except directly to your configured LLM endpoint
- No data is sent to third parties beyond your chosen LLM provider
- Diff content is only sent to your configured LLM service
- **Local Ollama**: When using local Ollama, all processing happens on your machine with no external API calls

## Development

### Project Structure

```
firefox-version/
├── manifest.json          # Firefox extension manifest (V2)
├── content.js             # Main content script for GitLab pages
├── background.js          # Background scripts (non-persistent)
├── popup.html            # Configuration popup interface
├── popup.js              # Popup functionality
├── styles.css            # Extension styles
└── assets/               # Extension assets (icons, etc.)
```

### Local Development

1. Make changes to the source files
2. Go to `about:debugging`
3. Click "Reload" on the extension card
4. Test on a GitLab merge request page

## Differences from Chrome Version

- Uses Manifest V2 instead of V3
- Uses `browser_action` instead of `action`
- Background scripts are non-persistent
- Uses `browser` API with `chrome` fallback
- Different installation process (temporary add-on)

## License

MIT License - see LICENSE file for details.

## Support

For issues, feature requests, or questions:
1. Check existing issues in the repository
2. Create a new issue with detailed information
3. Include Firefox version, GitLab version, and error messages if applicable
