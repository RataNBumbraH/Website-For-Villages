import mongoose from 'mongoose'

const villageSchema = new mongoose.Schema({
    name:String,
    district:String,
    districtcode:Number,
    population:String,
    schools:String,
    hospitals:String,
    discription:String,
    highlightImages: {
        type: [String],
        default: []
    },
    villagehead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
})

export default mongoose.model("Village",villageSchema)