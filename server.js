const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the 'asset' directory
const dbManagementPath = path.join(__dirname, 'dbManagement');
app.use('/dbManagement', express.static(dbManagementPath)); // specify '/dbManagement' as the base URL for asset files

// Serve static files from the 'website' directory
const websitePath = path.join(__dirname, 'Website');
app.use(express.static(websitePath));

// Define a route that handles requests with sub-URLs
app.get('/:subURL', (req, res) => {
    const subURL = req.params.subURL;
    console.log(`Received request for sub-URL: ${subURL}`);
    // Render the template HTML file with subURL parameter
    res.sendFile(path.join(__dirname, 'Website', 'template.html'), { subURL });
});

// Log server start
const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


