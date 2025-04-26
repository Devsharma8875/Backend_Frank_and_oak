const { myslug } = require("../../config/slugConfig");
const { sliderModal } = require("../../modal/admin/sliderModal");
const fs = require("fs");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const { SLIDER_STATIC_PATH } = require("../../config/staticPaths.js");
let sliderInsert = async (req, res) => {
  let { sliderName, sliderHeading, sliderSubHeading, sliderStatus } = req.body;
  let sliderData = {
    sliderName: sliderName,
    sliderHeading: sliderHeading,
    sliderSubHeading: sliderSubHeading,
    sliderStatus: sliderStatus,
    slug: myslug(req.body.sliderName),
  };
  if (req.file) {
    if (req.file.filename) {
      sliderData["sliderImage"] = req.file.filename;
    }
  }
  const sliderCollection = new sliderModal(sliderData);
  try {
    let sliderRes = await sliderCollection.save();
    let response = {
      status: 1,
      message: "Data saved.",
      res: sliderRes,
    };
    res.send(response);
  } catch (error) {
    let response = {
      status: 0,
      message: "Data already exists !",
      error: error,
    };
    res.send(response);
  }
};

let sliderView = async (req, res) => {
  let { sliderName, sliderHeading, pageNumber } = req.query;
  let searchObject = {};
  let limit = 5;
  if (sliderName !== "") {
    searchObject["sliderName"] = new RegExp(sliderName, "i");
  }
  if (sliderHeading !== "") {
    searchObject["sliderHeading"] = new RegExp(sliderHeading, "i");
  }
  const sliderData = await sliderModal
    .find(searchObject)
    .skip((pageNumber - 1) * limit)
    .limit(limit);
  const totalPageNumber = await sliderModal.find(searchObject);
  let allPage = Math.ceil(totalPageNumber.length / limit);
  let response = {
    status: 1,
    path: SLIDER_STATIC_PATH,
    dataList: sliderData,
    allPage,
    limit,
  };
  res.status(200).json(response);
};

let sliderSingleDelete = async (req, res) => {
  try {
    let { id } = req.params;
    let sliderData = await sliderModal.findOne({ _id: id });
    if (sliderData) {
      let imageName = await sliderData.sliderImage;
      let path = "uploads/slider/" + imageName;
      fs.unlinkSync(path);
      let singleRowDelete = await sliderModal.deleteOne({ _id: id });
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
    return res.status(500).json({
      status: 0,
      message: "Server error occurred",
      error: error.message,
    });
  }
};

let sliderMultipleDelete = async (req, res) => {
  try {
    let { ids } = req.body;
    let singleRowDelete;
    for (let id of ids) {
      let sliderData = await sliderModal.findOne({ _id: id });
      if (sliderData) {
        let imageName = await sliderData.sliderImage;
        let path = "uploads/slider/" + imageName;
        fs.unlinkSync(path);
        singleRowDelete = await sliderModal.deleteOne({ _id: id });
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
      message: "Server error occurred",
      error: error.message,
    });
  }
};

let sliderEditRowData = async (req, res) => {
  try {
    let id = req.params.id;
    let sliderData = await sliderModal.findOne({ _id: id });
    if (sliderData) {
      return res.status(200).json({
        status: 1,
        message: "Record Found.",
        path: SLIDER_STATIC_PATH,
        res: sliderData,
      });
    }
    res.status(200).json({
      status: 0,
      message: "No record found.",
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Server error occurred.",
      error: error.message,
    });
  }
};

let sliderUpdateRowData = async (req, res) => {
  try {
    let id = req.params.id;
    let { sliderName, sliderHeading, sliderSubHeading, sliderStatus } =
      req.body;
    let sliderData = {
      sliderName: sliderName,
      sliderHeading: sliderHeading,
      sliderSubHeading: sliderSubHeading,
      sliderStatus: sliderStatus,
      slug: myslug(req.body.sliderName),
    };
    if (req.file) {
      if (req.file.filename) {
        sliderData["sliderImage"] = req.file.filename;
      }
    }
    let sliderUpdate = await sliderModal.updateOne(
      { _id: id },
      { $set: sliderData }
    );
    res.status(200).json({
      status: 1,
      message: "Record Updated.",
      res: sliderUpdate,
    });
  } catch (error) {
    res.status(200).json({
      status: 0,
      message: "Server error occurred.",
      error: error.message,
    });
  }
};
let remove = async (req, res) => {
  try {
    const result = await sliderModal.updateMany(
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
    const result = await sliderModal.updateMany(
      { _id: { $in: objectIds } }, // Filter documents by IDs
      [
        {
          $set: {
            sliderStatus: {
              $cond: { if: "$sliderStatus", then: false, else: true },
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
  sliderInsert,
  sliderView,
  sliderSingleDelete,
  sliderMultipleDelete,
  sliderEditRowData,
  sliderUpdateRowData,
  remove,
  changeStatus,
};
