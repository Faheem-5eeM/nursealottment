const mongoose = require('mongoose');
// Model for patients
const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    adhaar: { type: String, required: true },
    gender: { type: String, required: true }
});

module.exports = mongoose.model('Patient', patientSchema);
