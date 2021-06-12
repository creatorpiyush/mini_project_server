const route = require("express").Router();

const db = require("../model");

const multer = require("multer");
const fs = require("fs").promises;

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "creatorpiyush",
  api_key: "897718564747982",
  api_secret: "J8UTV3thq628g70AC3R-eXDG5sw",
});

const upload = multer({ dest: "src/uploads/" });

// * getting patient data to show in doctor view
route.get("/:patient_email", async (req, res) => {
  db.Patients.findOne({ patient_email: req.params.patient_email })
    .populate({
      path: "patient_data",
      populate: {
        path: "patient_temperature",
      },
    })
    .then((user) => {
      res.render("patientData", { data: user });
      //   console.log(user);
    })
    .catch((err) => {
      res.json(err);
    });
});

// * posting data of patient by doctor only
route.post("/:patient_email", async (req, res) => {
  await db.PatientData.create({
    patient_problem: req.body.patient_problem,
    patient_email: req.params.patient_email,
    patient_relative_name: req.body.patient_relative_name,
    patient_relative_number: req.body.patient_relative_number,
    patient_address: req.body.patient_address,
  })
    .then((patientdatacontent) => {
      return db.Patients.findOneAndUpdate(
        { patient_email: req.params.patient_email },
        { $push: { patient_data: patientdatacontent._id } }
      );
    })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.json(err);
    });
});

// * Updating Patient Problem
route.post("/problem/:patient_email", async (req, res) => {
  await db.PatientData.findOneAndUpdate(
    { patient_email: req.params.patient_email },
    {
      patient_problem: req.body.patient_problem,
    }
  )
    .then((user) => {
      return res.redirect(`../${user.patient_email}`);
    })
    .catch((err) => {
      res.json(err);
    });
});

// * updating patient relative Data
route.post("/update/:patient_email", async (req, res) => {
  await db.PatientData.findOneAndUpdate(
    { patient_email: req.params.patient_email },
    {
      patient_relative_name: req.body.patient_relative_name,
      patient_relative_number: req.body.patient_relative_number,
      patient_address: req.body.patient_address,
    }
  )
    .then((user) => {
      return res.redirect(`/patient/patient/${user.patient_email}`);
    })
    .catch((err) => {
      res.json(err);
    });
});

// * posting temperature by patient
route.post(
  "/temp/:patient_email",
  upload.single("temperature_image"),
  async (req, res) => {
    // console.log("req.file", req.file);
    cloudinary.uploader.upload(req.file.path, async (err, result) => {
      // console.log("result:", result);

      await db.PatientTemperature.create({
        temperature: req.body.temperature,
        temperature_image: result.secure_url,
      })
        .then((PatientTemperature) => {
          return db.PatientData.findOneAndUpdate(
            { patient_email: req.params.patient_email },
            { $push: { patient_temperature: PatientTemperature._id } }
          );
        })
        .then((user) => {
          // res.json(user);
          return res.redirect(`/patient/p/${user.patient_email}`);
        })
        .catch((err) => {
          res.json(err);
        });
    });
  }
);

module.exports = route;
