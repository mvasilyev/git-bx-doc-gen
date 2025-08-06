#!/bin/bash

# GitLab MR Documentation Generator - Release Script

set -e

echo "🚀 Creating release package for GitLab MR Documentation Generator..."

# Get version from package.json
VERSION=$(node -p "require('./package.json').version")
PACKAGE_NAME="gitlab-mr-doc-generator-v${VERSION}.zip"

echo "📦 Version: $VERSION"
echo "📁 Package: $PACKAGE_NAME"

# Clean previous packages
echo "🧹 Cleaning previous packages..."
rm -f *.zip

# Validate extension
echo "✅ Validating extension..."
node scripts/validate.js

# Create package
echo "📦 Creating package..."
zip -r "$PACKAGE_NAME" . \
  -x "*.git*" \
  -x "node_modules/*" \
  -x "*.DS_Store" \
  -x "*.zip" \
  -x "*.log" \
  -x "release.sh" \
  -x ".env*"

echo "✨ Package created: $PACKAGE_NAME"
echo ""
echo "📋 Distribution checklist:"
echo "  ✅ Share $PACKAGE_NAME with your team"
echo "  ✅ Include DISTRIBUTION.md for installation instructions"
echo "  ✅ Ensure coworkers have access to your LiteLLM proxy"
echo "  ✅ Provide API keys or access credentials"
echo ""
echo "🎉 Ready for distribution!"
