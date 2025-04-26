const express = require("express");
const {
  headlineInsert,
  headlineView,
  headlineSingleDelete,
  headlineMultipleDelete,
  headlineEditRowData,
  headlineUpdateRowData,
  remove,
  changeStatus,
} = require("../../controller/admin/headlineController");
const headlineRoute = express.Router();

headlineRoute.post("/insert", headlineInsert);
headlineRoute.get("/view", headlineView);
headlineRoute.delete("/delete/:id", headlineSingleDelete);
headlineRoute.post("/multiple-delete", headlineMultipleDelete);
headlineRoute.get("/editrow/:id", headlineEditRowData);
headlineRoute.put("/updaterow/:id", headlineUpdateRowData);
headlineRoute.post("/delete", remove);
headlineRoute.post("/change-status", changeStatus);
module.exports = { headlineRoute };
