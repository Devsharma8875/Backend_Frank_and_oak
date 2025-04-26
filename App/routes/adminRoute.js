const express = require("express");
const { categoryRoute } = require("./admin/categoryRoutes");
const { sizeRoute } = require("./admin/sizeRoutes");
const { storyRoute } = require("./admin/storyRoutes");
const { sliderRoute } = require("./admin/sliderRoutes");
const { colorRoute } = require("./admin/colorRoutes");
const { subCategoryRoute } = require("./admin/subCategoryRoutes");
const { productRoute } = require("./admin/productRoutes");
const { adminAuthRoute } = require("./admin/auth/adminAuthRoute");
const { profileRoute } = require("./admin/auth/profileRoute");
const { adminOrderRoute } = require("./admin/adminOrderRoutes");
const { headlineRoute } = require("./admin/headlineRoutes");
const { couponRoute } = require("./admin/couponRoutes");
const { dashboardRoutes } = require("./admin/dashboardRoutes");
const { reviewRoute } = require("./admin/reviewRoutes");

const verifyToken = require("../middleware/verifyToken");

const adminRoute = express.Router();

adminRoute.use("/auth", adminAuthRoute);
adminRoute.use("/dashboard", dashboardRoutes);
adminRoute.use("/profile", profileRoute);
adminRoute.use("/category", verifyToken, categoryRoute);
adminRoute.use("/size", sizeRoute);
adminRoute.use("/headline", headlineRoute);
adminRoute.use("/coupon", couponRoute);
adminRoute.use("/story", storyRoute);
adminRoute.use("/slider", sliderRoute);
adminRoute.use("/color", colorRoute);
adminRoute.use("/sub-category", subCategoryRoute);
adminRoute.use("/product", productRoute);
adminRoute.use("/order", adminOrderRoute);
adminRoute.use("/review", reviewRoute);

module.exports = { adminRoute };
