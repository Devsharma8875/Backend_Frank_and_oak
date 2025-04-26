const { productModal } = require("../../modal/admin/productModal");
const { userModal } = require("../../modal/userModel");
const orderModal = require("../../modal/orderModal");
const couponModal = require("../../modal/admin/couponModel");
const mongoose = require("mongoose");

let productView = async (req, res) => {
  try {
    let totalProducts = await productModal.countDocuments({});

    res.status(200).json({
      status: 1,
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Internal server error!",
      error: error.message,
    });
  }
};
let UserView = async (req, res) => {
  try {
    let totalUsers = await userModal.countDocuments({});

    res.status(200).json({
      status: 1,
      totalUsers,
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Internal server error!",
      error: error.message,
    });
  }
};
let OrderView = async (req, res) => {
  try {
    let totalOrders = await orderModal.countDocuments({});

    res.status(200).json({
      status: 1,
      totalOrders,
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Internal server error!",
      error: error.message,
    });
  }
};
let discountView = async (req, res) => {
  try {
    let DiscountCoupon = await couponModal.countDocuments({});

    res.status(200).json({
      status: 1,
      DiscountCoupon,
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

module.exports = {
  productView,
  UserView,
  OrderView,
  discountView,
};
