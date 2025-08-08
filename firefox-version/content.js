// Content script that runs on GitLab merge request pages
class GitLabMRDocGenerator {
  constructor() {
    this.isProcessing = false;
    this.config = null;
    this.navigationObserverSetup = false;
    this.init();
  }

  async init() {
    // Load configuration from storage
    await this.loadConfig();
    
    // Wait for page to fully load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  async loadConfig() {
    try {
      const result = await chrome.storage.sync.get(['llmConfig']);
      this.config = result.llmConfig || {
        baseUrl: 'https://api.openai.com/v1',
        apiKey: '',
        model: 'gpt-3.5-turbo',
        systemPrompt: 'You are a technical documentation expert. Generate clear, comprehensive documentation for the given code changes in the merge request diff. Include: 1) Summary of changes, 2) Technical details, 3) Impact analysis, 4) Usage examples if applicable.'
      };
    } catch (error) {
      console.error('Failed to load config:', error);
    }
  }

  setup() {
    // Check if we're on a merge request page
    if (!this.isMergeRequestPage()) {
      return;
    }

    // Prevent multiple setups on the same page
    if (document.getElementById('doc-gen-button')) {
      console.log('Extension already initialized on this page');
      return;
    }

    console.log('Setting up GitLab MR Documentation Generator');

    // Switch to diff view automatically
    this.switchToDiffView();

    // Add the documentation generation button
    this.addDocGenerationButton();

    // Monitor for navigation changes (GitLab is a SPA)
    if (!this.navigationObserverSetup) {
      this.observeNavigation();
      this.navigationObserverSetup = true;
    }
  }

  isMergeRequestPage() {
    return window.location.pathname.includes('/merge_requests/') && 
           window.location.pathname.match(/\/merge_requests\/\d+/);
  }

  switchToDiffView() {
    // Check if we're already on the diff view
    if (window.location.href.includes('/diffs') || document.querySelector('.diffs .diff-file')) {
      console.log('Already on diff view');
      this.waitForDiffView();
      return;
    }

    // Look for the "Changes" tab and click it if not already active
    const changesTab = document.querySelector('a[data-track-label="changes"], a[href*="diffs"]');
    if (changesTab && !changesTab.classList.contains('active')) {
      console.log('Switching to Changes tab');
      changesTab.click();
    }

    // Wait a bit and check for diff view elements
    setTimeout(() => {
      this.waitForDiffView();
    }, 1000);
  }

  waitForDiffView() {
    let attempts = 0;
    const maxAttempts = 10;
    
    const checkForDiffs = () => {
      attempts++;
      const diffContainer = document.querySelector('.diffs, .merge-request-tabs-content');
      const diffFiles = document.querySelector('.diff-file');
      
      if (diffContainer && diffFiles) {
        console.log('Diff view is ready');
        this.onDiffViewReady();
      } else if (attempts < maxAttempts) {
        setTimeout(checkForDiffs, 500);
      } else {
        console.log('Timeout waiting for diff view');
      }
    };
    checkForDiffs();
  }

  onDiffViewReady() {
    console.log('Diff view is ready');
    // Diff view is now loaded and ready for processing
  }

  addDocGenerationButton() {
    // Find a suitable location to add the button (usually near the MR actions)
    const actionsContainer = document.querySelector('.merge-request-actions, .detail-page-header-actions');
    
    if (actionsContainer && !document.getElementById('doc-gen-button')) {
      const button = document.createElement('button');
      button.id = 'doc-gen-button';
      button.className = 'btn btn-default gl-button btn-default-secondary';
      button.innerHTML = `
        <span class="gl-button-text">
          📚 Generate Documentation
        </span>
      `;
      button.addEventListener('click', () => this.generateDocumentation());
      
      actionsContainer.insertBefore(button, actionsContainer.firstChild);
    }
  }

  async generateDocumentation() {
    if (this.isProcessing) {
      return;
    }

    // Check if this is an Ollama endpoint (no API key needed)
    const isOllama = this.config.baseUrl.includes('localhost:11434') || this.config.baseUrl.includes('127.0.0.1:11434');
    
    if (!isOllama && !this.config.apiKey) {
      alert('Please configure your LLM API key in the extension popup first.');
      return;
    }

    this.isProcessing = true;
    const button = document.getElementById('doc-gen-button');
    const originalText = button.innerHTML;
    
    try {
      button.innerHTML = '<span class="gl-button-text">⏳ Generating...</span>';
      button.disabled = true;

      // Gather diff content
      const diffContent = this.gatherDiffContent();
      
      if (!diffContent) {
        throw new Error('No diff content found. Make sure you\'re on the Changes tab.');
      }

      // Send to LLM
      const documentation = await this.sendToLLM(diffContent);
      
      // Display the result
      this.displayDocumentation(documentation);

    } catch (error) {
      console.error('Error generating documentation:', error);
      alert(`Error: ${error.message}`);
    } finally {
      this.isProcessing = false;
      button.innerHTML = originalText;
      button.disabled = false;
    }
  }

