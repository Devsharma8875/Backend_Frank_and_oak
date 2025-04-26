const mongoose = require("mongoose");
const storySchema = mongoose.Schema(
  {
    storyName: {
      type: String,
      unique: true,
    },
    storyDescription: String,
    storyStatus: {
      type: Boolean,
      default: true,
    },
    storyImage: String,
    bannerImage: String,
    slug:String,
  },
  { timestamps: true }
);

const storyModal=mongoose.model("story",storySchema)

module.exports={storyModal}