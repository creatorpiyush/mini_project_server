const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const patientDataSchema = new Schema({
    patient_problem: {
        type: String,
        required: true,
    },
    patient_email: {
        type: String,
        required: true,
    },
    patient_temperature: [{
        type: Schema.Types.ObjectId,
        ref: "patient_temperature",
    }, ],
    patient_relative_name: {
        type: String,
        required: true,
    },
    patient_relative_number: {
        type: String,
        required: true,
    },
    patient_address: {
        type: String,
        required: true,
    },
});

const PatientData = mongoose.model("patient_data", patientDataSchema);
module.exports = PatientData;