const mongoose=require("mongoose")

let forgetPassSchema=new mongoose.Schema({
    userEmail:String,
    tncChecked:{
        type:Boolean,
        default:true
    }
})

let forgetPasswordModal=mongoose.model("ForgetPassword",forgetPassSchema)

module.exports={forgetPasswordModal}