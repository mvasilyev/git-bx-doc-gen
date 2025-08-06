// Popup script for configuration
document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('config-form');
  const statusDiv = document.getElementById('status');
  const modelSelect = document.getElementById('model');
  const customModelGroup = document.getElementById('custom-model-group');
  const resetBtn = document.getElementById('reset-btn');

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
});
