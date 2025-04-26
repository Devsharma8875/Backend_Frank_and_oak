const { transporter } = require("../../../config/mailConfig");
const bcrypt = require("bcryptjs");
const { userModal } = require("../../../modal/userModel");
const saltRounds = 10;

let myOTP = new Map();

let sendOTP = async (req, res) => {
  console.log(req.body.uemail);
  let userData = await userModal.find({ userEmail: req.body.uemail });
  if (userData.length == 0) {
    let randomOTP = (Math.random() * 999999).toString().slice(0, 4);
    myOTP.set("OTP", randomOTP);
    const info = await transporter.sendMail({
      from: `"Your OTP for Verification" <dev02930@gmail.com>`, // sender address
      to: req.body.uemail, // list of receivers
      subject: "Frank and Oak OTP", // Subject line
      html: `<div style="font-family: Arial, sans-serif; color: #333;">
                    <h2>Your OTP</h2>
                    <p>Your One-Time Password (OTP) for verification is: <strong>${randomOTP}</strong></p>
                    <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
                    <p>If you didn't request this, you can safely ignore this email.</p>
                </div>`,
    });
    res.status(200).json({
      status: 1,
      message: "OTP send Successfully.",
    });
  } else {
    res.status(200).json({
      status: 0,
      message: "Email id already exists.",
    });
  }
};

let checkOTPandRegister = async (req, res) => {
  let createdOTP = myOTP.get("OTP");
  const hash = bcrypt.hashSync(req.body.upassword, saltRounds);
  if (createdOTP == req.body.userOTP) {
    let createdUser = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userEmail: req.body.uemail,
      userPassword: hash,
      userGender: req.body.gender,
    };

    let userTable = new userModal(createdUser);
    let userSaved = await userTable.save();
    res.status(200).json({
      status: 1,
      message: "Account created Successfully.",
      res: userSaved,
    });
  } else {
    res.status(200).json({
      status: 0,
      message: "Invalid OTP",
    });
  }
};

let login = async (req, res) => {
  let { userEmail, userPassword } = req.body;
  let userData = await userModal.findOne({ userEmail });
  if (userData) {
    let comparedPassword = bcrypt.compareSync(
      userPassword,
      userData.userPassword
    );
    if (comparedPassword) {
      res.status(200).json({
        status: 1,
        data: userData,
        message: "User logined successfully.",
      });
    } else {
      res.status(200).json({
        status: 0,
        message: "Incorrect Password.",
      });
    }
  } else {
    res.status(200).json({
      status: 0,
      message: "User not exist please Register.",
    });
  }
};

let googleLogin = async (req, res) => {
  try {
    console.log(req.body);
    let { userEmail, userGender, firstName, lastName, userPassword } = req.body;
    let userData = await userModal.findOne({ userEmail: userEmail });
    if (userData) {
      // User already logined
      let updateuserData = await userModal.updateOne(
        { userEmail: userEmail },
        {
          $set: {
            userPassword: userPassword,
            userGender: userGender,
            userEmail: userEmail,
            firstName: firstName,
            lastName: lastName,
          },
        }
      );
      let userData = await userModal.findOne({ userEmail: userEmail });
      res.status(200).json({
        status: 1,
        message: "User logined.",
        data: userData,
      });
    } else {
      // user have to loging (1st time)
      let saveGoogleUser = await userModal(req.body); // set according to modal
      let dataSave = await saveGoogleUser.save();
      res.status(200).json({
        status: 1,
        message: "User logined.",
        data: dataSave,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 0,
      error: error.message,
    });
  }
};
const userdetails = async (req, res) => {
  try {
    const userId = req.params.id; // Changed from req.params.userId to req.params.id
    const { data: updates } = req.body; // Destructure the 'data' object

    if (!userId) {
      return res.status(400).json({
        status: 0,
        message: "User ID is required",
      });
    }

    // Find the user
    const user = await userModal.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 0,
        message: "User not found",
      });
    }

    // Prepare update object
    const updateData = {};
    const allowedFields = [
      "firstName",
      "lastName",
      "userEmail",
      "userGender",
      "shoppingPreference",
      "preferredLanguage",
    ];

    // Process allowed fields
    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        updateData[field] = updates[field];
      }
    });

    // Handle password update
    if (updates.userPassword) {
      if (
        !updates.currentPassword &&
        user.userPassword !== "Google Login user"
      ) {
        return res.status(400).json({
          status: 0,
          message: "Current password is required",
          field: "currentPassword",
        });
      }

      // Verify current password if not a social login
      if (user.userPassword !== "Google Login user") {
        const isMatch = await bcrypt.compare(
          updates.currentPassword,
          user.userPassword
        );
        if (!isMatch) {
          return res.status(400).json({
            status: 0,
            message: "Current password is incorrect",
            field: "currentPassword",
          });
        }
      }

      const salt = await bcrypt.genSalt(10);
      updateData.userPassword = await bcrypt.hash(updates.userPassword, salt);
    }

    // Perform update
    const updatedUser = await userModal.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    // Return response without sensitive data
    const { userPassword, __v, ...userData } = updatedUser.toObject();

    res.status(200).json({
      status: 1,
      message: "User details updated successfully",
      data: userData,
    });
  } catch (error) {
    console.error("Error updating user:", error);

    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({
        status: 0,
        message: "Email already exists",
        field: "userEmail",
      });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({
        status: 0,
        message: "Validation failed",
        errors,
      });
    }

    res.status(500).json({
      status: 0,
      message: "Internal server error",
      error: error.message,
    });
  }
};
module.exports = {
  sendOTP,
  checkOTPandRegister,
  login,
  googleLogin,
  userdetails,
};
