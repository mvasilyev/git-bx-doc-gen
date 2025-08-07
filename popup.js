// Popup script for configuration
document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('config-form');
  const statusDiv = document.getElementById('status');
  const modelSelect = document.getElementById('model');
  const customModelGroup = document.getElementById('custom-model-group');
  const resetBtn = document.getElementById('reset-btn');
  const ollamaLink = document.getElementById('ollama-link');
  const useOllamaLink = document.getElementById('use-ollama-link');

  // Default configuration
  const defaultConfig = {
    baseUrl: 'https://api.openai.com/v1',
    apiKey: '',
    model: 'gpt-3.5-turbo',
    systemPrompt: `You are a technical documentation expert. Generate clear, comprehensive documentation for the given code changes in the merge request diff. 

Please include:
1. **Summary**: Brief overview of what changed
2. **Technical Details**: Key implementation details and architecture changes
3. **Impact Analysis**: How these changes affect the system
4. **Usage Examples**: Code examples or usage patterns if applicable
5. **Testing Notes**: Suggested testing approaches for these changes

Format your response in clean, readable markdown.`
  };

  // Check if Ollama is available locally
  async function checkOllamaAvailability() {
    try {
      const response = await fetch('http://localhost:11434/api/tags', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.models || [];
      }
    } catch (error) {
      console.log('Ollama not available:', error.message);
    }
    return null;
  }

  // Load Ollama models into select
  async function loadOllamaModels() {
    const models = await checkOllamaAvailability();
    if (models && models.length > 0) {
      // Show Ollama link
      ollamaLink.style.display = 'block';
      
      // Clear existing options except the first few default ones
      const defaultOptions = ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'claude-3-sonnet-20240229', 'claude-3-opus-20240229'];
      const currentValue = modelSelect.value;
      
      // Keep default options
      const defaultOptionElements = Array.from(modelSelect.children).filter(option => 
        defaultOptions.includes(option.value)
      );
      
      // Clear all options
      modelSelect.innerHTML = '';
      
      // Add default options back
      defaultOptionElements.forEach(option => {
        modelSelect.appendChild(option);
      });
      
      // Add Ollama models
      models.forEach(model => {
        const option = document.createElement('option');
        option.value = model.name;
        option.textContent = `${model.name} (Ollama)`;
        modelSelect.appendChild(option);
      });
      
      // Restore current value if it was a custom model
      if (currentValue && !defaultOptions.includes(currentValue)) {
        const customOption = document.createElement('option');
        customOption.value = 'custom';
        customOption.textContent = 'Custom Model';
        modelSelect.appendChild(customOption);
        modelSelect.value = 'custom';
        document.getElementById('customModel').value = currentValue;
        customModelGroup.style.display = 'block';
      }
    }
  }

  // Load saved configuration
  async function loadConfig() {
    try {
      const result = await chrome.storage.sync.get(['llmConfig']);
      const config = result.llmConfig || defaultConfig;
      
      document.getElementById('baseUrl').value = config.baseUrl;
      document.getElementById('apiKey').value = config.apiKey;
      document.getElementById('model').value = config.model;
      document.getElementById('systemPrompt').value = config.systemPrompt;
      
      // Handle custom model
      if (!['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'claude-3-sonnet-20240229', 'claude-3-opus-20240229'].includes(config.model)) {
        document.getElementById('model').value = 'custom';
        document.getElementById('customModel').value = config.model;
        customModelGroup.style.display = 'block';
      }
    } catch (error) {
      showStatus('Error loading configuration: ' + error.message, 'error');
    }
  }

  // Save configuration
  async function saveConfig(config) {
    try {
      await chrome.storage.sync.set({ llmConfig: config });
      showStatus('Configuration saved successfully!', 'success');
      
      // Close popup after a short delay
      setTimeout(() => {
        window.close();
      }, 1500);
    } catch (error) {
      showStatus('Error saving configuration: ' + error.message, 'error');
    }
  }

  // Show status message
  function showStatus(message, type) {
    statusDiv.innerHTML = `<div class="status ${type}">${message}</div>`;
    setTimeout(() => {
      statusDiv.innerHTML = '';
    }, 5000);
  }

  // Handle model selection
  modelSelect.addEventListener('change', (e) => {
    if (e.target.value === 'custom') {
      customModelGroup.style.display = 'block';
      document.getElementById('customModel').required = true;
    } else {
      customModelGroup.style.display = 'none';
      document.getElementById('customModel').required = false;
    }
  });

  // Handle Ollama link click
  useOllamaLink.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('baseUrl').value = 'http://localhost:11434';
    document.getElementById('apiKey').value = 'ollama';
    showStatus('Ollama URL set. No API key needed for local Ollama.', 'success');
  });

  // Handle form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const baseUrl = document.getElementById('baseUrl').value.trim();
    const apiKey = document.getElementById('apiKey').value.trim();
    let model = document.getElementById('model').value;
    const systemPrompt = document.getElementById('systemPrompt').value.trim();
    
    // Validate inputs
    if (!baseUrl || !apiKey || !systemPrompt) {
      showStatus('Please fill in all required fields.', 'error');
      return;
    }
    
    // Handle custom model
    if (model === 'custom') {
      const customModel = document.getElementById('customModel').value.trim();
      if (!customModel) {
        showStatus('Please enter a custom model name.', 'error');
        return;
      }
      model = customModel;
    }
    
    // Save configuration
    const config = {
      baseUrl: baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl,
      apiKey,
      model,
      systemPrompt
    };
    
    await saveConfig(config);
  });

  // Handle reset button
  resetBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset to default settings?')) {
      document.getElementById('baseUrl').value = defaultConfig.baseUrl;
      document.getElementById('apiKey').value = '';
      document.getElementById('model').value = defaultConfig.model;
      document.getElementById('systemPrompt').value = defaultConfig.systemPrompt;
      document.getElementById('customModel').value = '';
      customModelGroup.style.display = 'none';
      showStatus('Settings reset to defaults.', 'success');
    }
  });

  // Initialize
  await loadConfig();
  
  // Check for Ollama availability and load models
  await loadOllamaModels();
});
