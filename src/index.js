// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const process = require('process');

// Initialize the application
const app = express();

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Database connection
const dbURI = 'your_database_uri';  // replace with your actual database URI
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.error('Database connection error:', err));

// Graceful shutdown
const shutdown = () => {
    console.log('Shutting down gracefully...');
    mongoose.connection.close(() => {
        console.log('Database connection closed');
        process.exit(0);
    });
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
