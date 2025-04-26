let mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    adminEmail: {
      type: String,
      unique: true,
      required:true
    },
    adminPassword: {
      type:String,
      required:true
    },
    
   
  },
  { timestamps: true }
);

let adminModal = mongoose.model("admin", adminSchema);

module.exports = { adminModal };
