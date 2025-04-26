const orderModal = require("../../modal/orderModal");
const userModal = require("../../modal/userModel");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

// Fetch all orders (Admin)
const getAllOrders = async (req, res) => {
  try {
    // Extract query parameters
    const { orderId, pageNumber = 1 } = req.query;
    const limit = 5; // Number of orders per page

    // Build search object for orders
    let searchObject = {};
    if (orderId) {
      searchObject["orderId"] = new RegExp(orderId, "i");
    }
    // Fetch orders with pagination and sorting
    const orders = await orderModal
      .find(searchObject)
      .populate("user", "firstName lastName userEmail")
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limit)
      .limit(limit);

    // Count total number of orders for pagination
    const totalOrders = await orderModal.countDocuments(searchObject);
    const allPage = Math.ceil(totalOrders / limit);

    // Send response
    res.status(200).json({
      status: 1,
      data: orders,
      totalOrders,
      currentPage: parseInt(pageNumber),
      allPage,
      limit,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      status: 0,
      message: "Server error",
      error: error.message,
    });
  }
};
let orderSingleDelete = async (req, res) => {
  try {
    let id = req.params.id;
    let singleRowDelete = await orderModal.deleteOne({ _id: id });
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

let orderMultipleDelete = async (req, res) => {
  try {
    let { ids } = req.body;
    let singleRowDelete;
    for (let id of ids) {
      singleRowDelete = await orderModal.deleteOne({ _id: id });
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

let orderEditRowData = async (req, res) => {
  try {
    let id = req.params.id;
    let colorData = await orderModal.findOne({ _id: id });
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
// Update order status (Admin)
let updateOrderStatus = async (req, res) => {
  try {
    let { status } = req.body; // 'status' should be coming in the body
    let { id } = req.params;

    if (
      !["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].includes(
        status
      )
    ) {
      return res
        .status(400)
        .json({ status: 0, message: "Invalid status value." });
    }

    let updatedOrder = await orderModal.findByIdAndUpdate(
      id,
      { $set: { orderStatus: status } }, // Update the orderStatus with the new status
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ status: 0, message: "Order not found." });
    }

    res.status(200).json({
      status: 1,
      message: "Order status updated.",
      data: updatedOrder,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: 0, message: "Server error", error: error.message });
  }
};
let remove = async (req, res) => {
  try {
    const result = await orderModal.updateMany(
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
    // Validate input
    if (!req.body.id) {
      return res.status(400).send({
        status: false,
        message: "ID(s) are required.",
      });
    }

    // Ensure req.body.id is an array
    const ids = Array.isArray(req.body.id) ? req.body.id : [req.body.id];

    // Convert string IDs to ObjectId
    const objectIds = ids.map((id) => {
      if (!ObjectId.isValid(id)) {
        throw new Error(`Invalid ObjectId: ${id}`);
      }
      return new ObjectId(id);
    });

    // Toggle the status using $set and a ternary condition
    const result = await orderModal.updateMany(
      { _id: { $in: objectIds } }, // Filter documents by IDs
      [
        {
          $set: {
            orderStatus: {
              $cond: {
                if: { $eq: ["$orderStatus", "Delivered"] }, // Check if status is "Delivered"
                then: "Pending", // If true, set to "Pending"
                else: "Delivered", // Otherwise, set to "Delivered"
              },
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
    } else {
      return res.send({
        status: false,
        message:
          "No documents were updated. Check if the IDs are valid or if the status is already in the desired state.",
      });
    }
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).send({
      status: false,
      message: "An error occurred while updating the order status.",
    });
  }
};
module.exports = {
  getAllOrders,
  updateOrderStatus,
  orderSingleDelete,
  orderMultipleDelete,
  orderEditRowData,
  remove,
  changeStatus,
};
