let verifyToken=(req,res,next)=>{
    console.log(req.header) //String split [ ]  //1 //Token


        next()
}

module.exports=verifyToken