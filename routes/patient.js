const express = require('express');
const app = express.Router();
const Patient = require('../models/patient');
const Nurse = require('../models/nurse');

// Patient login route
app.get('/user-login', (req, res) => {
    res.render('user-login', { error: null }); // Serve user login form
});

app.post('/userlogin', async (req, res) => {
    const { name, adhaar } = req.body;  // Extract name and adhaar from the form data

    if (!name || !adhaar) {
        return res.render('user-login', { error: 'Name and Aadhaar are required' });
    }

    try {
        // Find the patient by name and adhaar
        const patient = await Patient.findOne({ name: name, adhaar: adhaar });

        if (!patient) {
            return res.render('user-login', { error: 'Patient not found' });
        }

        // Fetch all nurses from the nurseDb
        // const nurses = await Nurse.find({});
                
        // Find the nurse(s) connected to this patient
        const nurses = await Nurse.find({ '_id': { $in: patient.nurse } });

        // Render the user-dashboard and pass both the patient data and nurses data
        res.render('user-dashboard', {
            patient: patient,
            nurses: nurses  // Pass the nurses data here
        });
    } catch (error) {
        console.error(error);
        return res.render('user-login', { error: 'Internal Server Error' });
    }
});

// Patient registration route
app.get('/user-register', (req, res) => {
    res.render('user-register', { error: null, formData: null});
});

app.post('/postva', async (req, res) => {
    const { firstName, lastName, contact, email, adhaar, gender } = req.body;
    const name = firstName + " " + lastName;
    console.log("hh: ",name, contact, email, adhaar, gender);
    if (!name || !contact || !email || !adhaar || !gender) {
        return res.render('user-register', { 
            error: 'All fields are required', 
            formData: req.body 
        });
    }

    try {
        const duplicateCheck = await Promise.all([
            Patient.findOne({ email }),
            Patient.findOne({ contact }),
            Patient.findOne({ adhaar })
        ]);
    
        const [existingPatient, existingContact, existingAdhaar] = duplicateCheck;
    
        if (existingPatient) {
            return res.render('user-register', {
                error: 'Email already in use',
                formData: req.body
            });
        }
    
        if (existingContact) {
            return res.render('user-register', {
                error: 'Contact no already in use',
                formData: req.body
            });
        }

        if (existingAdhaar) {
            return res.render('user-register', {
                error: 'Adaar no already in use',
                formData: req.body
            });
        }

        const patient = new Patient({
            name,
            contact,
            email,
            adhaar,
            gender
        });

        await patient.save();
        console.log(patient);
        res.render('success', {
            title: 'Patient Registration Successful!',
            message: 'Your patient registration has been completed successfully.',
            redirectUrl: '/user-login'
        });
    } catch (error) {
        console.error(error);
        res.render('user-register', { 
            error: 'Internal Server Error', 
            formData: req.body 
        });
    }
});

module.exports = app;
