const { myslug } = require("../../config/slugConfig");
const { colorModal } = require("../../modal/admin/colorModal");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

let colorInsert = async (req, res) => {
  let { colorCode, colorName, colorStatus } = req.body;
  let colorData = {
    colorName: colorName,
    colorCode: colorCode,
    colorStatus: colorStatus,
    slug: myslug(colorName),
  };
  const colorCollection = new colorModal(colorData);
  try {
    let colorRes = await colorCollection.save();
    let response = {
      status: 1,
      message: "Data saved.",
      res: colorRes,
    };
    res.send(response);
  } catch (error) {
    let response = {
      status: 0,
      message: "Color already exists !",
      error: error,
    };
    res.send(response);
  }
};

let colorView = async (req, res) => {
  let searchObject = {};
  let limit = 5;
  let { colorName, colorCode, pageNumber } = req.query;
  if (colorName !== "") {
    searchObject["colorName"] = new RegExp(colorName, "i");
  }
  if (colorCode !== "") {
    searchObject["colorCode"] = new RegExp(colorCode, "i");
  }
  const colorData = await colorModal
    .find(searchObject)
    .skip((pageNumber - 1) * limit)
    .limit(limit);
  const totalPageNumber = await colorModal.find(searchObject);
  let allPage = Math.ceil(totalPageNumber.length / limit);
  let response = {
    status: 1,
    dataList: colorData,
    allPage,
    limit,
  };
  res.status(200).json(response);
};

let colorSingleDelete = async (req, res) => {
  try {
    let id = req.params.id;
    let singleRowDelete = await colorModal.deleteOne({ _id: id });
    if (singleRowDelete.deletedCount === 0) {
      return res.status(404).json({
        status: 0,
        message: "No record found to delete.",
      });
    }
    res.status(200).json({
      status: 1,
      message: "Data deleted.",
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

let colorMultipleDelete = async (req, res) => {
  try {
    let { ids } = req.body;
    let singleRowDelete;
    for (let id of ids) {
      singleRowDelete = await colorModal.deleteOne({ _id: id });
      if (singleRowDelete.deletedCount === 0) {
        return res.status(404).json({
          status: 0,
          message: "No record found to delete.",
        });
      }
    }
    res.status(200).json({
      status: 1,
      message: "Record deleted.",
      res: singleRowDelete,
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: "Server error occurred",
      error: error.message,
    });
  }
};

let colorEditRowData = async (req, res) => {
  try {
    let id = req.params.id;
    let colorData = await colorModal.findOne({ _id: id });
    if (colorData) {
      res.status(200).json({
        status: 1,
        message: "Record found to update",
        res: colorData,
      });
    } else {
      res.status(404).json({
        status: 0,
        message: "No record found to update",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Server error occurred",
      error: error.message,
    });
  }
};

let colorUpdateRowData = async (req, res) => {
  let id = req.params.id;
  let { colorCode, colorName, colorStatus } = req.body;
  let colorData = {
    colorName: colorName,
    colorCode: colorCode,
    colorStatus: colorStatus,
    slug: myslug(colorName),
  };
  let colorUpdate = await colorModal.updateOne(
    { _id: id },
    { $set: colorData }
  );
  res.status(200).json({
    status: 1,
    message: "Record updated.",
    res: colorUpdate,
  });
};
let remove = async (req, res) => {
  try {
    const result = await colorModal.updateMany(
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
    const result = await colorModal.updateMany(
      { _id: { $in: objectIds } }, // Filter documents by IDs
      [
        {
          $set: {
            colorStatus: {
              $cond: { if: "$colorStatus", then: false, else: true },
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
  colorInsert,
  colorView,
  colorSingleDelete,
  colorMultipleDelete,
  colorEditRowData,
  colorUpdateRowData,
  remove,
  changeStatus,
};
