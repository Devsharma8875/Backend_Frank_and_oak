const { Review } = require("../../modal/reviewModal");
const mongoose = require("mongoose");
const productModal = require("../../modal/admin/productModal").productModal;

// Create a new review
const createReview = async (req, res) => {
  try {
    const { product, reviewerName, rating, comment } = req.body;

    // Validate input
    if (!product || !reviewerName || !rating || !comment) {
      return res.status(400).json({
        status: 0,
        message: "All fields are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(product)) {
      return res.status(400).json({
        status: 0,
        message: "Invalid product ID format",
      });
    }

    // Create and save review
    const review = new Review({
      product: new mongoose.Types.ObjectId(product),
      reviewerName,
      rating,
      comment,
    });

    const savedReview = await review.save();

    // Update the associated product
    await productModal.findByIdAndUpdate(
      product,
      { $push: { reviews: savedReview._id } },
      { new: true }
    );

    return res.status(201).json({
      status: 1,
      message: "Review created successfully",
      data: savedReview,
    });
  } catch (error) {
    console.error("Review creation error:", error);

    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return res.status(400).json({
        status: 0,
        message: "Duplicate review prevented",
        error: "This review already exists",
      });
    }

    return res.status(500).json({
      status: 0,
      message: "Error creating review",
      error: error.message,
    });
  }
};

// Get all reviews for a product
const getReviews = async (req, res) => {
  try {
    const { product } = req.query; // Expecting "product" from frontend

    if (!mongoose.Types.ObjectId.isValid(product)) {
      return res.status(400).json({
        status: 0,
        message: "Invalid product ID format",
      });
    }

    const reviews = await Review.find({ product })
      .sort({ createdAt: -1 })
      .populate("product", "productName productImage");

    res.status(200).json({
      status: 1,
      data: reviews,
      message: "Reviews fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);

    res.status(500).json({
      status: 0,
      message: "Error fetching reviews",
      error: error.message,
    });
  }
};
// const getAllReviews = async (req, res) => {
//   try {
//     // Optionally, add pagination or filters here if needed
//     const reviews = await Review.find({})
//       .sort({ createdAt: -1 })
//       .populate("product", "productName productImage");

//     res.status(200).json({
//       status: 1,
//       data: reviews,
//       message: "All reviews fetched successfully",
//     });
//   } catch (error) {
//     console.error("Error fetching all reviews:", error);

//     res.status(500).json({
//       status: 0,
//       message: "Error fetching all reviews",
//       error: error.message,
//     });
//   }
//   let searchObject = {};
//   let limit = 5;
//   let { sizeName, pageNumber } = req.query;
//   if (sizeName !== "") {
//     searchObject["sizeName"] = new RegExp(sizeName, "i");
//   }
//   const sizeData = await sizeModal
//     .find(searchObject)
//     .skip((pageNumber - 1) * limit)
//     .limit(limit);
//   const totalPageNumber = await sizeModal.find(searchObject);
//   let allPage = Math.ceil(totalPageNumber.length / limit);
//   let response = {
//     status: 1,
//     dataList: sizeData,
//     allPage,
//     limit,
//   };
//   res.status(200).json(response);
// };
const getAllReviews = async (req, res) => {
  try {
    let { reviewerName = "", pageNumber = 1, limit = 5 } = req.query;

    // Create a search object if filters are provided
    let searchObject = {};
    if (reviewerName) {
      searchObject["reviewerName"] = new RegExp(reviewerName, "i"); // Case-insensitive search
    }

    // Fetch the total count of documents matching the search criteria
    const totalReviewsCount = await Review.find(searchObject).countDocuments();

    // Fetch the paginated and sorted reviews
    const reviews = await Review.find(searchObject)
      .sort({ createdAt: -1 }) // Sort by createdAt descending
      .skip((pageNumber - 1) * limit) // Skip documents based on the page number
      .limit(limit) // Limit the number of documents per page
      .populate("product", "productName productImage"); // Populate related product fields

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalReviewsCount / limit);

    // Return the response
    res.status(200).json({
      status: 1,
      data: reviews,
      totalPages,
      limit,
      message: "All reviews fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching all reviews:", error);

    res.status(500).json({
      status: 0,
      message: "Error fetching all reviews",
      error: error.message,
    });
  }
};

const changeReviewStatus = async (req, res) => {
  try {
    // Validate input
    if (!req.body.id) {
      return res.status(400).json({
        status: 0,
        message: "ID(s) are required.",
      });
    }

    // Ensure req.body.id is an array
    const ids = Array.isArray(req.body.id) ? req.body.id : [req.body.id];

    // Convert string IDs to ObjectId instances
    const objectIds = ids.map((id) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid ObjectId: ${id}`);
      }
      return new mongoose.Types.ObjectId(id);
    });

    // Toggle the `approved` field: if currently true, set to false; if false, set to true
    const result = await Review.updateMany({ _id: { $in: objectIds } }, [
      {
        $set: {
          status: {
            $cond: {
              if: { $eq: ["$status", true] },
              then: false,
              else: true,
            },
          },
        },
      },
    ]);

    if (result.modifiedCount > 0) {
      return res.status(200).json({
        status: 1,
        message: "Status updated successfully",
        data: result,
      });
    } else {
      return res.status(200).json({
        status: 0,
        message:
          "No documents were updated. Check if the IDs are valid or if the status is already in the desired state.",
      });
    }
  } catch (error) {
    console.error("Error updating review status:", error);
    res.status(500).json({
      status: 0,
      message: "An error occurred while updating the review status.",
      error: error.message,
    });
  }
};

// Delete multiple reviews
const reviewMultipleDelete = async (req, res) => {
  try {
    let { ids } = req.body;
    let singleRowDelete;
    // Loop through each id and delete the review
    for (let id of ids) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          status: 0,
          message: `Invalid review ID: ${id}`,
        });
      }
      singleRowDelete = await Review.deleteOne({ _id: id });
      if (singleRowDelete.deletedCount === 0) {
        return res.status(404).json({
          status: 0,
          message: "No record found to delete for id " + id,
        });
      }
    }
    res.status(200).json({
      status: 1,
      message: "Review(s) deleted successfully.",
      data: singleRowDelete,
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: "Server error occurred",
      error: error.message,
    });
  }
};

module.exports = {
  createReview,
  getReviews,
  getAllReviews,
  changeReviewStatus,
  reviewMultipleDelete,
};
