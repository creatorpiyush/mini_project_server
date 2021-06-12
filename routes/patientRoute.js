const route = require("express").Router();

const bcrypt = require("bcryptjs");

const db = require("../model");

// * signup page of patient
route.get("/", (req, res) => {
  return res.render("patientIndex", {
    signup_success: req.flash("signup_success"),
    err: req.flash("err"),
  });
});

// * patient login
route.post("/login", (req, res) => {
  db.Patients.findOne(
    {
      $or: [
        { patient_email: req.body.patient_email_number },
        { patient_number: req.body.patient_email_number },
      ],
    },
    (err, result) => {
      if (err) return res.send(err);
      if (result) {
        const isPasswordMatched = bcrypt.compareSync(
          req.body.patient_password,
          result.patient_password
        );

        if (isPasswordMatched) {
          req.session.userId = result.id;
          req.session.patient_name = result.patient_name;
          req.session.patient_email = result.patient_email;

          // return res.redirect(`/patient/patient/${result.patient_email}`);
          return res.redirect(`/patient/p/${result.patient_email}`);
        } else {
          req.flash("err", "⚠️ Password does not matched... ⚠️");
          return res.redirect("patientself");
        }
      } else {
        // return res.send("err");
        req.flash("err", "⚠️ Data not Found... ⚠️");
        return res.redirect("patientself");
      }
    }
  );
});

// * getting patient data for himself
route.get("/p/:patient_email", async (req, res) => {
  db.Patients.findOne({ patient_email: req.params.patient_email })
    .populate({
      path: "patient_data",
      populate: {
        path: "patient_temperature",
      },
    })
    .then((user) => {
      res.render("patientself", { data: user });
      // console.log(user);
    })
    .catch((err) => {
      res.json(err);
    });
});

// * Adding patient from doctor
route.post("/:doctor_email", async (req, res) => {
  const hashedPassword = bcrypt.hashSync(req.body.patient_password, 13);

  await db.Patients.create({
    patient_email: req.body.patient_email,
    patient_number: req.body.patient_number,
    patient_name: req.body.patient_name,
    patients_doctor: req.params.doctor_email,
    patients_gender: req.body.patients_gender,
    patient_password: hashedPassword,
  })
    .then((patientcontent) => {
      return db.Doctors.findOneAndUpdate(
        { doctor_email: req.params.doctor_email },
        {
          $push: { doctor_s_patients: patientcontent._id },
        }
      );
    })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.json(err);
    });
});

// * Updating Patient data
route.post("/update/:patient_email", async (req, res) => {
  await db.Patients.findOneAndUpdate(
    { patient_email: req.params.patient_email },
    {
      patient_name: req.body.patient_name,
      patient_number: req.body.patient_number,
    }
  )
    .then((user) => {
      return res.redirect(`/patient/patient/${user.patient_email}`);
    })
    .catch((err) => {
      res.json(err);
    });
});

// * adding patient data using '/patient/patient/:{}'
route.use("/patient", require("./patients_dataRoute"));

module.exports = route;
