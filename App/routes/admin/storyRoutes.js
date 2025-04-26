const express = require("express");
const {
  storyInsert,
  storyView,
  storySingleDelete,
  storyMultipleDelete,
  storyEditRowData,
  storyUpdateRowData,
  remove,
  changeStatus,
} = require("../../controller/admin/storyController");
const { uploads } = require("../../middleware/fileUploadation");
const storyRoute = express.Router();

storyRoute.post(
  "/insert",
  uploads("uploads/story").fields([
    { name: "storyImage", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
  ]),
  storyInsert
);
storyRoute.get("/view", storyView);
storyRoute.delete("/delete/:id", storySingleDelete);
storyRoute.post("/multiple-delete", storyMultipleDelete);
storyRoute.get("/editrow/:id", storyEditRowData);
storyRoute.post("/delete", remove);
storyRoute.post("/change-status", changeStatus);
storyRoute.put(
  "/updaterow/:id",
  uploads("uploads/story").fields([
    { name: "storyImage", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
  ]),
  storyUpdateRowData
);

module.exports = { storyRoute };
