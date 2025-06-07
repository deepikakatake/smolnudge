// eas/hooks/post-install.js
const fs = require('fs');
const path = require('path');

const gradleFile = path.join(__dirname, '..', 'android', 'settings.gradle');

try {
  if (fs.existsSync(gradleFile)) {
    let contents = fs.readFileSync(gradleFile, 'utf8');

    // Remove versionCatalogs block (multiline)
    contents = contents.replace(/versionCatalogs\s*\{[^}]*\}/gs, '');

    // Remove any remaining single-line references
    contents = contents.replace(/.*versionCatalogs.*\n?/g, '');

    fs.writeFileSync(gradleFile, contents, 'utf8');
    console.log('✅ Cleaned android/settings.gradle from versionCatalogs');
  } else {
    console.log('ℹ️ android/settings.gradle not found. Skipping patch.');
  }
} catch (err) {
  console.error('❌ Failed to patch android/settings.gradle:', err.message);
}
