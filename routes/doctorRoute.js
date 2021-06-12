const route = require("express").Router();

const bcrypt = require("bcryptjs");

const db = require("../model");

route.get("/", (req, res) => {
  // res.send(`Hi from Doctor home`);
  return res.render("doctorIndex", {
    signup_success: req.flash("signup_success"),
    err: req.flash("err"),
  });
});

route.get("/signup", (req, res) => {
  if (req.session.userId) {
    return res.redirect(`/${req.session.username}`);
  }
  return res.render("doctorSignup", { err: req.flash("err") });
});

route.post("/signup", (req, res) => {
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

route.post("/login", (req, res) => {
  db.Doctors.findOne(
    {
      $or: [
        { doctor_email: req.body.doctor_email_number },
        { doctor_number: req.body.doctor_email_number },
      ],
    },
    (err, result) => {
      if (err) return res.send(err);
      if (result) {
        const isPasswordMatched = bcrypt.compareSync(
          req.body.doctor_password,
          result.doctor_password
        );

        if (isPasswordMatched) {
          req.session.userId = result.id;
          req.session.doctor_name = result.doctor_name;
          req.session.doctor_email = result.doctor_email;

          return res.redirect(`./${result.doctor_email}`);
        } else {
          req.flash("err", "⚠️ Password does not matched... ⚠️");
          return res.redirect(".");
        }
      } else {
        // return res.send("err");
        req.flash("err", "⚠️ Data not Found... ⚠️");
        return res.redirect(".");
      }
    }
  );
});

route.get("/favicon.ico", (req, res) => {});
let username;

route.get("/:doctor_email", (req, res) => {
  username = req.params.username;

  db.Doctors.findOne({ doctor_email: req.params.doctor_email })
    .populate({
      path: "doctor_s_patients",
      populate: {
        path: "patient_data",
        populate: {
          path: "patient_temperature",
        },
      },
    })
    .then((user) => {
      res.render("doctorData", { data: user.doctor_s_patients, doctor: user });
      // let data = user.doctor_s_patients;
      // console.log(data.patient_data);
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = route;
