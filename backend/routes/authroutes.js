import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../model/User.js';
import protect from '../middleware/authmiddleware.js';
import Village from '../model/Village.js';
const router = express.Router();

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
router.post("/auth/login", async (req, res) => {
    const { contactno, password, otp } = req.body;
    try {
        const user = await User.findOne({ contactno });
        if (!user) { 
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const matched = await bcrypt.compare(password, user.password);
        if (!matched){
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // ✅ 2nd STEP: JE OTP AAYA HAI TA VERIFY KARO
        if (otp) {
            if (!user.loginOtp || user.loginOtp !== otp || user.otpExpire < Date.now()) {
                return res.status(400).json({ message: "Invalid or Expired OTP" });
            }
            
            // Login successful hon ton baad OTP clear kar do
            user.loginOtp = undefined;
            user.otpExpire = undefined;
            await user.save();

            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: "7days" }
            );

            res.cookie("token", token, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            return res.json({
                token,
                userId: user._id,
                username: user.username,
                role: user.role
            });
        }

        // ✅ 1st STEP: PASSWORD MATCH HOGYA, HUN OTP GENERATE KARO
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
        user.loginOtp = generatedOtp;
        user.otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
        await user.save();

        // 📱 FAST2SMS API TO SEND REAL SMS TO PHONE NUMBER
        try {
            const smsResponse = await fetch("https://www.fast2sms.com/dev/bulkV2", {
                method: "POST",
                headers: {
                    "authorization": "OcmEPIbrTuDo6g9XNzkUJGhqBvAV4iFdZYQwL07153jWsaRtxyFTtCBugJAypj4lQWwLox5eZ0I278ki", 
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    route: "otp",
                    variables_values: generatedOtp,
                    numbers: contactno.toString() 
                })
            });

            const smsData = await smsResponse.json();
            console.log("Fast2SMS Response:", smsData);

            if (!smsData.return) {
                return res.status(500).json({ message: "Failed to send SMS. Check API Key or balance." });
            }

        } catch (smsErr) {
            console.log("SMS Error:", smsErr);
            return res.status(500).json({ message: "Error in sending SMS gateway" });
        }

        res.json({ 
            requiresOtp: true, 
            message: "OTP sent successfully to your mobile number!" 
        });

    } catch(error){
        res.status(500).json({ error: error.message });
    }
});

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