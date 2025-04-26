const { adminModal } = require("../../../modal/admin/adminModal");
const jwt = require('jsonwebtoken');

let login=async (req,res)=>{
   let {uemail,upassword}=req.body;
   let adminData=await adminModal.findOne({adminEmail:uemail,adminPassword:upassword})

   if(adminData){

    let token = jwt.sign({ adminID: adminData._id }, process.env.JWT_PASSWORD); 


   
   let obj={
    _id:adminData._id,
    adminEmail:adminData.adminEmail,
    token
    
   }

    console.log(adminData)
    res.status(200).json({
        status:1,
        data:obj,
       
    })
   }
   else{
    res.status(200).json({
        status:0,
        message:"Invalid username and password"
    })
   }
}

module.exports={login}