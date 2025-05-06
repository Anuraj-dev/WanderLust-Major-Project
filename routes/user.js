const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

const userController = require("../Controllers/user");

//Router.route for compactness (Check express docs)
router
  .route("/signup")
  //Signup Route form
  .get(userController.renderSignUpForm)
  //Sign up Route
  .post(wrapasync(userController.signupUser));

router
  .route("/login")
  //Log in form
  .get(userController.renderLogInForm)
  //Login
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    wrapasync(userController.loginUser)
  );

//Logout route
router.get("/logout", userController.logoutUser);

// Google OAuth Routes
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Fix for Google OAuth callback
router.get(
  "/auth/google/callback",
  saveRedirectUrl,
  passport.authenticate("google", {
    failureRedirect: "/login",
    failureFlash: true,
    successRedirect: undefined, // Forces it to go to the next middleware
  }),
  userController.afterOAuth // Removed wrapasync here
);

// GitHub OAuth Routes
router.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

// Fix for GitHub OAuth callback
router.get(
  "/auth/github/callback",
  saveRedirectUrl,
  passport.authenticate("github", {
    failureRedirect: "/login",
    failureFlash: true,
    successRedirect: undefined, // Forces it to go to the next middleware
  }),
  userController.afterOAuth // Removed wrapasync here
);

module.exports = router;
