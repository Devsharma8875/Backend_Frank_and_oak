const express = require("express");
const {
  sendOTP,
  checkOTPandRegister,
  login,
  googleLogin,
  userdetails,
} = require("../../../controller/website/auth/websiteAuthController");
const websiteAuthRoute = express.Router();

websiteAuthRoute.post("/generate-otp", sendOTP);
websiteAuthRoute.post("/check-otp-register", checkOTPandRegister);
websiteAuthRoute.post("/login", login);
websiteAuthRoute.post("/google-login", googleLogin);
websiteAuthRoute.post("/userdetails/:id", userdetails);

module.exports = { websiteAuthRoute };
