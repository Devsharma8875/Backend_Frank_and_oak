const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
  },
  size: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "size",
  },
  color: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "color",
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

let cartModal = mongoose.model("cart", cartSchema);

module.exports = { cartModal };
