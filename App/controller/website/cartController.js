const { cartModal } = require("../../modal/cartModal");
const { PRODUCT_STATIC_PATH } = require("../../config/staticPaths.js");
let createCart = async (req, res) => {
  try {
    // console.log(req.body)
    if (req.body) {
      const dataToSave = new cartModal(req.body);
      const data = await dataToSave.save();
      res.status(200).json({
        status: 1,
        data: data,
        message: "Added to cart.",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Server Error Occurred.",
      error: error.message,
    });
  }
};

let viewCart = async (req, res) => {
  try {
    let userId = req.params.userId;
    // console.log(userId)
    let cartData = await cartModal
      .find({ user: userId })
      .populate("product")
      .populate("user")
      .populate("size")
      .populate("color");
    res.status(200).json({
      status: 1,
      path: PRODUCT_STATIC_PATH,
      data: cartData,
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Server error occurred.",
      error: error.message,
    });
  }
};

let updateCart = async (req, res) => {
  let pid = req.body.cartId;
  let quantity = req.body.productQty;
  // console.log(pid, quantity);
  try {
    let cartData = await cartModal.updateOne(
      { _id: pid },
      { $set: { quantity: quantity } }
    );
    res.status(200).json({
      status: 1,
      data: cartData,
      message: "Quantity Updated.",
    });
    // console.log(cartData);
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Server error occurred.",
      error: error.message,
    });
  }
};

let deleteCartProduct = async (req, res) => {
  try {
    let itemId = req.params.id;
    if (itemId) {
      let cartData = await cartModal.deleteOne({ _id: itemId });
      res.status(200).json({
        status: 1,
        message: "1 item removed.",
        data: cartData,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "server error occurred.",
      error: error.message,
    });
  }
};

let clearCart = async (req, res) => {
  try {
    let userID = req.params.id;
    if (userID) {
      let cartData = await cartModal.deleteMany();
      res.status(200).json({
        status: 1,
        message: "Cart cleared.",
        data: cartData,
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

module.exports = {
  createCart,
  viewCart,
  updateCart,
  deleteCartProduct,
  clearCart,
};
