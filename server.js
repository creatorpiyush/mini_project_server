const express = require("express");

const app = express();

require("./model");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", require("./routes/indexRoute"));

app.use("/doctor", require("./routes/doctorRoute"));

app.use("/patient", require("./routes/patientRoute"));

// server listening
const port = process.env.PORT || 5555;
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});