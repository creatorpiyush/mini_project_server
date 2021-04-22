const express = require("express");

const app = express();

const session = require("express-session");

const flash = require("req-flash");

require("./model");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "24knb6k247b2k7b2k7bk247hb2kh7b2",
  })
);

app.use(flash());

app.use(express.static(__dirname + "/public"));

app.set("view engine", "hbs");
app.set("views", "./public/views");

app.use("/", require("./routes/indexRoute"));

app.use("/doctor", require("./routes/doctorRoute"));

app.use("/patient", require("./routes/patientRoute"));

// server listening
const port = process.env.PORT || 5555;
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
