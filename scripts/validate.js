// Validation script for the Chrome extension
const fs = require('fs');
const path = require('path');

function validateManifest() {
  const manifestPath = path.join(__dirname, '..', 'manifest.json');
  
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    console.log('✅ Manifest validation:');
    console.log(`   Version: ${manifest.version}`);
    console.log(`   Name: ${manifest.name}`);
    console.log(`   Manifest Version: ${manifest.manifest_version}`);
    
    // Check required files exist
    const requiredFiles = [
      'content.js',
      'background.js',
      'popup.html',
      'popup.js',
      'styles.css'
    ];
    
    console.log('\n📁 File validation:');
    requiredFiles.forEach(file => {
      const filePath = path.join(__dirname, '..', file);
      if (fs.existsSync(filePath)) {
        console.log(`   ✅ ${file}`);
      } else {
        console.log(`   ❌ ${file} - MISSING`);
      }
    });
    
    // Check permissions
    console.log('\n🔒 Permissions:');
    manifest.permissions.forEach(permission => {
      console.log(`   ✅ ${permission}`);
    });
    
    console.log('\n🌐 Host permissions:');
    manifest.host_permissions.forEach(host => {
      console.log(`   ✅ ${host}`);
    });
    
    console.log('\n🎯 Content script matches:');
    manifest.content_scripts[0].matches.forEach(match => {
      console.log(`   ✅ ${match}`);
    });
    
    console.log('\n✅ Extension validation complete!');
    
  } catch (error) {
    console.error('❌ Error validating manifest:', error.message);
    process.exit(1);
  }
}

function validateProject() {
  console.log('🔍 Validating GitLab MR Documentation Generator...\n');
  
  validateManifest();
  
  console.log('\n📋 Next steps:');
  console.log('1. Load the extension in Chrome Developer Mode');
  console.log('2. Navigate to chrome://extensions/');
  console.log('3. Enable "Developer mode"');
  console.log('4. Click "Load unpacked" and select this directory');
  console.log('5. Test on a GitLab merge request page');
}

if (require.main === module) {
  validateProject();
}

module.exports = { validateProject, validateManifest };
