const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PatientTemperatureSchema = new Schema({
    temperature: {
        type: String,
        required: true,
    },
    temperature_time: {
        type: Date,
        default: Date.now,
    },
});

const PatientTemperature = mongoose.model(
    "patient_temperature",
    PatientTemperatureSchema
);
module.exports = PatientTemperature;