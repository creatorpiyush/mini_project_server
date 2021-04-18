const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const patientSchema = new Schema({
    patient_email: {
        type: String,
        required: true,
    },
    patient_number: {
        type: String,
        required: true,
    },
    patient_name: {
        type: String,
        required: true,
    },
    patient_password: {
        type: String,
        required: true,
    },
    patient_data: {
        type: Schema.Types.ObjectId,
        ref: "patient_data",
    },
});

const Patients = mongoose.model("patient", patientSchema);
module.exports = Patients;