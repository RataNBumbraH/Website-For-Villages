import express from "express"
import Camp from "../model/Camp.js"
import upload from "../middleware/uploadMiddleware.js"
import protect from "../middleware/authmiddleware.js"
import adminOnly from "../middleware/adminMiddleware.js"

const router = express.Router()

/* CREATE CAMP (ADMIN) */

router.post(
"/admin/create-camp",
protect,
adminOnly,
upload.array("images",10),

async(req,res)=>{

try{

const {title,description,village,date} = req.body

if(!title || !description || !village || !date){

return res.status(400).json({
message:"All fields are required"
})

}

let images = []

if(req.files && req.files.length>0){
images = req.files.map(file=>file.filename)
}

const camp = new Camp({

title,
description,
village,
date,
images

})

await camp.save()

res.status(201).json({
success:true,
data:camp
})

}catch(err){

console.error(err)

res.status(500).json({
success:false,
message:"Server error"
})

}

})

/* GET CAMPS OF A VILLAGE */

router.get("/village/:id/camps",async(req,res)=>{

try{

const camps = await Camp.find({
village:req.params.id
}).sort({date:-1})

res.status(200).json(camps)

}catch(err){

console.error(err)

res.status(500).json({
message:"Server error"
})

}

})

/* GET SINGLE CAMP */

router.get("/camp/:id",async(req,res)=>{

try{

const camp = await Camp.findById(req.params.id)
.populate("village","name district")

if(!camp){
return res.status(404).json({message:"Camp not found"})
}

res.status(200).json(camp)

}catch(err){

console.error(err)

res.status(500).json({
message:"Server error"
})

}

})

// No auth middleware — public route
router.get("/camps/count", async (req, res) => {
  try {
    const count = await Camp.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router