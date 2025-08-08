# Ollama Integration

This extension now supports local Ollama integration for generating documentation without requiring external API keys.

## Features

- **Automatic Detection**: The extension automatically detects if Ollama is running locally
- **Model Selection**: Available Ollama models are automatically loaded into the model dropdown
- **Easy Setup**: Click "Use local Ollama" to automatically configure the extension for local Ollama
- **No API Key Required**: Local Ollama doesn't require an API key

## Setup Instructions

### 1. Install Ollama

First, install Ollama on your system:

**macOS/Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

**Windows:**
Download from https://ollama.ai/download

### 2. Start Ollama

Start the Ollama service:
```bash
ollama serve
```

### 3. Pull a Model

Pull a model you want to use (e.g., llama2):
```bash
ollama pull llama2
```

### 4. Configure the Extension

1. Open the extension popup
2. If Ollama is running, you'll see a "🔗 Use local Ollama" link below the URL field
3. Click the link to automatically set the URL to `http://localhost:11434`
4. The model dropdown will be populated with your available Ollama models
5. Select your preferred model
6. Save the configuration

## How It Works

### Automatic Detection

The extension checks for Ollama availability by making a request to `http://localhost:11434/api/tags`. If Ollama is running, it will:

1. Show the "Use local Ollama" link
2. Load available models into the dropdown
3. Allow you to use Ollama without an API key

### API Compatibility

The extension automatically detects Ollama endpoints and uses the appropriate API format:

- **Ollama**: Uses `/api/generate` endpoint with prompt-based format
- **Other APIs**: Uses `/chat/completions` endpoint with message-based format

### Model Format

Ollama models are displayed in the dropdown as:
```
model-name (Ollama)
```

## Troubleshooting

### Ollama Not Detected

1. Make sure Ollama is running: `ollama serve`
2. Check if Ollama is accessible: `curl http://localhost:11434/api/tags`
3. Ensure no firewall is blocking port 11434

### No Models Available

1. Pull a model: `ollama pull llama2`
2. List available models: `ollama list`
3. Refresh the extension popup

### API Errors

1. Check if the model is properly downloaded: `ollama list`
2. Try a different model
3. Check Ollama logs for errors

## Testing

You can test Ollama integration using the provided test script:

```bash
node test-ollama.js
```

This will check if Ollama is available and test the API functionality.

## Security Notes

- Local Ollama runs on your machine and doesn't require API keys
- All requests are made to `localhost:11434`
- No data is sent to external services when using local Ollama
- The extension respects your browser's security policies for localhost requests

## Supported Models

Any model available in Ollama can be used. Popular models include:

- `llama2` - Meta's Llama 2
- `codellama` - Code-focused Llama variant
- `mistral` - Mistral AI's model
- `gemma` - Google's Gemma model

To see all available models, visit: https://ollama.ai/library
