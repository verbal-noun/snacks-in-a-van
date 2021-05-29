const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

/**
 * Function to instatiate passport with local strategy
 *
 * Contains logic on how user will be authenticated using username and password
 * @param passport: Instance of passport
 * @param getUserByEmail: Callback to get user by email
 * @param getUserById: Callback to fetch user by their ID
 */
async function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    const user = await getUserByEmail(email);

    if (user == null) {
      return done(null, false, { message: "No user with that email" });
    }

    try {
      // We have an authenticated user
      if (await bcrypt.compare(password, user.password)) {
        console.log("Successful login");
        return done(null, user);
      }
      // The user's password did not match
      else {
        return done(null, false, { message: "Password incorrect." });
      }
    } catch {}
  };

  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    return done(null, await getUserById(id));
  });
}

module.exports = initialize;
