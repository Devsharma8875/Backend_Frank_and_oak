const { transporter } = require("../../../config/mailConfig");
const { userModal } = require("../../../modal/userModel");
const bcrypt = require('bcryptjs');
const saltRounds = 10;

let forgetPassword = async (req, res) => {
  try {
    let userdata = await userModal.findOne({ userEmail: req.body.userEmail });
    if (userdata) {
      res.status(200).json({
        status: 1,
        data: userdata,
        message: "Email Exist in Database",
      });
    } else {
      res.status(200).json({
        status: 0,
        message: "User not exist please login.",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Server error occurred.",
      error: error.message,
    });
  }
};

let myOTP = new Map();
let sendOTP = async (req, res) => {
  try {
    let randomOTP = Math.floor(1000 + Math.random() * 9000);
    myOTP.set("ForgetOTP", randomOTP);
    const info = await transporter.sendMail({
      from: `"Frank and Oak Support" <roshanchaurasia990@gmail.com>`, // sender address
      to: req.body.userEmail, // list of receivers
      subject: "Frank and Oak Password Reset OTP", // Subject line
      html: `<div style="font-family: Arial, sans-serif; color: #333;">
                <h2>Password Reset OTP</h2>
                <p>Hello,</p>
                <p>You requested a password reset for your Frank and Oak account. Your One-Time Password (OTP) is: <strong>${randomOTP}</strong></p>
                <p>This OTP is valid for 10 minutes. Please enter it in the app to complete the reset process.</p>
                <p>If you didn't request a password reset, please ignore this email.</p>
                <p>Best Regards,<br>Frank and Oak Support Team</p>
           </div>`,
    });
    res.status(200).json({
      status: 1,
      message: "OTP sended to mail.",
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "OTP not sended.",
      error: error.message,
    });
  }
};

let otpVerification = async (req, res) => {
  try {
    let userOTP = req.body.OTP;
    console.log("user OTP : ", userOTP);
    let createdOTP = myOTP.get("ForgetOTP");
    console.log("created OTP : ", createdOTP);
    if (userOTP) {
      if (userOTP == createdOTP) {
        res.status(200).json({
            status:1,
            message:"OTP Matched."
        })
      } else {
        res.status(200).json({
          status: 0,
          message: "OTP not Matched.",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Server error occurred.",
      error: error.message,
    });
  }
};

let changePassword=async(req,res)=>{
    try{
    let userPassword = req.body.password;
    let userConfirmPassword = req.body.confirmpassword;
    console.log(req.body)
    const hash = bcrypt.hashSync(userPassword, saltRounds);
        if ( userPassword && userConfirmPassword) {
          let userLoginData = await userModal.updateOne(
            { $set: { userPassword: hash } }
          );
          res.status(200).json({
            status: 1,
            data: userLoginData,
            message: "Password Changed Successfully.",
          });
        }
        else{
            res.status(200).json({
                status:0,
                message:"Unable to change password !"
            })
        }
    }
    catch(error){
        res.status(500).json({
            status:0,
            message:"Server Error Occurred."
        })
    }
}

module.exports = { forgetPassword, sendOTP, otpVerification, changePassword };
