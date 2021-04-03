const route = require("express").Router();

const bcrypt = require("bcryptjs");

const db = require("../model");

route.get("/", (req, res) => {
    res.send(`Hi from Doctor home`);
});

route.post("/", (req, res) => {
    const hashedPassword = bcrypt.hashSync(req.body.doctor_password, 13);

    const temp = new db.Doctors({
        doctor_email: req.body.doctor_email,
        doctor_number: req.body.doctor_number,
        doctor_name: req.body.doctor_name,
        doctor_password: hashedPassword,
    });
    temp.save((err, result) => {
        if (err) {
            return res.send({ err: err });
        }
        return res.send(result);
    });
});

route.get("/:doctor_email", (req, res) => {
    db.Doctors.findOne({ doctor_email: req.params.doctor_email })
        .populate({
            path: "doctor_s_patients",
        })
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            res.json(err);
        });
});

module.exports = route;