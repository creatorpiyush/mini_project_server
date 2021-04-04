const mongoose = require("mongoose");

require("dotenv").config();

const db_url = process.env.DB_URL;

mongoose.connect(
    db_url, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    },
    (err, info) => {
        if (err) console.log(err);
        else console.log(`DB connected...`);
    }
);

module.exports = {
    Doctors: require("./doctors"),
    Patients: require("./patients"),
};