<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Chrome Extension Development Instructions

This is a Chrome extension project for GitLab merge request documentation generation. When working on this project:

## Project Context
- **Type**: Chrome Extension (Manifest V3)
- **Target**: GitLab merge request pages (gitlab.com and self-hosted)
- **Purpose**: Automatically generate documentation from merge request diffs using LLM APIs
- **Architecture**: Content script + Background service worker + Popup configuration

## Technical Guidelines

### Chrome Extension Best Practices
- Always use Manifest V3 syntax and APIs
- Use `chrome.storage.sync` for user settings
- Implement proper error handling for all Chrome APIs
- Use content scripts for page interaction, service workers for background tasks
- Follow Chrome Web Store guidelines for security and permissions

### GitLab Integration
- Target GitLab merge request pages with URL patterns: `*/merge_requests/*`
- Handle GitLab's SPA navigation using MutationObserver
- Work with GitLab's CSS classes and DOM structure
- Automatically switch to diff view (.diffs, .merge-request-tabs-content)
- Extract diff content from .diff-file elements

### LLM Integration
- Support OpenAI API format and compatible services
- Implement proper API error handling and user feedback
- Allow configurable endpoints, models, and system prompts
- Handle rate limiting and API failures gracefully
- Secure API key storage using Chrome storage APIs

### Code Style
- Use modern JavaScript (ES2020+) with async/await
- Implement proper error boundaries and user feedback
- Use semantic HTML and accessible UI components
- Follow Chrome extension security best practices
- Add proper JSDoc comments for complex functions

### UI/UX Guidelines
- Integrate seamlessly with GitLab's existing UI
- Use GitLab-compatible styling and button designs
- Provide clear user feedback during processing
- Make configuration intuitive and discoverable
- Handle mobile/responsive layouts

When suggesting code changes:
1. Ensure compatibility with Chrome extension limitations
2. Test with different GitLab instances and versions
3. Consider error states and edge cases
4. Maintain security and privacy best practices
5. Follow the existing code structure and patterns
