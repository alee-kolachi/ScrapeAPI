const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const LocalStrategy = require("passport-local").Strategy;
const GooglePlusTokenStrategy = require("passport-google-plus-token");
const FacebookTokenStrategy = require("passport-facebook-token");
const User = require("./models/user");
const dotenv = require("dotenv");
dotenv.config();

//JSON WEB TOKENS STRATEGY
passport.use(
  new JwtStrategy(
    {
      //where to save token

      jwtFromRequest: ExtractJwt.fromHeader("authorize"),
      //what secret are we using
      secretOrKey: process.env.SECRET_KEY
    },
    async (payload, done) => {
      try {
        //find the user specified in token
        console.log(payload.sub);
        const user = await User.findById(payload.sub);
        //if not return nothing i.e false
        if (!user) {
          return done(null, false);
        }
        //otherwise return
        done(null, user);
      } catch {
        done(error, false);
        console.log("hello");
      }
    }
  )
);

//Google OAuth Strategy
passport.use(
  "googleToken",
  new GooglePlusTokenStrategy(
    {
      clientID: process.env.CLIENT_ID_GOOGLE,
      clientSecret: process.env.CLIENT_SECRET_GOOGLE
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // console.log("accesstoken ", accessToken);
        // console.log("refreshtoken ", refreshToken);
        // console.log("profile ", profile);
        //check whether this current user exits in our db
        const existingUser = await User.findOne({ "google.id": profile.id });
        if (existingUser) {
          console.log("User already exists in our DB");
          return done(null, existingUser);
        }
        console.log("User doesn't exits, we are creating a new one");

        //if new account
        const newUser = new User({
          method: "google",
          google: {
            id: profile.id,
            email: profile.emails[0].value
          }
        });
        await newUser.save();
        done(null, newUser);
      } catch (error) {
        done(error, false, error.message);
      }
    }
  )
);

//Facebook OAuth STRATEGY
//Google OAuth Strategy
passport.use(
  "facebookToken",
  new FacebookTokenStrategy(
    {
      clientID: process.env.CLIENT_ID_FACEBOOK,
      clientSecret: process.env.CLIENT_SECRET_FACEBOOK
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("accesstoken ", accessToken);
        console.log("refreshtoken ", refreshToken);
        console.log("profile ", profile);
        // check whether this current user exits in our db
        const existingUser = await User.findOne({ "facebook.id": profile.id });
        if (existingUser) {
          console.log("User already exists in our DB");
          return done(null, existingUser);
        }
        console.log("User doesn't exits, we are creating a new one");

        //if new account
        const newUser = new User({
          method: "facebook",
          facebook: {
            id: profile.id,
            email: profile.emails[0].value
          }
        });
        await newUser.save();
        done(null, newUser);
      } catch (error) {
        done(error, false, error.message);
      }
    }
  )
);

//LOCAL TOKEN STRATEGY
passport.use(
  new LocalStrategy(
    {
      usernameField: "email"
    },
    async (email, password, done) => {
      try {
        //Find the user given the email
        const user = await User.findOne({ "local.email": email });

        //If not , handle it
        if (!user) {
          return done(null, false);
        }
        //check if password is correct
        const isMatched = await user.isValidPassword(password);

        if (!isMatched) {
          return done(null, false);
        }
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);
