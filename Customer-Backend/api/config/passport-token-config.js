var Strategy = require("passport-http-bearer").Strategy;

function initialize(passport, getUserByToken) {
  authenticateUser = async (token, done) => {
    const user = await getUserByToken(token);
    console.log(user);

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
