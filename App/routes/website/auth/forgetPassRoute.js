const express=require("express")
const { forgetPassword, sendOTP, otpVerification, changePassword } = require("../../../controller/website/auth/forgetPassController")
const forgetPassRoute=express.Router()



forgetPassRoute.post("/email-verification",forgetPassword)
forgetPassRoute.post("/send-otp",sendOTP)
forgetPassRoute.post("/otp-verification",otpVerification)
forgetPassRoute.post("/change-password",changePassword)

module.exports={forgetPassRoute}