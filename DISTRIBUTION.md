# GitLab MR Documentation Generator - Distribution Guide

## 📦 For Your Coworkers

Your Chrome extension `gitlab-mr-doc-generator-v1.0.0.zip` is ready for distribution!

## 🚀 Installation Instructions for Coworkers

### **Step 1: Download & Extract**
1. Download the `gitlab-mr-doc-generator-v1.0.0.zip` file
2. Extract it to a folder (e.g., `Documents/chrome-extensions/gitlab-mr-doc-generator/`)
3. Remember the folder location

### **Step 2: Install in Chrome**
1. Open Chrome and go to `chrome://extensions/`
2. Enable **"Developer mode"** (toggle in top right)
3. Click **"Load unpacked"**
4. Select the extracted folder
5. The extension should now appear in your extensions list

### **Step 3: Configure the Extension**
1. Click the extension icon in Chrome toolbar (puzzle piece icon)
2. Configure your LLM settings:
   - **Base URL**: `http://litellm-proxy.ivandivan/v1` (for your internal setup)
   - **API Key**: Your API key
   - **Model**: Choose appropriate model
   - **System Prompt**: Use default or customize

### **Step 4: Use the Extension**
1. Navigate to any GitLab merge request on `git.bx`
2. Look for the **"📚 Generate Documentation"** button
3. Click it to generate AI-powered documentation
4. Copy or save the generated documentation

## ⚙️ Configuration Examples

### For Internal LiteLLM Proxy
```
Base URL: http://litellm-proxy.ivandivan/v1
API Key: [your-api-key]
Model: [your-preferred-model]
```

### For OpenAI (if using external)
```
Base URL: https://api.openai.com/v1
API Key: sk-[your-openai-key]
Model: gpt-4
```

## 🔧 Troubleshooting

### **Extension Not Loading**
- Make sure you extracted the zip file completely
- Enable "Developer mode" in Chrome extensions
- Check that you selected the correct folder (should contain `manifest.json`)

### **No Button Appears**
- Make sure you're on a GitLab merge request page
- Check that the URL matches: `git.bx/*/merge_requests/*`
- Try refreshing the page

### **API Errors**
- Verify your base URL and API key in the extension popup
- Check that the LiteLLM proxy is accessible from your network
- Ensure the API endpoint is correct

### **Mixed Content Errors**
- The extension automatically handles HTTP/HTTPS mixed content
- If issues persist, contact the extension maintainer

## 📱 Browser Support
- ✅ Chrome (recommended)
- ✅ Edge (Chromium-based)
- ✅ Brave
- ✅ Other Chromium-based browsers

## 🔄 Updates
When updates are available:
1. Download the new zip file
2. Extract to the same folder (overwrite existing files)
3. Go to `chrome://extensions/`
4. Click the refresh icon on the extension

## 🆘 Support
For issues or questions:
1. Check the troubleshooting section above
2. Contact the extension maintainer
3. Check browser console for error messages (F12 → Console tab)

---

**Ready to boost your merge request documentation! 📚✨**
