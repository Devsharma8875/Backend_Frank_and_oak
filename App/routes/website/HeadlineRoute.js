const express = require("express");
const { headlineView } = require("../../controller/website/HeadlineController");
const headlineRoutes = express.Router();

headlineRoutes.get("/view", headlineView);

module.exports = { headlineRoutes };
