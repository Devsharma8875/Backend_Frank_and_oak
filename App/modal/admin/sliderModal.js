const mongoose = require("mongoose");

const sliderSchema = mongoose.Schema(
  {
    sliderName: {
      type: String,
      unique: true,
    },
    sliderHeading: {
      type: String,
      unique: true,
    },
    sliderSubHeading: {
      type: String,
      unique: true,
    },
    sliderStatus: {
      type: Boolean,
      default: true,
    },
    sliderImage: String,
    slug:String,
  },
  { timestamps: true }
);

const sliderModal=mongoose.model("slider",sliderSchema)

module.exports={sliderModal}