const express = require("express");
const {
  activeProducts,
  productDetail,
  filteredProductData,
} = require("../../controller/website/productController");

const productWebsiteRoute = express.Router();

productWebsiteRoute.get("/active-products", activeProducts);
productWebsiteRoute.get("/product-detail/:slugname", productDetail);
productWebsiteRoute.get("/filtered-category-view/:id", filteredProductData);

module.exports = { productWebsiteRoute };
