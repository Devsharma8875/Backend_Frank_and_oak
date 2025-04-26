const express=require("express")
const {  profileInsert, profileView, profileUpdate } = require("../../../controller/admin/auth/profileController")
const { uploads } = require("../../../middleware/fileUploadation")

const profileRoute=express.Router()

profileRoute.post("/insert",profileInsert)
profileRoute.get("/view",profileView)
profileRoute.put("/update/:id",uploads("uploads/profile").fields([
    {name:"logoImage", maxCount:1},
    {name:"subLogoImage", maxCount:1},
    {name:"profileImage", maxCount:1},

]),profileUpdate)

module.exports={profileRoute}