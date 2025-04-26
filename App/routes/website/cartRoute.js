const express=require("express")
const { createCart, viewCart, updateCart, deleteCartProduct, clearCart } = require("../../controller/website/cartController")
const multer = require("multer")

const cartWebsiteRoute=express.Router()

cartWebsiteRoute.use(multer().none())

cartWebsiteRoute.post("/save-cart",createCart)
cartWebsiteRoute.get("/view-cart/:userId",viewCart)
cartWebsiteRoute.put("/update-cart",updateCart)
cartWebsiteRoute.delete("/delete-cart-product/:id",deleteCartProduct)
cartWebsiteRoute.delete("/clear-cart/:id",clearCart)

module.exports= cartWebsiteRoute