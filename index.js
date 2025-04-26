const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const { mainRoute } = require("./App/mainRoutes");
const { adminModal } = require("./App/modal/admin/adminModal");
const app = express();

app.use(cors());
app.use(express.json());
app.use(mainRoute);
app.use("/uploads/category", express.static("uploads/category"));
app.use("/uploads/slider", express.static("uploads/slider"));
app.use("/uploads/subCategory", express.static("uploads/subCategory"));
app.use("/uploads/product", express.static("uploads/product"));
app.use("/uploads/story", express.static("uploads/story"));
app.use("/uploads/profile", express.static("uploads/profile"));

// Atlas Connection

// mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB_NAME}`)
// .then( async (res)=>{
//     app.listen(process.env.SERVER_PORT)
//     console.log(process.env.SERVER_PORT)
//     const admintable=await adminModal.find()
//     if(admintable.length==0){
//         let adminData=await adminModal({
//             adminEmail:process.env.ADMIN_EMAIL,
//             adminPassword:process.env.ADMIN_PASSWORD
//         })
//         await adminData.save()
//     }
// });

// Local Host Connection

mongoose
  .connect(
    `mongodb+srv://dev02930:${process.env.DB_PASSWORD}@cluster0.1gucj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(async (res) => {
    app.listen(process.env.SERVER_PORT);
    console.log("Connected to Database", process.env.SERVER_PORT);
    const admintable = await adminModal.find();
    if (admintable.length == 0) {
      let adminData = await adminModal({
        adminEmail: process.env.ADMIN_EMAIL,
        adminPassword: process.env.ADMIN_PASSWORD,
      });
      await adminData.save();
    }
  });
