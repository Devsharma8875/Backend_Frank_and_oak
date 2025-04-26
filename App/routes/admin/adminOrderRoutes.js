const express = require("express");
const {
  getAllOrders,
  updateOrderStatus,
  orderSingleDelete,
  orderMultipleDelete,
  orderEditRowData,
  remove,
  changeStatus,
} = require("../../controller/admin/orderController");
const verifyToken = require("../../middleware/verifyToken");

const adminOrderRoute = express.Router();

adminOrderRoute.get("/orders", verifyToken, getAllOrders); // Fetch all orders (Admin)
adminOrderRoute.delete("/orders/delete/:id", orderSingleDelete);
adminOrderRoute.post("/orders/multiple-delete", orderMultipleDelete);
adminOrderRoute.get("/orders/editrow/:id", orderEditRowData);
adminOrderRoute.patch("/orders/:id", verifyToken, updateOrderStatus); // Update order status
adminOrderRoute.post("/delete", remove);
adminOrderRoute.post("/change-status", changeStatus);

module.exports = { adminOrderRoute };
