import mongoose from "mongoose"

const campRequestSchema = new mongoose.Schema({

village:{
type:mongoose.Schema.Types.ObjectId,
ref:"Village",
required:true
},

villagehead:{
type:mongoose.Schema.Types.ObjectId,
ref:"User",
required:true
},

title:{
type:String,
required:true,
trim:true
},

description:{
type:String,
required:true
},

date:{
type:Date,
required:true
},

status:{
type:String,
enum:["pending","approved","rejected"],
default:"pending",
},

adminReply:{
type:String,
default:""
}

},{timestamps:true})

export default mongoose.model("CampRequest",campRequestSchema)