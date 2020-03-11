const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const uri = process.env.DB_CONNECT;

mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(db => console.log("Connected to database."))
    .catch(err => console.log(err));

module.exports = mongoose;
