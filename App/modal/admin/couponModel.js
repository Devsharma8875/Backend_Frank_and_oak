const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    couponName: {
      type: String,
      unique: true,
      trim: true,
    },
    couponStatus: {
      type: Boolean,
      default: true,
    },
    couponCode: {
      type: String,
      unique: true,
      required: true,
      uppercase: true, // Store in uppercase to ensure uniqueness
      trim: true,
    },
    discountType: {
      type: String,
      enum: ["fixed", "percentage"],
      required: true,
    },
    discountValue: { type: Number, required: true },
    minOrderAmount: { type: Number, default: 0 },
    maxDiscountAmount: { type: Number, default: 0 },
    expiryDate: { type: Date, required: true },
    usageLimit: { type: Number, default: 1 }, // Total usage limit across all users
    usedCount: { type: Number, default: 0 },
    usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Track which users have used it
  },
  { timestamps: true }
);

// Middleware: Automatically disable expired coupons
couponSchema.pre("save", function (next) {
  if (this.expiryDate < new Date()) {
    this.couponStatus = false;
  }
  next();
});

const couponModal = mongoose.model("coupon", couponSchema);

module.exports = couponModal;
