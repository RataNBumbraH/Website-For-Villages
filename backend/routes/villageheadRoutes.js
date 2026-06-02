import express from "express"
import CampRequest from "../model/CampRequest.js"
import Feedback from "../model/Feedback.js"
import protect from "../middleware/authmiddleware.js"
import villageHeadOnly from "../middleware/villageheadMiddleware.js"
import User from "../model/User.js"
import Camp from "../model/Camp.js"

const router = express.Router()

router.get("/villagehead/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("village", "name");

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* SEND CAMP REQUEST */

router.post(
  "/villagehead/camp-request",
  protect,
  villageHeadOnly,
  async (req, res) => {
    try {

      if (!req.user.village) {
        return res.status(400).json({ message: "Village not assigned" });
      }

      const { title, description, date } = req.body;

      if (!title || !description || !date) {
        return res.status(400).json({ message: "All fields required" });
      }

      const today = new Date();
      const selectedDate = new Date(date);

      today.setHours(0,0,0,0);
      selectedDate.setHours(0,0,0,0)

      if(selectedDate < today){
        return res.status(400).json({
          message: "Camp date must be today or future"
        })
      }

      const request = new CampRequest({
        village: req.user.village, // 🔥 NOW WORKS CORRECTLY
        villagehead: req.user._id,
        title,
        description,
        date
      });

      await request.save();

      res.json({ message: "Camp request sent", request });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.get(
  "/villagehead/camps",
  protect,
  villageHeadOnly,
  async (req, res) => {
    try {

      if (!req.user || !req.user.village) {
        return res.status(400).json({ message: "Village not found in user" });
      }

      const camps = await Camp.find({
        village: req.user.village
      });

      res.json(camps);

    } catch (err) {
      console.error("Camps Error:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

/* SEND FEEDBACK */

router.post("/villagehead/feedback", protect, async (req, res) => {
  try {

    const { message, campId } = req.body;

    if (!message || !campId) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const feedback = new Feedback({
      villagehead: req.user.id,
      village: req.user.village,   // ✅ FIXED HERE
      camp: campId,
      message
    });

    await feedback.save();

    res.json({
      message: "Feedback sent successfully",
      feedback
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/villagehead/my-feedback", protect, async (req, res) => {
  const feedback = await Feedback.find({
    villagehead: req.user.id
  })
    .populate("camp", "title")
    .sort({ createdAt: -1 });

  res.json(feedback);
});

/* VIEW MY REQUESTS */

router.get("/villagehead/my-request", protect, async (req, res) => {
  const requests = await CampRequest.find({
    status: "pending",
  }).populate("village", "name");

  res.json(requests);
});

export default router