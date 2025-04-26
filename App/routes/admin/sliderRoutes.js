const express = require("express");
const {
  sliderInsert,
  sliderView,
  sliderSingleDelete,
  sliderMultipleDelete,
  sliderEditRowData,
  sliderUpdateRowData,
  remove,
  changeStatus,
} = require("../../controller/admin/sliderController");
const { uploads } = require("../../middleware/fileUploadation");

const sliderRoute = express.Router();

sliderRoute.post(
  "/insert",
  uploads("uploads/slider").single("sliderImage"),
  sliderInsert
);
sliderRoute.get("/view", sliderView);
sliderRoute.delete("/delete/:id", sliderSingleDelete);
sliderRoute.post("/multiple-delete", sliderMultipleDelete);
sliderRoute.get("/editrow/:id", sliderEditRowData);
sliderRoute.post("/delete", remove);
sliderRoute.post("/change-status", changeStatus);
sliderRoute.put(
  "/updaterow/:id",
  uploads("uploads/slider").single("sliderImage"),
  sliderUpdateRowData
);
module.exports = { sliderRoute };
