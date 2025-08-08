// Background service worker for the Firefox extension
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

browserAPI.runtime.onInstalled.addListener(() => {
  console.log('GitLab MR Documentation Generator (Firefox) installed');
  
  // Create context menu item
  try {
    browserAPI.contextMenus.create({
      id: 'generate-docs',
      title: 'Generate Documentation',
      contexts: ['page'],
      documentUrlPatterns: [
        '*://*.gitlab.com/*/merge_requests/*',
        '*://*.gitlab.io/*/merge_requests/*',
        '*://git.bx/*/merge_requests/*'
      ]
    });
  } catch (error) {
    console.error('Error creating context menu:', error);
  }
});

// Listen for storage changes to update content scripts
browserAPI.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.llmConfig) {
    console.log('LLM configuration updated');
    
    // Notify content scripts about the configuration change
    browserAPI.tabs.query({}).then((tabs) => {
      tabs.forEach(tab => {
        if (tab.url && tab.url.includes('/merge_requests/')) {
          browserAPI.tabs.sendMessage(tab.id, {
            type: 'CONFIG_UPDATED',
            config: changes.llmConfig.newValue
          }).catch(() => {
            // Ignore errors for tabs that don't have content script loaded
          });
        }
      });
    });
  }
});

// Handle messages from content scripts
browserAPI.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background script received message:', request.type);
  
  if (request.type === 'GET_CONFIG') {
    // Return current configuration
    browserAPI.storage.sync.get(['llmConfig']).then(result => {
      sendResponse(result.llmConfig || null);
    }).catch(error => {
      console.error('Error getting config:', error);
      sendResponse(null);
    });
    return true; // Will respond asynchronously
  }
  
  if (request.type === 'MAKE_LLM_REQUEST') {
    // Handle LLM requests from content script (for HTTP endpoints from HTTPS pages)
    console.log('Handling LLM request via background script');
    handleLLMRequest(request, sendResponse);
    return true; // Will respond asynchronously
  }
  
  // Send response for unhandled message types
  sendResponse({ error: 'Unknown message type' });
});

// Function to handle LLM requests
async function handleLLMRequest(request, sendResponse) {
  try {
    const { config, diffContent, isOllama } = request;
    
    console.log('Making LLM request via background script:', config.baseUrl, 'isOllama:', isOllama);
    
    // Prepare request based on API type
    let requestBody;
    let endpoint;
    
    if (isOllama) {
      // Ollama API format
      endpoint = `${config.baseUrl}/api/generate`;
      requestBody = {
        model: config.model,
        prompt: `${config.systemPrompt}\n\nPlease generate documentation for this merge request:\n\n${diffContent}`,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 2000
        }
      };
    } else {
      // OpenAI-compatible API format
      endpoint = `${config.baseUrl}/chat/completions`;
      requestBody = {
        model: config.model,
        messages: [
          {
            role: 'system',
            content: config.systemPrompt
          },
          {
            role: 'user',
            content: `Please generate documentation for this merge request:\n\n${diffContent}`
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      };
    }

    // Prepare headers
    const headers = {
      'Content-Type': 'application/json'
    };
    
    // Add Authorization header only for non-Ollama APIs
    if (!isOllama && config.apiKey) {
      headers['Authorization'] = `Bearer ${config.apiKey}`;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      sendResponse({
        error: `LLM API error: ${response.status} - ${errorData.error?.message || response.statusText}`
      });
      return;
    }

    const data = await response.json();
    
    // Extract response based on API type
    let result;
    if (isOllama) {
      result = data.response || 'No documentation generated.';
    } else {
      result = data.choices[0]?.message?.content || 'No documentation generated.';
    }
    
    sendResponse({ result });
  } catch (error) {
    console.error('Background script LLM request error:', error);
    sendResponse({ error: error.message });
  }
}

// Handle context menu clicks
browserAPI.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'generate-docs') {
    // Send message to content script to trigger documentation generation
    browserAPI.tabs.sendMessage(tab.id, {
      type: 'GENERATE_DOCS'
    }).catch(error => {
      console.error('Error sending message to content script:', error);
    });
  }
});
