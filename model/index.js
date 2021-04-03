const mongoose = require("mongoose");

const db_url = "mongodb://localhost:27017/mini_project_db";

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