const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const port = 3000;
const app = express();

app.use(express.static(__dirname));
app.use(express.static('public'));
app.use(express.json());
app.set('view engine', 'ejs');
// Set the path to your 'views' directory
app.set('views', path.join(__dirname, 'views'));

// Body parser middleware (use only once)
// app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection for Nurses
const nurseDb = mongoose.createConnection('mongodb://localhost:27017/nurses');
nurseDb.once('open', () => {
    console.log("MongoDB connection successful for nurses");
});

// MongoDB connection for Patients
const patientDb = mongoose.createConnection('mongodb://localhost:27017/patients');
patientDb.once('open', () => {
    console.log("MongoDB connection successful for patients");
});
// Check if you're using the correct collection in the nurseDb connection


// Schema for Nurses (using the nursesDb connection)
const nurseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    adhaar: { type: String, required: true },
    unique: { type: String, required: true },
    gender: { type: String, required: true }
});
const Nurse = nurseDb.model("datas", nurseSchema); // Model for nurses

// Schema for Patients (using the patientsDb connection)
const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    adhaar: { type: String, required: true },
    gender: { type: String, required: true }
});
const Patient = patientDb.model("datas", patientSchema); // Model for patients

// Serve initial page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'initialpage.html')); // Ensure index.html is in the root directory
});

// Nurse login route
app.get('/nurse-login', (req, res) => {
    res.sendFile(path.join(__dirname, 'loginn.html'));  // Serve loginn.html
});

// Nurse login POST request
// Nurse login POST request
app.post('/login', async (req, res) => {
    const { name, unique } = req.body;  // Extract name and unique ID from the form data
    console.log(req.body);
    
    if (!name || !unique) {
        return res.status(400).send('Name and Unique ID are required');
    }

    try {
        // Find the nurse by name and unique ID
        const nurse = await Nurse.findOne({ name: name, unique: unique });

        if (!nurse) {
            return res.status(404).send('Nurse not found');
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
        res.status(500).send('Internal Server Error');
    }
});


// Nurse registration route
app.get('/nurse-register', (req, res) => {
    res.sendFile(path.join(__dirname, 'form1.html'));  // Serve nurse registration form
});

app.post('/post', async (req, res) => {
    const { name, contact, email, adhaar, unique, gender } = req.body;

    console.log("hh1: ",req.body, name, contact, email, adhaar, unique, gender );
    if (!name || !contact || !email || !adhaar || !unique || !gender) {
        return res.status(400).send("All fields are required");
    }

    try {// Check if the email already exists
        const existingNurse = await Nurse.findOne({ email: email });
        if (existingNurse) {
            return res.status(400).send("Email already in use");
        }

        // Check if the unique ID already exists
        const existingUnique = await Nurse.findOne({ unique: unique });
        if (existingUnique) {
            return res.status(400).send("Unique ID already in use");
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
        res.sendFile(path.join(__dirname, 'success.html'));
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Patient login route
app.get('/user-login', (req, res) => {
    res.sendFile(path.join(__dirname, 'loginu.html'));  // Serve user login form
});

// Patient login POST request
app.post('/userlogin', async (req, res) => {
    const { name, adhaar } = req.body;  // Extract name and adhaar from the form data

    if (!name || !adhaar) {
        return res.status(400).send('Name and Aadhaar are required');
    }

    try {
        // Find the patient by name and adhaar
        const patient = await Patient.findOne({ name: name, adhaar: adhaar });

        if (!patient) {
            return res.status(404).send('Patient not found');
        }

        // Fetch all nurses from the nurseDb
        const nurses = await Nurse.find({});

        // Render the user-dashboard and pass both the patient data and nurses data
        res.render('user-dashboard', {
            patient: patient,
            nurses: nurses  // Pass the nurses data here
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


// Patient registration route
app.get('/user-register', (req, res) => {
    res.sendFile(path.join(__dirname, 'form.html'));  // Serve patient registration form
});

app.post('/postva', async (req, res) => {
    const { name, contact, email, adhaar, gender } = req.body;

    console.log("hh: ",name, contact, email, adhaar, gender);
    if (!name || !contact || !email || !adhaar || !gender) {
        return res.status(400).send("All fields are required");
    }

    try {
        const patient = new Patient({
            name,
            contact,
            email,
            adhaar,
            gender
        });

        await patient.save();
        console.log(patient);
        res.sendFile(path.join(__dirname, 'success1.html'));
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});
// GET route for displaying the login page
app.get('/admin-login', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));  // Serve the login page
});

// POST route for handling login form submission
app.post('/admin-login', (req, res) => {
    const { username, password } = req.body;

    console.log('Received username:', username);  // Debugging line
    console.log('Received password:', password);  // Debugging line

    // Example admin credentials (replace this with your actual database query)
    if (username === 'Shallen' && password === 'sequeira') {
        return res.redirect('/admin-dashboard');  // Redirect to the dashboard if credentials match
    } else {
        return res.status(401).send('Invalid Credentials');  // Send error if credentials don't match
    }
});

// GET route for the admin dashboard


// Express route to serve the dashboard HTML
app.get('/admin-dashboard', async (req, res) => {
    try {
        // Get the total count of nurses and patients
        const nurseCount = await Nurse.countDocuments();
        const patientCount = await Patient.countDocuments();

        // Render the Handlebars template and pass dynamic data
        res.render('admin-dashboard', { nurseCount, patientCount });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/logout', (req, res) => {
    // Destroy the user session or token
    res.sendFile(path.join(__dirname, 'initialpage.html'));
    });

  // Admin dashboard route


//   app.get('/jj', async (req, res) => {
    
//     const nurse = await Nurse.find({});
//     const patients = await Nurse.find({});
//     nurse.name = "niz";
//     // Destroy the user session or token
//     res.render("nurse-dashboard", {patients,nurse})
//     });

// Start the server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
