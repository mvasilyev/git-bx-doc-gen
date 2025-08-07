# GitLab MR Documentation Generator

A Chrome extension that automatically generates comprehensive documentation for GitLab merge requests using AI/LLM integration.

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
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory
5. The extension will be installed and ready to use

### Local Ollama Setup

For privacy-focused usage with local Ollama, see [OLLAMA_INTEGRATION.md](OLLAMA_INTEGRATION.md) for detailed setup instructions.

### Configuration

1. Click the extension icon in your Chrome toolbar
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

## Configuration Options

### LLM Settings

- **Base URL**: The API endpoint for your LLM service
- **API Key**: Authentication key for the LLM service
- **Model**: The specific model to use for generation
- **System Prompt**: Instructions for how to generate documentation

### Default System Prompt

The extension comes with a comprehensive default system prompt that generates:

1. **Summary**: Brief overview of changes
2. **Technical Details**: Key implementation details
3. **Impact Analysis**: System impact assessment
4. **Usage Examples**: Code examples when applicable
5. **Testing Notes**: Testing recommendations

## Privacy & Security

- All configuration is stored locally in Chrome's sync storage
- API keys are never transmitted except directly to your configured LLM endpoint
- No data is sent to third parties beyond your chosen LLM provider
- Diff content is only sent to your configured LLM service
- **Local Ollama**: When using local Ollama, all processing happens on your machine with no external API calls

## Development

### Project Structure

```
├── manifest.json          # Chrome extension manifest
├── content.js             # Main content script for GitLab pages
├── background.js          # Background service worker
├── popup.html            # Configuration popup interface
├── popup.js              # Popup functionality
├── styles.css            # Extension styles
└── assets/               # Extension assets (icons, etc.)
```

### Local Development

1. Make changes to the source files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Test on a GitLab merge request page

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on different GitLab instances
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues, feature requests, or questions:
1. Check existing issues in the repository
2. Create a new issue with detailed information
3. Include browser version, GitLab version, and error messages if applicable

## Changelog

### Version 1.1.0
- Added local Ollama integration
- Automatic Ollama detection and model loading
- Privacy-focused local processing option
- No API key required for local Ollama usage

### Version 1.0.0
- Initial release
- Support for GitLab merge request pages
- Automatic diff view switching
- Configurable LLM integration
- Documentation generation and display
- Support for multiple LLM providers
