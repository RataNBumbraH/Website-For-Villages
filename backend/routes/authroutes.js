import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../model/User.js';
import protect from '../middleware/authmiddleware.js';
import Village from '../model/Village.js';
const router = express.Router();

// router.get("/test",(req,res)=>{
// res.json({message:"Auth route working"})
// })

//Signup
router.post("/auth/signup", async (req, res) => {
    const {username,contactno,age,address,qualification,password} = req.body;
    try{
        const userexists = await User.findOne({contactno})
        if(userexists){
            return res.status(400).json({ message : "User already exists"})
        }
        if(password.length < 6){
            return res.status(400).json({message:"Password must be at least 6 characters"}) 
        }
        const hashedpass =  await bcrypt.hash(password,12)
        const newuser = await User.create(
            {
                username,
                contactno,
                age, 
                address,
                qualification,
                password:hashedpass
            }
        )
        res.status(201).json({message : "User Registered"})
    }
    catch(error){
        res.status(500).json({error : error.message})
    }
});

//Login 
router.post("/auth/login",async(req,res)=>{
    const {contactno,password} = req.body;
    try{
        const user = await User.findOne({contactno})
        if(!user){ 
            return res.status(400).json({message : "Invalid Credentials"})
    }
        const matched = await bcrypt.compare(password, user.password)
        if(!matched){
            return res.status(400).json({message : "Invalid Credentials"})
        }
        const token = jwt.sign(
            {id : user._id},
            process.env.JWT_SECRET,
            {expiresIn : "7days"}
        )
        res.cookie("token",token,{
            httpOnly : true,
            sameSite : "strict",
            maxAge : 7 * 24 * 60 * 60 * 1000
        });
        res.json({
            token,
            userId : user._id,
            username : user.username,
            role: user.role
        })
    }
    catch(error){
        res.status(500).json({error : error.message})
    }
})

router.get("/villages", async(req,res)=>{

try{

const villages = await Village.find()

res.json(villages)

}catch(err){

res.status(500).json({error:err.message})

}

})

/* ===================================
GET SINGLE VILLAGE DETAILS
=================================== */

router.get("/village/:id", protect, async (req,res)=>{

try{

const village = await Village.findById(req.params.id)

if(!village){
return res.status(404).json({message:"Village not found"})
}

res.json(village)

}
catch(err){

res.status(500).json({error:err.message})

}

})

export default router;