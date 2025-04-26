const { categoryModel } = require("../../modal/admin/categoryModal");
const { colorModal } = require("../../modal/admin/colorModal");
const { sizeModal } = require("../../modal/admin/sizeModal");
const { subcategoryModel } = require("../../modal/admin/subCategoryModal");

let parentCategory = async (req, res) => {
  try {
    let parentData = await categoryModel.find({ categoryStatus: true });
    res.status(200).json({
      status: 1,
      dataList: parentData,
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Internal server error",
    });
  }
};

let parentSubCategory = async (req, res) => {
  try {
    let { slug } = req.params;
    let parentData = await categoryModel.findOne({ slug });
    if (!parentData) {
      return res.status(404).json({
        status: 0,
        message: "Parent category not found",
      });
    }

    let parentID = parentData._id;
    let subCatData = await subcategoryModel.find({
      parentCategoryId: parentID,
    });

    res.status(200).json({
      status: 1,
      parentCategoryData: parentData,
      parentCatPath: process.env.CATEGORY_STATIC_PATH,
      subCategoryData: subCatData,
      subCatPath: process.env.SUBCATEGORY_STATIC_PATH,
    });
  } catch (error) {
    console.error("Error in parentSubCategory:", error);
    res.status(500).json({
      status: 0,
      message: "Internal server error",
    });
  }
};

let colorView = async (req, res) => {
  try {
    let colorData = await colorModal.find({ colorStatus: true });
    res.status(200).json({
      status: 1,
      dataList: colorData,
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Internal server error",
    });
  }
};

let sizeView = async (req, res) => {
  try {
    let sizeData = await sizeModal.find({ sizeStatus: true });
    res.status(200).json({
      status: 1,
      dataList: sizeData,
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Internal server error",
    });
  }
};

let subCategoryView = async (req, res) => {
  try {
    const subCatData = await subcategoryModel.find({ subCategoryStatus: true });
    res.status(200).json({
      status: 1,
      data: subCatData,
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};

module.exports = {
  parentCategory,
  parentSubCategory,
  colorView,
  sizeView,
  subCategoryView,
};
