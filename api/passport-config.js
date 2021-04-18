const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

function initialize(passport, getUserByEmail) {
  const authenticateUser = async (email, password, done) => {
    const user = getUserByEmail(email);

    if (user == null) {
      return done(null, false, { message: "No user with that email" });
    }

    try {
      // We have an authenticated user
      console.log(`pass: ${user.password}`);
      console.log(`input: ${password}`);
      if (await bcrypt.compare(password, user.password)) {
        console.log("Successful login");
      }
      // The user's password did not match
      else {
        return done(null, false, { message: "Password incorrect." });
      }
    } catch {}
  };

  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
  passport.serializeUser((user, done) => {});
  passport.deserializeUser((id, done) => {});
}

module.exports = initialize;
