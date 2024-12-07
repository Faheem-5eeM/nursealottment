const express = require('express');
const app = express.Router();
const Patient = require('../models/patient');
const Nurse = require('../models/nurse');

// Nurse login route
app.get('/nurse-login', (req, res) => {
  res.render('nurse-login', { error: null });
});

app.post('/login', async (req, res) => {
  const { name, unique } = req.body;  // Extract name and unique ID from the form data
  console.log(req.body);

  if (!name || !unique) {
    return res.render('nurse-login', { error: 'Name and Unique ID are required' });
  }

  try {
    // Find the nurse by name and unique ID
    const nurse = await Nurse.findOne({ name: name, unique: unique });

    if (!nurse) {
      return res.render('nurse-login', { error: 'Nurse not found' });
    }

    // Fetch all patients from the patientsDb
    const patients = await Patient.find({});

    // Render the nurse dashboard with the nurse data and patients data
    res.render('nurse-dashboard', {
      nurse: nurse,
      patients: patients  // Pass the patients data here
    });
  } catch (error) {
    console.error(error);
    res.render('nurse-login', { error: 'Internal Server Error' });
  }
});

// Nurse registration route
app.get('/nurse-register', (req, res) => {
    res.render('nurse-register', { error: null, formData: null}); 
});

app.post('/post', async (req, res) => {
    let { name, contact, email, adhaar, unique, gender } = req.body;

    console.log("hh1: ",req.body, name, contact, email, adhaar, unique, gender );
    if (!name || !contact || !email || !adhaar || !unique || !gender) {
        return res.render('nurse-register', { 
            error: 'All fields are required', 
            formData: req.body 
        });
    }
    if (!contact.startsWith("+91")) {
        contact = "+91" + contact.replace(/^(\+91)/, ""); // Prepend +91 if missing
    }
    try { 
        const duplicateCheck = await Promise.all([
            Nurse.findOne({ email }),
            Nurse.findOne({ unique })
        ]);
    
        const [existingNurse, existingUnique] = duplicateCheck;
    
        if (existingNurse) {
            return res.render('nurse-register', {
                error: 'Email already in use',
                formData: req.body
            });
        }
    
        if (existingUnique) {
            return res.render('nurse-register', {
                error: 'Unique ID already in use',
                formData: req.body
            });
        }
        const nurse = new Nurse({
            name,
            contact,
            email,
            adhaar,
            unique,
            gender
        });

        await nurse.save();
        console.log(nurse);
        res.render('success', {
            title: 'Nurse Registration Successful!',
            message: 'Your nurse registration has been completed successfully.',
            redirectUrl: '/nurse-login'
        });
    } catch (error) {
        console.error(error);
        res.render('nurse-register', { 
            error: 'Internal Server Error', 
            formData: req.body 
        });
    }
});


module.exports = app;
