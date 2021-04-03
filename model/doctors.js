const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const doctorSchema = new Schema({
    doctor_email: {
        type: String,
        required: true,
        unique: true,
    },
    doctor_number: {
        type: String,
        required: true,
        unique: true,
    },
    doctor_name: {
        type: String,
        required: true,
    },
    doctor_password: {
        type: String,
        required: true,
    },
    doctor_s_patients: [{
        type: Schema.Types.ObjectId,
        ref: "patient",
    }, ],
});

const Doctors = mongoose.model("doctor", doctorSchema);
module.exports = Doctors;