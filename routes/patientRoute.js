const route = require("express").Router();

const bcrypt = require("bcryptjs");

const db = require("../model");

route.get("/", (req, res) => {
    res.send(`Hi from Patient home`);
});

route.post("/:doctor_email", async(req, res) => {
    const hashedPassword = bcrypt.hashSync(req.body.patient_password, 13);

    await db.Patients.create({
            patient_email: req.body.patient_email,
            patient_number: req.body.patient_number,
            patient_name: req.body.patient_name,
            patient_password: hashedPassword,
        })
        .then((patientcontent) => {
            return db.Doctors.findOneAndUpdate({ doctor_email: req.params.doctor_email }, { $push: { doctor_s_patients: patientcontent._id } });
        })
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            res.json(err);
        });
});

module.exports = route;