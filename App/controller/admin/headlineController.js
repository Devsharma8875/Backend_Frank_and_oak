const { headlineModal } = require("../../modal/admin/headline.js");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
let headlineInsert = async (req, res) => {
  let headlineData = {
    headlineName: req.body.headlineName,
    headlineStatus: req.body.headlineStatus,
  };
  const headlineCollection = new headlineModal(headlineData);
  try {
    let headlineRes = await headlineCollection.save();
    let response = {
      status: 1,
      message: "Data Saved.",
      res: headlineRes,
    };
    res.send(response);
  } catch (error) {
    let response = {
      status: 0,
      message: "Headline already Exists !",
      error: error,
    };
    res.send(response);
  }
};

let headlineView = async (req, res) => {
  let searchObject = {};
  let limit = 5;
  let { headlineName, pageNumber } = req.query;
  if (headlineName !== "") {
    searchObject["headlineName"] = new RegExp(headlineName, "i");
  }
  const headlineData = await headlineModal
    .find(searchObject)
    .skip((pageNumber - 1) * limit)
    .limit(limit);
  const totalPageNumber = await headlineModal.find(searchObject);
  let allPage = Math.ceil(totalPageNumber.length / limit);
  let response = {
    status: 1,
    dataList: headlineData,
    allPage,
    limit,
  };
  res.status(200).json(response);
};

let headlineSingleDelete = async (req, res) => {
  try {
    let { id } = req.params;
    let singleRowDelete = await headlineModal.deleteOne({ _id: id });
    if (singleRowDelete.deletedCount === 0) {
      return res.status(404).json({
        status: 0,
        message: "No record found to delete.",
      });
    }
    res.status(200).json({
      status: 1,
      message: "Record deleted",
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

let headlineMultipleDelete = async (req, res) => {
  try {
    let { ids } = req.body;
    let singleRowDelete;
    for (let id of ids) {
      singleRowDelete = await headlineModal.deleteOne({ _id: id });
      if (singleRowDelete.deletedCount === 0) {
        return res.status(404).json({
          status: 0,
          message: "No record found to delete.",
        });
      }
    }
    res.status(200).json({
      status: 1,
      message: "Record deleted",
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

let headlineEditRowData = async (req, res) => {
  try {
    let id = req.params.id;
    let headlineData = await headlineModal.findOne({ _id: id });
    if (headlineData) {
      return res.status(200).json({
        status: 1,
        message: "Record found.",
        res: headlineData,
      });
    }
    res.status(404).json({
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

let headlineUpdateRowData = async (req, res) => {
  try {
    let id = req.params.id;
    let sizeData = {
      headlineName: req.body.headlineName,
      headlineStatus: req.body.headlineStatus,
    };
    let headlineUpdate = await headlineModal.updateOne(
      { _id: id },
      { $set: sizeData }
    );
    res.status(200).json({
      status: 1,
      message: "Record Updated.",
      res: headlineUpdate,
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Server error occurred",
      error: error.message,
    });
  }
};
let remove = async (req, res) => {
  try {
    const result = await headlineModal.updateMany(
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
    const result = await headlineModal.updateMany(
      { _id: { $in: objectIds } }, // Filter documents by IDs
      [
        {
          $set: {
            headlineStatus: {
              $cond: { if: "$headlineStatus", then: false, else: true },
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
  headlineInsert,
  headlineView,
  headlineSingleDelete,
  headlineMultipleDelete,
  headlineEditRowData,
  headlineUpdateRowData,
  remove,
  changeStatus,
};
