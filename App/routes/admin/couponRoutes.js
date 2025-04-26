const express = require("express");
const {
  couponInsert,
  couponView,
  couponSingleDelete,
  couponMultipleDelete,
  couponEditRowData,
  couponUpdateRowData,
  remove,
  changeStatus,
} = require("../../controller/admin/couponController");
const couponRoute = express.Router();

couponRoute.post("/insert", couponInsert);
couponRoute.get("/view", couponView);
couponRoute.delete("/delete/:id", couponSingleDelete);
couponRoute.post("/multiple-delete", couponMultipleDelete);
couponRoute.get("/editrow/:id", couponEditRowData);
couponRoute.put("/updaterow/:id", couponUpdateRowData);
couponRoute.post("/delete", remove);
couponRoute.post("/change-status", changeStatus);
module.exports = { couponRoute };
