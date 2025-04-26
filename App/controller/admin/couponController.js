const couponModal = require("../../modal/admin/couponModel");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

let couponInsert = async (req, res) => {
  console.log("Request Body:", req.body); // Log the request body

  let couponData = {
    couponName: req.body.couponName,
    couponCode: req.body.couponCode,
    couponStatus: req.body.couponStatus,
    discountType: req.body.discountType,
    discountValue: req.body.discountValue,
    minOrderAmount: req.body.minOrderAmount,
    maxDiscountAmount: req.body.maxDiscountAmount,
    expiryDate: req.body.expiryDate,
    usageLimit: req.body.usageLimit,
  };

  // Validate required fields
  if (
    !couponData.couponName ||
    !couponData.couponCode ||
    couponData.couponStatus === undefined ||
    !couponData.discountType ||
    couponData.discountValue === undefined ||
    couponData.minOrderAmount === undefined ||
    couponData.maxDiscountAmount === undefined ||
    !couponData.expiryDate ||
    couponData.usageLimit === undefined
  ) {
    return res.status(400).json({
      status: 0,
      message: "Missing required fields!",
    });
  }

  try {
    // Check if coupon with the same name or code already exists
    let existingCoupon = await couponModal.findOne({
      $or: [
        { couponName: couponData.couponName },
        { couponCode: couponData.couponCode },
      ],
    });

    if (existingCoupon) {
      return res.status(400).json({
        status: 0,
        message: "Coupon with the same name or code already exists!",
      });
    }

    const couponCollection = new couponModal(couponData);
    let couponRes = await couponCollection.save();
    res.status(200).json({
      status: 1,
      message: "Coupon Created successfully.",
      res: couponRes,
    });
  } catch (error) {
    console.error("Error saving coupon:", error); // Log detailed error message
    console.error("Error stack trace:", error.stack); // Log the stack trace
    res.status(500).json({
      status: 0,
      message: "An error occurred while creating the coupon.",
      error: error.message,
    });
  }
};

let couponView = async (req, res) => {
  let searchObject = {};
  let limit = 10;
  let { couponName, pageNumber = 1 } = req.query;
  if (couponName) {
    searchObject["couponName"] = new RegExp(couponName, "i");
  }
  try {
    const couponData = await couponModal
      .find(searchObject)
      .skip((pageNumber - 1) * limit)
      .limit(limit);

    let totalPageNumber = await couponModal.find(searchObject);
    let allPage = Math.ceil(totalPageNumber.length / limit);

    res.status(200).json({ status: 1, allPage, dataList: couponData, limit });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Server error occurred.",
      error: error.message,
    });
  }
};

// ✅ Delete Single Coupon
let couponSingleDelete = async (req, res) => {
  try {
    let { id } = req.params;
    let deleteRes = await couponModal.deleteOne({ _id: id });

    if (deleteRes.deletedCount === 0) {
      return res
        .status(404)
        .json({ status: 0, message: "No record found to delete." });
    }

    res
      .status(200)
      .json({ status: 1, message: "Coupon deleted.", res: deleteRes });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Server error occurred.",
      error: error.message,
    });
  }
};

// ✅ Bulk Delete Coupons (Optimized)
let couponMultipleDelete = async (req, res) => {
  try {
    let { ids } = req.body;
    let deleteRes = await couponModal.deleteMany({ _id: { $in: ids } });

    if (deleteRes.deletedCount === 0) {
      return res
        .status(404)
        .json({ status: 0, message: "No records found to delete." });
    }

    res
      .status(200)
      .json({ status: 1, message: "Coupons deleted.", res: deleteRes });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: "Server error occurred.",
      error: error.message,
    });
  }
};

// ✅ Get Single Coupon
let couponEditRowData = async (req, res) => {
  try {
    let id = req.params.id;
    let couponData = await couponModal.findById(id);

    if (!couponData) {
      return res.status(404).json({ status: 0, message: "No record found." });
    }

    res
      .status(200)
      .json({ status: 1, message: "Record found.", res: couponData });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Server error occurred.",
      error: error.message,
    });
  }
};

// ✅ Update Coupon
let couponUpdateRowData = async (req, res) => {
  try {
    let id = req.params.id;
    let couponData = {
      couponName: req.body.couponName,
      couponCode: req.body.couponCode,
      couponStatus: req.body.couponStatus,
      discountType: req.body.discountType,
      discountValue: req.body.discountValue,
      minOrderAmount: req.body.minOrderAmount,
      maxDiscountAmount: req.body.maxDiscountAmount,
      expiryDate: req.body.expiryDate,
      usageLimit: req.body.usageLimit,
    };

    let updateRes = await couponModal.updateOne(
      { _id: id },
      { $set: couponData }
    );

    console.log("Update result:", updateRes);

    if (updateRes.nModified === 0) {
      return res.status(400).json({
        status: 0,
        message: "No changes were made. The data might be the same as before.",
      });
    }

    res
      .status(200)
      .json({ status: 1, message: "Coupon Updated.", res: updateRes });
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
    const result = await couponModal.updateMany(
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
    const result = await couponModal.updateMany(
      { _id: { $in: objectIds } }, // Filter documents by IDs
      [
        {
          $set: {
            couponStatus: {
              $cond: { if: "$couponStatus", then: false, else: true },
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
  couponInsert,
  couponView,
  couponSingleDelete,
  couponMultipleDelete,
  couponEditRowData,
  couponUpdateRowData,
  remove,
  changeStatus,
};
