const JWT = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

signToken = user => {
  return JWT.sign(
    {
      iss: "Alee Kolachi",
      sub: user.id,
      iat: new Date().getTime()
    },
    process.env.SECRET_KEY
  );
};

module.exports = {
  signUp: async (req, res, next) => {
    const { email, password } = req.value.body;

    //Check if email is already present
    const foundUser = await User.findOne({ "local.email": email });
    if (foundUser)
      return res.status(403).json({ error: "Email is already in use" });

    //Create a new user
    const newUser = new User({
      method: "local",
      local: {
        email: email,
        password: password
      }
    });
    await newUser.save();
    const token = signToken(newUser);

    res.status(200).json({ token });
  },
  signIn: async (req, res, next) => {
    //generate token
    const token = signToken(req.user);

    res.status(200).json({ token });
  },
  googleOAuth: async (req, res, next) => {
    //generate token
    const token = signToken(req.user);
    res.status(200).json({ token });
  },
  facebookOAuth: async (req, res, next) => {
    //generate token
    const token = signToken(req.user);
    res.status(200).json({ token });
  },

  secret: async (req, res, next) => {
    res.json({ name: "hi i am in" });
  },
  getData: async (req, res, next) => {
    const foundUser = await User.findOne({
      email: "aleeealee.kolachi@gmail.com"
    });
    if (foundUser) return res.status(200).json({ result: " Got it " });
    else {
      return res.status(403).json({ result: " did not get it" });
    }
  }
};
