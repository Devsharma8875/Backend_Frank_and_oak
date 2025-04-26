const express=require("express")
const { login } = require("../../../controller/admin/auth/adminAuthController")
const adminAuthRoute=express.Router()


adminAuthRoute.post("/login",login)

module.exports={adminAuthRoute}