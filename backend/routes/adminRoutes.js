import express, { request } from "express"
import Village from "../model/Village.js"
import User from "../model/User.js"
import CampRequest from "../model/CampRequest.js"
import Camp from "../model/Camp.js"
import Feedback from "../model/Feedback.js"
import protect from "../middleware/authmiddleware.js"
import adminOnly from "../middleware/adminMiddleware.js"
import upload from "../middleware/uploadMiddleware.js"
import path from "path"
import fs from "fs"

const router = express.Router()

/* ==============================
ADMIN DASHBOARD STATS
============================== */

router.get(
"/admin/dashboard",
protect,
adminOnly,
async(req,res)=>{

try{

const villages = await Village.countDocuments()
const users = await User.countDocuments()
const camps = await Camp.countDocuments()
const camprequest = await CampRequest.countDocuments({status:"pending"})
const feedback = await Feedback.countDocuments({status:"pending"})

res.json({
villages,
users,
camps,
camprequest,
feedback
})

}
catch(err){
res.status(500).json({error:err.message})
}

})

/* ==============================
GET ALL VILLAGES
============================== */

router.get(
"/admin/villages",
protect,
adminOnly,
async(req,res)=>{

try{

const villages = await Village.find()

res.json(villages)

}
catch(err){
res.status(500).json({error:err.message})
}

})

router.get("/admin/villages/:id", async (req,res)=>{
try{

const village = await Village.findById(req.params.id)

res.json(village)

}
catch(err){
res.status(500).json({error:err.message})
}
})

/* ==============================
ADD VILLAGE
============================== */

router.post(
"/admin/addvillage",
protect,
adminOnly,
upload.array("images",10), 
async (req,res)=>{

try{

const {
name,
district,
districtcode,
population,
schools,
hospitals,
description,
highlightImages
} = req.body

let images = []

if(req.files){
images = req.files.map(file=>file.filename)
}

// validation
if(!name || !district){
return res.status(400).json({
error:"Village name and district are required"
})
}

const village = new Village({
name,
district,
districtcode,
population,
schools,
hospitals,
description,
highlightImages: images 
})

await village.save()

res.status(201).json({
success:true,
message:"Village added successfully",
village
})

}
catch(err){

console.error("Add Village Error:",err)

res.status(500).json({
error:"Server error"
})

}

})

/* ==============================
UPDATE VILLAGE
============================== */

router.put(
"/admin/villages/:id",
protect,
adminOnly,
upload.array("images", 10),

async (req, res) => {

try {

const {
name,
district,
districtcode,
population,
schools,
hospitals,
description
} = req.body;

// images coming from frontend
const existingImages = req.body.existingImages
? JSON.parse(req.body.existingImages)
: [];

const village = await Village.findById(req.params.id);

if (!village) {
return res.status(404).json({ error: "Village not found" });
}

// NEW images
let newImages = [];
if (req.files && req.files.length > 0) {
newImages = req.files.map(file => file.filename);
}

// 🔥 DELETE removed images from server
const imagesToDelete = (village.highlightImages || [])
.filter(img => !existingImages.includes(img));

imagesToDelete.forEach(img => {
const filePath = path.join("uploads", img);
if (fs.existsSync(filePath)) {
fs.unlinkSync(filePath);
}
});

// FINAL IMAGE LIST
const updatedImages = [
...existingImages,
...newImages
];

// UPDATE DB
const updatedVillage = await Village.findByIdAndUpdate(
req.params.id,
{
name,
district,
districtcode,
population,
schools,
hospitals,
description,
highlightImages: updatedImages
},
{ new: true }
);

res.json({
message: "Village updated successfully",
village: updatedVillage
});

} catch (err) {
console.error(err);
res.status(500).json({ error: err.message });
}

}
);


/* ==============================
DELETE VILLAGE
============================== */

router.delete(
"/admin/villages/:id",
protect,
adminOnly,
async(req,res)=>{

try{

await Village.findByIdAndDelete(
req.params.id
)

res.json({
message:"Village deleted"
})

}
catch(err){
res.status(500).json({error:err.message})
}

})

/* ==============================
GET ALL USERS
============================== */

router.get(
  "/admin/users",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const users = await User.find().populate("village", "name");
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.put("/admin/user/:id",protect,adminOnly,async(req,res)=>{

try{

const updatedUser = await User.findByIdAndUpdate(

req.params.id,

{
username:req.body.username || user.body.name,
contactno:req.body.contactno,
address:req.body.address,
qualification:req.body.qualification,
age:req.body.age,
role:req.body.role
},

{new:true}

)

res.json(updatedUser)

}catch(err){

res.status(500).json({error:err.message})

}

})

router.delete("/admin/user/:id",protect,adminOnly,async(req,res)=>{

try{

await User.findByIdAndDelete(req.params.id)

res.json({message:"User deleted successfully"})

}catch(err){

res.status(500).json({error:err.message})

}

})

/* ==============================
GET CAMP REQUESTS
============================== */

router.get(
"/admin/camp-requests",
protect,
adminOnly,
async(req,res)=>{

const requests = await CampRequest.find()
.populate("villagehead","username")
.populate("village","name")

res.json(requests)

})

/* ==============================
UPDATE CAMP STATUS
============================== */

router.put(
"/admin/camp-requests/:id",
protect,
adminOnly,
async(req,res)=>{

await CampRequest.findByIdAndUpdate(

req.params.id,

{
status:req.body.status,
adminReply:req.body.adminReply
}

)

res.json({message:"Reply sent"})

})

/* ==============================
VIEW FEEDBACK
============================== */

router.put(
"/admin/feedback/:id",
protect,
adminOnly,
async (req, res) => {
  try {

    const { reply } = req.body;

    if (!reply) {
      return res.status(400).json({ error: "Reply is required" });
    }

    const updated = await Feedback.findByIdAndUpdate(
      req.params.id,
      {
        reply: reply,           // ✅ FIXED
        status: "replied"       // ✅ FIXED
      },
      { new: true }
    );

    res.json({
      message: "Reply sent successfully",
      updated
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put(
  "/admin/assign-village",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const { userId, villageId } = req.body;

      // check user
      const user = await User.findById(userId);

      if (!user || user.role !== "villagehead") {
        return res.status(400).json({ message: "User is not a villagehead" });
      }

      // ❗ ensure village exists
      const village = await Village.findById(villageId);
      if (!village) {
        return res.status(404).json({ message: "Village not found" });
      }

      // ❗ ensure village not already assigned
      const alreadyAssigned = await User.findOne({ village: villageId });

      if (alreadyAssigned) {
        return res.status(400).json({
          message: "This village already has a villagehead"
        });
      }

      // 🔥 ASSIGN
      user.village = villageId;
      await user.save();

      res.json({
        message: "Village assigned successfully",
        user
      });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

export default router 