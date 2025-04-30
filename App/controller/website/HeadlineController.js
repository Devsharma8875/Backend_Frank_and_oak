const { headlineModal } = require("../../modal/admin/headline.js");
const mongoose = require("mongoose");

let headlineView = async (req, res) => {
  try {
    const headlineData = await headlineModal.find({});
    let response = {
      status: 1,
      dataList: headlineData,
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ status: 0, message: "Server error", error });
  }
};

module.exports = {
  headlineView,
};
