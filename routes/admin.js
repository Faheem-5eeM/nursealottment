const express = require('express');
const app = express.Router();
const Nurse = require('../models/nurse');
const Patient = require('../models/patient');

// Admin login
app.get('/admin-login', (req, res) => {
    res.render('admin-login', { error: null }); 
});

app.post('/admin-login', (req, res) => {
    const { username, password } = req.body;

    console.log('Received username:', username);  // Debugging line
    console.log('Received password:', password);  // Debugging line

    // Example admin credentials (replace this with your actual database query)
    if (username === 'Shallen' && password === 'sequeira' || username === 'admin' && password === 'admin123') {
        return res.redirect('/admin-dashboard');  // Redirect to the dashboard if credentials match
    } else {    
        return res.render('admin-login', { error: 'Invalid Credentials' });
    }
});

// Admin dashboard
app.get('/admin-dashboard', async (req, res) => {
  try {
      // Get the total count of nurses and patients
      const nurseCount = await Nurse.countDocuments();
      const patientCount = await Patient.countDocuments();
      const connectedPatientsCount = await Patient.countDocuments({ 'nurse': { $ne: null } }); 

      // Render the Handlebars template and pass dynamic data
      res.render('admin-dashboard', { nurseCount, patientCount, connectedPatientsCount });
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});

module.exports = app;
