const route = require("express").Router();

const db = require("../model");

route.post("/:patient_email", async(req, res) => {
    await db.PatientData.create({
            patient_problem: req.body.patient_problem,
            patient_email: req.params.patient_email,
            patient_relative_name: req.body.patient_relative_name,
            patient_relative_number: req.body.patient_relative_number,
            patient_address: req.body.patient_address,
        })
        .then((patientdatacontent) => {
            return db.Patients.findOneAndUpdate({ patient_email: req.params.patient_email }, { $push: { patient_data: patientdatacontent._id } });
        })
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            res.json(err);
        });
});

route.post("/temp/:patient_email", async(req, res) => {
    await db.PatientTemperature.create({
            temperature: req.body.temperature,
        })
        .then((PatientTemperature) => {
            return db.PatientData.findOneAndUpdate({ patient_email: req.params.patient_email }, { $push: { patient_temperature: PatientTemperature._id } });
        })
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            res.json(err);
        });
});

module.exports = route;