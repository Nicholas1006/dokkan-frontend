// config.js
const isLocalDevelopment = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';

const assetConfig = {
  baseUrl: isLocalDevelopment 
    ? '/dbManagement/DokkanFiles' 
    : 'https://dokkan-calc-assets.s3.eu-west-1.amazonaws.com'
  };
window.assetBase=assetConfig.baseUrl

document.addEventListener('DOMContentLoaded', function() {
  const sheets = document.styleSheets;
  for (const sheet of sheets) {
    try {
      const rules = sheet.cssRules || sheet.rules;
      for (const rule of rules) {
        if (rule.style && rule.style.backgroundImage) {
          rule.style.backgroundImage = rule.style.backgroundImage
            .replace("/dbManagement/DokkanFiles", window.assetBase);
        }
      }
    } catch (e) {
      // Skip cross-origin stylesheets
    }
  }
});


// Helper function for easy path generation
window.assetUrl = (path) => {
  const formattedPath = path.replace(/^\//, '');
  const assetUrl = `${window.assetBase}/${formattedPath}`;
  return assetUrl;
};
