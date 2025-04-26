const { headlineModal } = require("../../modal/admin/headline.js");
const mongoose = require("mongoose");

// let headlineView = async (req, res) => {
//   let searchObject = {};
//   let limit = 5;
//   let { headlineName, pageNumber } = req.query;
//   if (headlineName !== "") {
//     searchObject["headlineName"] = new RegExp(headlineName, "i");
//   }
//   const headlineData = await headlineModal
//     .find(searchObject)
//     .skip((pageNumber - 1) * limit)
//     .limit(limit);
//   const totalPageNumber = await headlineModal.find(searchObject);
//   let allPage = Math.ceil(totalPageNumber.length / limit);
//   let response = {
//     status: 1,
//     dataList: headlineData,
//     allPage,
//     limit,
//   };
//   res.status(200).json(response);
// };
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
