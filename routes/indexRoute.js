const route = require("express").Router();

const session = require("express-session");

route.get("/", (req, res) => {
  return res.render("index", {
    signup_success: req.flash("signup_success"),
    err: req.flash("err"),
  });
});

module.exports = route;