  gatherDiffContent() {
    const diffFiles = document.querySelectorAll('.diff-file');
    if (!diffFiles.length) {
      return null;
    }

    let diffContent = '';
    
    // Get MR title and description
    const title = document.querySelector('.merge-request-title')?.textContent?.trim();
    const description = document.querySelector('.md, .description')?.textContent?.trim();
    
    diffContent += `Merge Request: ${title}\n`;
    if (description) {
      diffContent += `Description: ${description}\n`;
    }
    diffContent += '\n--- CHANGES ---\n\n';

    diffFiles.forEach(diffFile => {
      const fileName = diffFile.querySelector('.file-title-name')?.textContent?.trim();
      if (fileName) {
        diffContent += `File: ${fileName}\n`;
      }

      // Get the diff content
      const diffLines = diffFile.querySelectorAll('.line_content');
      diffLines.forEach(line => {
        const lineText = line.textContent?.trim();
        if (lineText) {
          diffContent += lineText + '\n';
        }
      });
      
      diffContent += '\n---\n\n';
    });

    return diffContent;
  }

  async sendToLLM(diffContent) {
    // Check if this is an Ollama endpoint
    const isOllama = this.config.baseUrl.includes('localhost:11434') || this.config.baseUrl.includes('127.0.0.1:11434');
    
    // For HTTP endpoints from HTTPS pages, try direct request first, then fallback to background script
    if (window.location.protocol === 'https:' && this.config.baseUrl.startsWith('http:')) {
      console.log('HTTPS page with HTTP endpoint, trying direct request first...');
      
      try {
        // Try direct request first
        return await this.makeDirectRequest(diffContent, isOllama);
      } catch (error) {
        console.log('Direct request failed, trying background script:', error.message);
        
        // Fallback to background script
        return new Promise((resolve, reject) => {
          const browserAPI = typeof browser !== 'undefined' ? browser : chrome;
          browserAPI.runtime.sendMessage({
            type: 'MAKE_LLM_REQUEST',
            config: this.config,
            diffContent: diffContent,
            isOllama: isOllama
          }, (response) => {
            if (browserAPI.runtime.lastError) {
              reject(new Error(browserAPI.runtime.lastError.message));
            } else if (response && response.error) {
              reject(new Error(response.error));
            } else if (response && response.result) {
              resolve(response.result);
            } else {
              reject(new Error('No response from background script'));
            }
          });
        });
      }
    }

    // For direct requests (non-HTTPS to HTTP or same protocol)
    return await this.makeDirectRequest(diffContent, isOllama);
  }

  async makeDirectRequest(diffContent, isOllama) {
    // Prepare request based on API type
    let requestBody;
    let endpoint;
    
    if (isOllama) {
      // Ollama API format
      endpoint = `${this.config.baseUrl}/api/generate`;
      requestBody = {
        model: this.config.model,
        prompt: `${this.config.systemPrompt}\n\nPlease generate documentation for this merge request:\n\n${diffContent}`,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 2000
        }
      };
    } else {
      // OpenAI-compatible API format
      endpoint = `${this.config.baseUrl}/chat/completions`;
      requestBody = {
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: this.config.systemPrompt
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
    if (!isOllama && this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    // Make the request
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`LLM API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    // Extract response based on API type
    if (isOllama) {
      return data.response || 'No documentation generated.';
    } else {
      return data.choices[0]?.message?.content || 'No documentation generated.';
    }
  }

  displayDocumentation(documentation) {
    // Remove existing documentation if present
    const existingDoc = document.getElementById('generated-documentation');
    if (existingDoc) {
      existingDoc.remove();
    }

    // Create documentation display container
    const docContainer = document.createElement('div');
    docContainer.id = 'generated-documentation';
    docContainer.className = 'generated-doc-container';
    docContainer.innerHTML = `
      <div class="doc-header">
        <h3>📚 Generated Documentation</h3>
        <div class="doc-actions">
          <button class="btn btn-sm" onclick="this.parentElement.parentElement.parentElement.style.display='none'">✕ Close</button>
          <button class="btn btn-sm btn-primary" onclick="navigator.clipboard.writeText(this.closest('.generated-doc-container').querySelector('.doc-content').textContent)">📋 Copy</button>
        </div>
      </div>
      <div class="doc-content">
        <pre>${documentation}</pre>
      </div>
    `;

    // Insert the documentation container
    const mrContainer = document.querySelector('.merge-request-details, .merge-request');
    if (mrContainer) {
      mrContainer.insertBefore(docContainer, mrContainer.firstChild);
    } else {
      document.body.appendChild(docContainer);
    }

    // Scroll to the documentation
    docContainer.scrollIntoView({ behavior: 'smooth' });
  }

  observeNavigation() {
    // Watch for URL changes in GitLab SPA
    let currentUrl = window.location.href;
    let isInitialized = false;
    
    const observer = new MutationObserver((mutations) => {
      // Only check URL changes, not all DOM mutations
      if (window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        console.log('URL changed to:', currentUrl);
        
        // Re-initialize if we're on a new MR page and haven't already initialized
        if (this.isMergeRequestPage() && !isInitialized) {
          isInitialized = true;
          setTimeout(() => {
            this.setup();
            isInitialized = false; // Reset after setup
          }, 1000);
        }
      }
    });

    // Only observe childList changes on body, not subtree
    observer.observe(document.body, {
      childList: true,
      subtree: false
    });
    
    // Also listen to popstate events for browser navigation
    window.addEventListener('popstate', () => {
      if (this.isMergeRequestPage()) {
        setTimeout(() => this.setup(), 500);
      }
    });
  }
}

// Listen for messages from background script
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

browserAPI.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'CONFIG_UPDATED') {
    // Reload configuration when updated
    window.gitLabDocGenerator?.loadConfig();
  } else if (request.type === 'GENERATE_DOCS') {
    // Trigger documentation generation from context menu
    window.gitLabDocGenerator?.generateDocumentation();
  }
});

// Initialize the extension and store reference globally for message handling
window.gitLabDocGenerator = new GitLabMRDocGenerator();
