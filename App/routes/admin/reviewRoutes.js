const express = require("express");
const {
  getReviews,
  getAllReviews,
  createReview,
  changeReviewStatus,
  reviewMultipleDelete,
} = require("../../controller/admin/reviewController");

const reviewRoute = express.Router();

// Public routes (no auth needed to read reviews)
reviewRoute.get("/view", getReviews);
reviewRoute.post("/add", createReview);
reviewRoute.get("/all", getAllReviews);
reviewRoute.post("/reviews/multiple-delete", reviewMultipleDelete);
reviewRoute.post("/change-status", changeReviewStatus);

module.exports = { reviewRoute };
