// config.js
const isLocalDevelopment = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1';

const assetConfig = {
  baseUrl: isLocalDevelopment 
    ? '/dbManagement/DokkanFiles' 
    : 'https://dokkan-calc-assets.s3.eu-west-1.amazonaws.com'
};

// Make it globally available
window.assetConfig = assetConfig;