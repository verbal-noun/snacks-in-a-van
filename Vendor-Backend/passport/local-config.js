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
  // The logic for authentication
  const authenticateUser = async (name, password, done) => {
    const user = await getUserByEmail(name);

    if (user == null) {
      return done(null, false, { message: "No user with that name" });
    }

    try {
      // We have an authenticated user
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      }
      // The user's password did not match
      else {
        return done(null, false, { message: "Password incorrect." });
      }
    } catch {}
  };

  // Set up passport instance accordingly
  passport.use(new LocalStrategy({ usernameField: "name" }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    return done(null, await getUserById(id));
  });
}

module.exports = initialize;
