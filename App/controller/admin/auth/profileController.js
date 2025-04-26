const {
  accountSettingsModal,
} = require("../../../modal/admin/accountSettingsModal");
const { PROFILE_STATIC_PATH } = require("../../../config/staticPaths.js");

let profileInsert = async (req, res) => {
  try {
    let checkProfile = await accountSettingsModal.find();
    let profileData;
    if (checkProfile.length == 0) {
      profileData = await accountSettingsModal({
        userName: "",
        userEmail: "",
        userPhone: 0,
        userAddress: "",
        facebookLink: "",
        instagramLink: "",
        youtubeLink: "",
        xLink: "",
      });

      if (req.files) {
        if (req.files.logoImage) {
          profileData["logoImage"] = req.files.logoImage[0].filename;
        }
        if (req.files.subLogoImage) {
          profileData["subLogoImage"] = req.files.subLogoImage[0].filename;
        }
        if (req.files.profileImage) {
          profileData["profileImage"] = req.files.profileImage[0].filename;
        }
      }

      await profileData.save();
    }
    res.status(200).json({
      status: 1,
      data: profileData,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

let profileView = async (req, res) => {
  let adminProfiledata = await accountSettingsModal.findOne();

  res.status(200).json({
    status: 1,
    path: PROFILE_STATIC_PATH,
    data: adminProfiledata,
  });
};

let profileUpdate = async (req, res) => {
  try {
    let id = req.params.id;
    console.log(req.body);
    console.log(req.files);
    let profileData = {
      userName: req.body.userName,
      userEmail: req.body.userEmail,
      userPhone: req.body.userPhone,
      userAddress: req.body.userAddress,
      facebookLink: req.body.facebookLink,
      instagramLink: req.body.instagramLink,
      youtubeLink: req.body.youtubeLink,
      xLink: req.body.xLink,
    };

    if (req.files) {
      if (req.files.logoImage) {
        profileData["logoImage"] = req.files.logoImage[0].filename;
      }
      if (req.files.subLogoImage) {
        profileData["subLogoImage"] = req.files.subLogoImage[0].filename;
      }
      if (req.files.profileImage) {
        profileData["profileImage"] = req.files.profileImage[0].filename;
      }
    }

    let profileUpdate = await accountSettingsModal.updateOne(
      { _id: id },
      { $set: profileData }
    );
    res.status(200).json({
      status: 1,
      res: profileUpdate,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

module.exports = { profileInsert, profileView, profileUpdate };
