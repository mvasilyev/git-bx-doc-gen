# Installation Guide

This project provides separate versions for Chrome and Firefox browsers.

## Chrome Version

### Installation Steps

1. **Download the extension**
   - Clone or download this repository
   - Navigate to the root directory (Chrome version)

2. **Open Chrome Extensions**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right corner

3. **Load the extension**
   - Click "Load unpacked"
   - Select the root directory of this project (contains `manifest.json`)
   - The extension will be installed and appear in your extensions list

4. **Configure the extension**
   - Click the extension icon in your Chrome toolbar
   - Configure your LLM settings (API key, model, etc.)
   - Save the configuration

## Firefox Version

### Installation Steps

1. **Download the extension**
   - Clone or download this repository
   - Navigate to the `firefox-version` directory

2. **Open Firefox Debugging**
   - Open Firefox and navigate to `about:debugging`
   - Click the "This Firefox" tab

3. **Load the extension**
   - Click "Load Temporary Add-on"
   - Select the `manifest.json` file from the `firefox-version` directory
   - The extension will be installed temporarily

4. **Configure the extension**
   - Click the extension icon in your Firefox toolbar
   - Configure your LLM settings (API key, model, etc.)
   - Save the configuration

## Key Differences

| Feature | Chrome Version | Firefox Version |
|---------|---------------|-----------------|
| Manifest Version | V3 | V2 |
| Installation | Permanent | Temporary |
| Background Scripts | Service Worker | Non-persistent |
| API | `chrome` | `browser` with `chrome` fallback |
| Action | `action` | `browser_action` |

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

## Troubleshooting

### Chrome Issues

- **Extension not loading**: Make sure you're in the correct directory (root, not firefox-version)
- **Permissions denied**: Check that Developer mode is enabled
- **API errors**: Verify your API key and endpoint URL

### Firefox Issues

- **Extension disappears**: Firefox temporary add-ons are removed on restart
- **Not loading**: Make sure you're selecting the manifest.json from firefox-version directory
- **API errors**: Same as Chrome - verify API key and endpoint

### Ollama Issues

- **Not detected**: Make sure Ollama is running (`ollama serve`)
- **No models**: Pull a model first (`ollama pull llama2`)
- **Connection errors**: Check if port 11434 is accessible

## Development

### Chrome Development

1. Make changes to files in the root directory
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Test your changes

### Firefox Development

1. Make changes to files in the `firefox-version` directory
2. Go to `about:debugging`
3. Click "Reload" on the extension card
4. Test your changes

## Security Notes

- Both versions store configuration locally in browser storage
- API keys are only sent to your configured LLM endpoint
- Local Ollama provides complete privacy (no external API calls)
- No data is sent to third parties beyond your chosen LLM provider
