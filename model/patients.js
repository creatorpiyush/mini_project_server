const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const patientSchema = new Schema({
    patient_email: {
        type: String,
        required: true,
        unique: true,
    },
    patient_number: {
        type: String,
        required: true,
        unique: true,
    },
    patient_name: {
        type: String,
        required: true,
    },
    patient_password: {
        type: String,
        required: true,
    },
});

const Patients = mongoose.model("patient", patientSchema);
module.exports = Patients;