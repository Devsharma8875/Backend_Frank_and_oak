const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    shippingAddress: Object,
    orderAmount: Number,
    orderQuantity: Number,
    orderId: String,
    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
      // Default value in case no status is provided required: true
    },
    razorpayPaymentId: String,
    razorpayOrderId: String,
    paymentStatus: {
      type: String,
      enum: [1, 2, 3], // 1 means Pending, 2 means Confirmed, 3 means Cancelled.
    },
    paymentType: {
      type: String,
      enum: [1, 2, 3],
    },
    productCart: Array,
  },
  { timestamps: true }
);

const orderModal = mongoose.model("Order", orderSchema);

module.exports = orderModal;
