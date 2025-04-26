const { wishlistModal } = require("../../modal/wishlistModal");

let saveToWishlist = async (req, res) => {
  try {
    if (req.body.user) {
      let checkWishlist = await wishlistModal.findOne({
        product: req.body.product,
      });
      if (checkWishlist) {
        return res.status(200).json({
          status: 0,
          message: "Product already added in wishlist.",
        });
      } else {
        let saveWishlist = await wishlistModal(req.body);
        let data = await saveWishlist.save();
        res.status(200).json({
          status: 1,
          message: "1 item added to wishlist.",
          data: data,
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      status: 0,
      error: error.message,
    });
  }
};

let viewWishlist = async (req, res) => {
  try {
    let userId = req.params.id;
    let wishlistData = await wishlistModal.find({ user: userId }).populate({
      path: "product",
      populate: [
        { path: "productColorId", model: "color" },
        { path: "productSizeId", model: "size" },
      ],
    });
    res.status(200).json({
      status: 1,
      data: wishlistData,
      path: process.env.PRODUCT_STATIC_PATH,
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      error: error.message,
    });
  }
};

let deleteWishlist = async (req, res) => {
  try {
    let productId = req.params.id;
    let deleteWishlist = await wishlistModal.deleteOne({ product: productId });
    res.status(200).json({
      status: 1,
      message: "Item removed.",
      data: deleteWishlist,
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      error: error.message,
    });
  }
};

module.exports = { saveToWishlist, viewWishlist, deleteWishlist };
