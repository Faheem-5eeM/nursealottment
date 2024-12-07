const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Static files
app.use(express.static('public'));
app.use(express.static(__dirname)); 

// Routes
app.use(require('./routes/nurse'));
app.use(require('./routes/patient'));
app.use(require('./routes/admin'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI ?? 'mongodb://localhost:27017/smartcaredb')
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error(err));

// Home Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Contact page
app.get('/about', (req, res) => {
    res.render('about');
});

// contact page
app.get('/contact', (req, res) => {
    res.render('contact');
});

// Logout
app.get('/logout', (req, res) => {
    // Destroy the user session or token
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));


