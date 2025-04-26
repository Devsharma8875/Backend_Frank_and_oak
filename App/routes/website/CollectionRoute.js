const express=require("express")
const { parentCategory, parentSubCategory, colorView, sizeView, subCategoryView, filteredProductData } = require("../../controller/website/collectionController")
const collectionRoutes=express.Router()

collectionRoutes.get("/parent-category",parentCategory)
collectionRoutes.get("/sub-category/:slug",parentSubCategory)
collectionRoutes.get("/color-view",colorView)
collectionRoutes.get("/size-view",sizeView)
collectionRoutes.get("/subcategory-view",subCategoryView)

module.exports={collectionRoutes}