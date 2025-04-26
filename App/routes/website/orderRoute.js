const express = require("express");
const {
  saveOrder,
  viewOrder,
  viewOrderDetail,
  razorpayVerifyOrder,
  cancelOrder,
} = require("../../controller/website/orderController");

const orderWebsiteRoute = express.Router();

orderWebsiteRoute.post("/save-order", saveOrder);
orderWebsiteRoute.get("/view-order/:id", viewOrder);
orderWebsiteRoute.get("/order-detail/:id", viewOrderDetail);
orderWebsiteRoute.post("/verify-razorpay-transaction", razorpayVerifyOrder);
orderWebsiteRoute.post("/cancel-order", cancelOrder);

module.exports = { orderWebsiteRoute };
