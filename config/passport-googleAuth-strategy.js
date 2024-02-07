const passport = require("passport");
const googleStrategy = require("passport-google-oauth20").Strategy;
const crypto = require("crypto");
const User = require("../schema/user/UserSchema");

passport.use(
  new googleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        let user = await User.findOne({
          email: profile.emails[0].value,
        });

        if (user) {
          return done(null, user);
        } else {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            username: profile.emails[0].value.split("@")[0],
            password: crypto.randomBytes(20).toString("hex"),
          });

          return done(null, user);
        }
      } catch (err) {
        return done(err);
      }
    },
  ),
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id).exec();

    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

module.exports = passport;
