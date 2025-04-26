const { myslug } = require("../../config/slugConfig");
const { categoryModel } = require("../../modal/admin/categoryModal");
const { subcategoryModel } = require("../../modal/admin/subCategoryModal");
const fs = require("fs");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const { SUBCATEGORY_STATIC_PATH } = require("../../config/staticPaths.js");
let parentCategoryView = async (req, res) => {
  try {
    let categoryData = await categoryModel.find({ categoryStatus: 1 });
    res.status(200).json({
      status: 1,
      datalist: categoryData,
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Internal Server Error",
      error: error,
    });
  }
};

let subCategoryInsert = async (req, res) => {
  let subCategoryData = {
    subCategoryName: req.body.subCategoryName,
    parentCategoryId: req.body.parentCategoryId,
    subcatDescription: req.body.subcatDescription,
    subCategoryStatus: req.body.subCategoryStatus,
    slug: myslug(req.body.subCategoryName),
  };
  if (req.file) {
    if (req.file.filename) {
      subCategoryData["subCategoryImage"] = req.file.filename;
    }
  }
  try {
    const subCategoryCollection = new subcategoryModel(subCategoryData);

    let subCatRes = await subCategoryCollection.save();
    res.status(200).json({
      status: 1,
      message: "Data saved.",
      res: subCatRes,
    });
  } catch (error) {
    res.status(200).json({
      status: 0,
      message: "sub category already exists !",
      error: error,
    });
  }
};

let subCategoryView = async (req, res) => {
  let searchObject = {};
  let limit = 5;
  try {
    let { subCategoryName, subcatDescription, pageNumber } = req.query;
    if (subCategoryName !== "") {
      searchObject["subCategoryName"] = new RegExp(subCategoryName, "i");
    }
    if (subcatDescription !== "") {
      searchObject["subcatDescription"] = new RegExp(subcatDescription, "i");
    }
    let subCategoryData = await subcategoryModel
      .find(searchObject)
      .skip((pageNumber - 1) * limit)
      .limit(limit)
      .populate("parentCategoryId", "categoryName");
    let totalPageNumber = await subcategoryModel.find(searchObject);
    let allPage = Math.ceil(totalPageNumber.length / limit);
    res.status(200).json({
      status: 1,
      path: SUBCATEGORY_STATIC_PATH,
      datalist: subCategoryData,
      allPage,
      limit,
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Internal server error !",
      error: error.message,
    });
  }
};

let subCategorySingleDelete = async (req, res) => {
  try {
    let { id } = req.params;
    const subCategoryData = await subcategoryModel.findOne({ _id: id });
    if (subCategoryData) {
      let imageName = await subCategoryData.subCategoryImage;
      let path = "uploads/subCategory/" + imageName;
      fs.unlinkSync(path);
      let singleRowDelete = await subcategoryModel.deleteOne({ _id: id });
      if (singleRowDelete.deletedCount === 0) {
        return res.status(404).json({
          status: 0,
          message: "No record found to delete.",
        });
      }
      res.status(200).json({
        status: 1,
        message: "Record deleted.",
        res: singleRowDelete,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

let subCategoryMultipleDelete = async (req, res) => {
  try {
    let { ids } = req.body;
    let singleRowDelete;
    for (let id of ids) {
      const subCategoryData = await subcategoryModel.findOne({ _id: id });
      if (subCategoryData) {
        let imageName = await subCategoryData.subCategoryImage;
        let path = "uploads/subCategory/" + imageName;
        fs.unlinkSync(path);
        singleRowDelete = await subcategoryModel.deleteOne({ _id: id });
        if (singleRowDelete.deletedCount === 0) {
          return res.status(404).json({
            status: 0,
            message: "No record found to delete.",
          });
        }
      }
    }
    res.status(200).json({
      status: 1,
      message: "Record deleted.",
      res: singleRowDelete,
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

let subCategoryEditRowData = async (req, res) => {
  try {
    let id = req.params.id;
    let subCategoryData = await subcategoryModel.findOne({ _id: id });
    if (subCategoryData) {
      return res.status(200).json({
        status: 1,
        message: "Record found",
        path: SUBCATEGORY_STATIC_PATH,
        res: subCategoryData,
      });
    }
    res.status(200).json({
      status: 0,
      message: "No record found.",
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

let subCategoryUpdateRow = async (req, res) => {
  try {
    let id = req.params.id;
    let {
      subCategoryName,
      parentCategoryId,
      subcatDescription,
      subCategoryStatus,
    } = req.body;
    let subCategoryData = {
      subCategoryName: subCategoryName,
      parentCategoryId: parentCategoryId,
      subcatDescription: subcatDescription,
      subCategoryStatus: subCategoryStatus,
      slug: myslug(req.body.subCategoryName),
    };
    if (req.file) {
      if (req.file.filename) {
        subCategoryData["subCategoryImage"] = req.file.filename;
      }
    }
    let subCategoryUpdate = await subcategoryModel.updateOne(
      { _id: id },
      { $set: subCategoryData }
    );
    res.status(200).json({
      status: 1,
      message: "Record Updated.",
      res: subCategoryUpdate,
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Server error occurred.",
      error: error.message,
    });
  }
};
let remove = async (req, res) => {
  try {
    const result = await subcategoryModel.updateMany(
      { _id: { $in: req.body.id } },
      { $set: { deleted_at: Date.now() } }
    );

    if (result.modifiedCount > 0) {
      return res.send({
        status: true,
        message: "Record Deleted Successfully",
        data: result,
      });
    }

    res.send({
      status: false,
      message: "No Record Found to Delete",
      data: "",
    });
  } catch (error) {
    res.send({
      status: false,
      message: "Something went wrong",
      data: "",
    });
  }
};

let changeStatus = async (req, res) => {
  try {
    // Ensure req.body.id is an array
    const ids = Array.isArray(req.body.id) ? req.body.id : [req.body.id];

    // Convert string IDs to ObjectId using `new ObjectId`
    const objectIds = ids.map((id) => new ObjectId(id));

    // Toggle the status using $set and a ternary condition
    const result = await subcategoryModel.updateMany(
      { _id: { $in: objectIds } }, // Filter documents by IDs
      [
        {
          $set: {
            subCategoryStatus: {
              $cond: { if: "$subCategoryStatus", then: false, else: true },
            },
          },
        },
      ] // Toggle the status field
    );

    // Check if any documents were modified
    if (result.modifiedCount > 0) {
      return res.send({
        status: true,
        message: "Status Updated Successfully",
        data: result,
      });
    }

    // If no documents were modified
    res.send({
      status: false,
      message: "No Records Found to Update",
      data: "",
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "Something went wrong",
      data: "",
    });
  }
};

module.exports = {
  subCategoryInsert,
  parentCategoryView,
  subCategoryView,
  subCategorySingleDelete,
  subCategoryMultipleDelete,
  subCategoryEditRowData,
  subCategoryUpdateRow,
  remove,
  changeStatus,
};
