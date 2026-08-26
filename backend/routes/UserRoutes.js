import express from "express";
import User from "../model/User.js";
import protect from "../middleware/authmiddleware.js";

const router = express.Router();

// 👤 1. Get Logged-in User Profile
router.get("/user/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("village", "name");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📸 2. Update User Profile Picture (Upload or Remove)
router.put("/user/update-pic", protect, async (req, res) => {
  try {
    const { profilePic } = req.body; // Base64 string or ""

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { profilePic },
      { new: true }
    ).populate("village", "name");

    res.json({ message: "Profile picture updated successfully!", user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✏️ Update User Profile (Details + Profile Pic)
router.put("/user/update-profile", protect, async (req, res) => {
  try {
    const { username, contactno, address, qualification, age, profilePic } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        username,
        contactno,
        address,
        qualification,
        age,
        ...(profilePic !== undefined && { profilePic }) // Update pic only if provided
      },
      { new: true, runValidators: true }
    ).populate("village", "name");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated successfully!", user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;