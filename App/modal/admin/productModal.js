let mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      unique: true,
    },
    productDescription: String,
    productShortDesc: String,
    productImage: String,
    productAnimationImage: String,
    productGallery: Array,
    productPrice: Number,
    productMRP: Number,
    productStatus: Boolean,
    slug: String,
    productParentCategoryId: {
      type: mongoose.Types.ObjectId,
      ref: "category",
    },
    productSubCategoryId: {
      type: mongoose.Types.ObjectId,
      ref: "subcategory",
    },
    productSizeId: [
      {
        type: mongoose.Types.ObjectId,
        ref: "size",
      },
    ],
    productColorId: [
      {
        type: mongoose.Types.ObjectId,
        ref: "color",
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },

  { timestamps: true }
);

let productModal = mongoose.model("product", productSchema);

module.exports = { productModal };
