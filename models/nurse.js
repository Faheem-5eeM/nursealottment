const mongoose = require('mongoose');
 // Model for nurses
const nurseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    adhaar: { type: String, required: true },
    unique: { type: String, required: true },
    gender: { type: String, required: true },
    patients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }]
});

module.exports = mongoose.model('Nurse', nurseSchema);
