var Strategy = require("passport-http-bearer").Strategy;

function initialize(passport, getUserByToken) {
  authenticateUser = (token, done) => {
    const user = getUserByToken(token);

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
