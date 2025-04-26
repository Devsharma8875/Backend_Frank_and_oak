const mongoose = require("mongoose");

const subCategorySchema =new mongoose.Schema(
  {
    subCategoryName: {
      type: String,
      unique: true
    },
    parentCategoryId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "category",
            },
    subCategoryImage: String,
    subcatDescription: String,
    subCategoryStatus: {
      type: Boolean,
      default: true
    },
    slug:String,
  },
  { timestamps: true }
);

const subcategoryModel=mongoose.model("subcategory",subCategorySchema)

module.exports={subcategoryModel}