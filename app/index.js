const express = require("express");
const User = require("./models/user.schema");
const cors = require("cors");
const app = express();
const { client } = require("./database");
const passport = require("passport");
require("./passport");

app.set("port", process.env.PORT || 4000);
app.use(express.json());
app.use(cors());
app.options("*", cors());
app.use(passport.initialize());
app.use(require("./routes/user.routes"));

app.listen(app.get("port"), () => {
    console.log("Server on port", app.get("port"));
});
