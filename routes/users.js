const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../middlewares.js");

const listingUsers = require("../controllers/users.js");

router
  .route("/signup")
  .get(listingUsers.renderSignUpForm)
  .post(wrapAsync(listingUsers.signupUser));

router
  .route("/login")
  .get(listingUsers.renderLoginForm)
  .post(
    //* 1. acquire the route
    saveRedirectUrl,
    passport.authenticate("local", {
      //* 2. Then authenticate the user (There are many ways to authenticate one).
      failureRedirect: "/login",
      failureFlash: true,
    }),
    listingUsers.loginUser
  );

router.get("/logout", listingUsers.logoutUser);

module.exports = router;
