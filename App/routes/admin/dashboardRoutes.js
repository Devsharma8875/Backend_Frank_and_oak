const express = require("express");
const {
  productView,
  UserView,
  OrderView,
  discountView,
} = require("../../controller/admin/dashboardController");
const dashboardRoutes = express.Router();

dashboardRoutes.get("/product-view", productView);
dashboardRoutes.get("/user-view", UserView);
dashboardRoutes.get("/order-view", OrderView);
dashboardRoutes.get("/discount-view", discountView);

module.exports = { dashboardRoutes };
