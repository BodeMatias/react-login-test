const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user.schema");

passport.use(
    new LocalStrategy(
        {
            usernameField: "username",
            passwordField: "password"
        },
        function(username, password, auth) {
            return User.findOne({ username, password })
                .then(user => {
                    if (!user) {
                        return auth(null, false, {
                            message: "Incorrect email or password."
                        });
                    }
                    return auth(null, user, {
                        message: "Logged In Successfully"
                    });
                })
                .catch(err => auth(err));
        }
    )
);
