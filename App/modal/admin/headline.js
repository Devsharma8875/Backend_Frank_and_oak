const mongoose = require("mongoose");

const headlineSchema = new mongoose.Schema(
  {
    headlineName: {
      type: String,
      unique: true,
    },
    headlineStatus: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const headlineModal = new mongoose.model("headline", headlineSchema);

module.exports = { headlineModal };
