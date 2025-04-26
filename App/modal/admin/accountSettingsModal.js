const mongoose = require("mongoose");

const accountSettingsSchema = new mongoose.Schema(
  {
    userName: String,
    userEmail: String,
    userPhone: Number,
    userAddress: String,
    facebookLink: String,
    instagramLink: String,
    youtubeLink: String,
    xLink: String,
    logoImage: String,
    subLogoImage: String,
    profileImage: String,
  },
  { timestamps: true }
);

let accountSettingsModal = mongoose.model(
  "accountSetting",
  accountSettingsSchema
);

module.exports = { accountSettingsModal };
