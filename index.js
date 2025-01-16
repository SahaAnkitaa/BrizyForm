
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createObjectCsvWriter } = require('csv-writer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// CSV Writer Setup
const csvWriter = createObjectCsvWriter({
    path: 'formData.csv',
    header: [
        { id: 'name', title: 'Name' },
        { id: 'email', title: 'Email' },
        { id: 'location', title: 'Location' }
    ],
    append: true // This will append to the existing file
});

// Serve the static HTML file
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to receive form data
app.post('/submit-form', (req, res) => {
    const { name, email, location } = req.body;

    // Write data to CSV
    csvWriter.writeRecords([{ name, email, location }])
        .then(() => {
            console.log('Data written to CSV file successfully.');
            res.status(200).send({ message: 'Data saved successfully!' });
        })
        .catch((error) => {
            console.error('Error writing to CSV:', error);
            res.status(500).send({ message: 'Error saving data.' });
        });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
