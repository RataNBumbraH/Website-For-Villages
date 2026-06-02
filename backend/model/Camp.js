import mongoose from "mongoose"

const campSchema = new mongoose.Schema({

title:{
type:String,
required:true,
trim:true
},

description:{
type:String,
required:true
},

village:{
type:mongoose.Schema.Types.ObjectId,
ref:"Village",
required:true
},

date:{
type:Date,
required:true
},

images:{
type:[String],
default:[]
}

},{timestamps:true})

export default mongoose.model("Camp",campSchema)