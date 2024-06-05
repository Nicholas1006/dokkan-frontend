const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
// Serve static files from the 'asset' directory
const dbManagementPath = path.join(__dirname, 'dbManagement');
app.use('/dbManagement', express.static(dbManagementPath)); // specify '/dbManagement' as the base URL for asset files

// Serve static files from the 'website' directory
const websitePath = path.join(__dirname, 'Website');
app.use(express.static(websitePath));

// Define a route that handles requests with sub-URLs
app.get('/:suburl', (req, res) => {
    const suburl = req.params.suburl;
    
    console.log(`Received request for sub-URL: ${suburl}`);
    // Render the template HTML file with suburl parameter
    res.render('template', { suburl: suburl });
});

// Log server start
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


