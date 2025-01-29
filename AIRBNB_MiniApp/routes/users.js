const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const contUser = require("../controllers/users.js");

//signUp
router
  .route("/signup")
  .get(contUser.signUpUser) //render Sign up
  .post(wrapAsync(contUser.postSignUpUser));  //Signup & Login

//login
router
  .route("/login")
  .get(contUser.logInUser) //render Login
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    contUser.postLogInUser //flash Login
  );

//logout
router.get("/logout", contUser.logOutUser);

module.exports = router;
