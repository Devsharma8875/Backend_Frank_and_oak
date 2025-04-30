const { productModal } = require("../../modal/admin/productModal");
const { PRODUCT_STATIC_PATH } = require("../../config/staticPaths.js");

const activeProducts = async (req, res) => {
  try {
    let productList = await productModal
      .find({ productStatus: true })
      .populate("productParentCategoryId")
      .populate("productSubCategoryId")
      .populate(["productSizeId"])
      .populate(["productColorId"]);

    res.status(200).json({
      status: 1,
      path: PRODUCT_STATIC_PATH,
      data: productList,
    });
  } catch (error) {
    res.status(200).json({
      status: 0,
      error: error.message,
    });
  }
};

const productDetail = async (req, res) => {
  try {
    let { slugname } = req.params;
    if (slugname) {
      let productDetail = await productModal
        .findOne({ slug: slugname })
        .populate("productParentCategoryId")
        .populate("productSubCategoryId")
        .populate(["productSizeId"])
        .populate(["productColorId"]);
      if (productDetail) {
        res.status(200).json({
          status: 1,
          data: productDetail,
          path: PRODUCT_STATIC_PATH,
        });
      } else {
        res.status(200).json({
          status: 0,
          message: "No Product found",
        });
      }
    }
  } catch (error) {
    console.log("Error on Product Deltail: ", error.message);
    res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};

const filteredProductData = async (req, res) => {
  try {
    const productCatId = req.params.id; // Parent category ID from the URL
    const { color, size, subCategory, sort } = req.query; // Filter and sort parameters

    // Build the filter object
    const filter = {
      productParentCategoryId: productCatId,
      productStatus: true,
    };

    // Add filters if provided
    if (color) filter.productColorId = color;
    if (size) filter.productSizeId = size;
    if (subCategory) filter.productSubCategoryId = subCategory;

    // Fetch products with the applied filters
    let productData = await productModal
      .find(filter)
      .populate("productParentCategoryId")
      .populate("productSubCategoryId")
      .populate("productSizeId")
      .populate("productColorId");

    // Sort products if sort parameter is provided
    if (sort === "lowToHigh") {
      productData.sort((a, b) => a.productPrice - b.productPrice);
    } else if (sort === "highToLow") {
      productData.sort((a, b) => b.productPrice - a.productPrice);
    }

    res.status(200).json({
      status: 1,
      data: productData,
      path: PRODUCT_STATIC_PATH,
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      error: error.message,
    });
  }
};
module.exports = { activeProducts, productDetail, filteredProductData };
