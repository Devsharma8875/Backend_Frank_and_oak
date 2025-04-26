const mongoose = require("mongoose");

const wishlistSchema=new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
  }
},
{ timestamps: true })

let wishlistModal = mongoose.model("wishlist", wishlistSchema);

module.exports = { wishlistModal };