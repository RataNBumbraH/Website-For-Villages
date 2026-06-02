import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username:{
    type:String,
    required:true
  },
  contactno:{
    type:Number,
    required:true,
    unique:true,
  },
  age:{
    type:Number,
    required:true
  },
  address:{
    type:String,
    required:true
  },
  qualification:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  role:{
    type:String,
    enum:["user","admin","villagehead"],
    default:"user"
  },

  // 🔥 ADD THIS (MOST IMPORTANT)
  village:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Village",
    required: function() {
      return this.role === "villagehead";
    }
  }

});

const User = mongoose.models.User || mongoose.model("User",userSchema);
export default User;