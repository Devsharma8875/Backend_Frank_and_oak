const express = require("express");
const { adminRoute } = require("./routes/adminRoute");
const { websiteRoute } = require("./routes/websiteRoutes");
const mainRoute = express.Router();

mainRoute.use("/admin", adminRoute);
mainRoute.use("/website", websiteRoute);

module.exports = { mainRoute };
