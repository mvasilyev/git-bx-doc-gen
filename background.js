// Background service worker for the Chrome extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('GitLab MR Documentation Generator installed');
  
  // Create context menu item
  try {
    chrome.contextMenus.create({
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
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.llmConfig) {
    console.log('LLM configuration updated');
    
    // Notify content scripts about the configuration change
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        if (tab.url && tab.url.includes('/merge_requests/')) {
          chrome.tabs.sendMessage(tab.id, {
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
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_CONFIG') {
    // Return current configuration
    chrome.storage.sync.get(['llmConfig']).then(result => {
      sendResponse(result.llmConfig || null);
    });
    return true; // Will respond asynchronously
  }
  
  if (request.type === 'MAKE_LLM_REQUEST') {
    // Handle LLM requests from content script (for HTTP endpoints from HTTPS pages)
    handleLLMRequest(request, sendResponse);
    return true; // Will respond asynchronously
  }
});

// Function to handle LLM requests
async function handleLLMRequest(request, sendResponse) {
  try {
    const { config, diffContent } = request;
    
    console.log('Making LLM request via background script:', config.baseUrl);
    
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
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
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      sendResponse({
        error: `LLM API error: ${response.status} - ${errorData.error?.message || response.statusText}`
      });
      return;
    }

    const data = await response.json();
    const result = data.choices[0]?.message?.content || 'No documentation generated.';
    
    sendResponse({ result });
  } catch (error) {
    console.error('Background script LLM request error:', error);
    sendResponse({ error: error.message });
  }
}

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'generate-docs') {
    // Send message to content script to trigger documentation generation
    chrome.tabs.sendMessage(tab.id, {
      type: 'GENERATE_DOCS'
    }).catch(error => {
      console.error('Error sending message to content script:', error);
    });
  }
});
