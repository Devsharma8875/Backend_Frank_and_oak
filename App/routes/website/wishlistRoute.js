const express = require("express");
const {
  saveToWishlist,
  viewWishlist,
  deleteWishlist,
} = require("../../controller/website/wishlistController");

const wishlistWebsiteRoute = express.Router();

wishlistWebsiteRoute.post("/save-wishlist", saveToWishlist);
wishlistWebsiteRoute.get("/view-wishlist/:id", viewWishlist);
wishlistWebsiteRoute.delete("/delete-wishlist/:id", deleteWishlist);

module.exports = { wishlistWebsiteRoute };
