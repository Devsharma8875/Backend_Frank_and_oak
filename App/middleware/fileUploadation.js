const multer=require("multer")

let storage=(pathName)=> multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,pathName)
    },
    filename: function (req,file,cb){
        cb(null,Date.now()+file.originalname)
    }
})

let uploads=(pathName)=> multer({storage: storage(pathName)})

module.exports={uploads}