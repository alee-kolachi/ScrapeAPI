const express = require("express");
const router = require("express-promise-router")();
const passport = require("passport");
require("../passport");
const passportJWT = passport.authenticate("jwt", { session: false });
const passportLocal = passport.authenticate("local", { session: false });

const passportGoogle = passport.authenticate("googleToken", { session: false });
const passportFacebook = passport.authenticate("facebookToken", {
  session: false
});

const { validateBody, schemas } = require("../helpers/routeHelpers");
const UserController = require("../controllers/users");

router
  .route("/signup")
  .post(validateBody(schemas.authSchema), UserController.signUp);
router
  .route("/signin")
  .post(validateBody(schemas.authSchema), passportLocal, UserController.signIn);

router.route("/secret").get(passportJWT, UserController.secret);
router.route("/getData").get(UserController.getData);
router.route("/oauth/google").post(passportGoogle, UserController.googleOAuth);
router
  .route("/oauth/facebook")
  .post(passportFacebook, UserController.facebookOAuth);
module.exports = router;
