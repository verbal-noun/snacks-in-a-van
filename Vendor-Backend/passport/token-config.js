var Strategy = require("passport-http-bearer").Strategy;

/**
 * A function that initializes the passport object with the correct strategy
 *
 * Contains logic on how to authenticate using tokens
 *
 * @param passport: Instance of the passport object
 * @param getUserByToken: Callback function to validate user by token
 */
function initialize(passport, getUserByToken) {
  authenticateUser = async (token, done) => {
    const user = await getUserByToken(token);

    try {
      if (user == null) {
        return done(null, false);
      } else {
        return done(null, user, { scope: "all" });
      }
    } catch {}
  };

  passport.use(new Strategy(authenticateUser));
}

module.exports = initialize;
