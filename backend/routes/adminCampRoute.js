import express from "express"
import CampRequest from "../model/CampRequest.js"
import protect from "../middleware/authmiddleware.js"
import adminOnly from "../middleware/adminMiddleware.js"
import Camp from "../model/Camp.js"
import Feedback from "../model/Feedback.js"
import upload from "../middleware/uploadMiddleware.js"

const router = express.Router()

router.get("/admin/camps", protect, adminOnly, async (req, res) => {
  try {
    const camps = await Camp.find()
      .populate("village", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(camps);

  } catch (err) {
    res.status(500).json({
      message: "Error fetching camps",
      error: err.message
    });
  }
});


// ================= UPDATE CAMP (WITH IMAGES) =================
router.put(
  "/admin/camp/:id",
  protect,
  adminOnly,
  upload.array("images", 10), // max 10 images
  async (req, res) => {
    try {
      const camp = await Camp.findById(req.params.id);

      if (!camp) {
        return res.status(404).json({ message: "Camp not found" });
      }

      // TEXT UPDATE
      camp.title = req.body.title || camp.title;
      camp.description = req.body.description || camp.description;
      camp.date = req.body.date || camp.date;

      // IMAGES UPDATE
      if (req.files && req.files.length > 0) {
        const newImages = req.files.map(file => file.filename);

        // replace old images (clean approach)
        camp.images = newImages;
      }

      const updatedCamp = await camp.save();

      res.status(200).json({
        message: "Camp updated successfully",
        camp: updatedCamp
      });

    } catch (err) {
      res.status(500).json({
        message: "Error updating camp",
        error: err.message
      });
    }
  }
);


// ================= DELETE CAMP =================
router.delete("/admin/camp/:id", protect, adminOnly, async (req, res) => {
  try {
    const camp = await Camp.findById(req.params.id);

    if (!camp) {
      return res.status(404).json({ message: "Camp not found" });
    }

    await Camp.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Camp deleted successfully"
    });

  } catch (err) {
    res.status(500).json({
      message: "Error deleting camp",
      error: err.message
    });
  }
});

/* GET ALL REQUESTS */

router.get(
  "/admin/camp-request",
  protect,
  adminOnly,
  async (req, res) => {
    try {

      // ✅ ONLY PENDING REQUESTS
      const request = await CampRequest.find({ status: "pending" })
        .populate("village", "name")
        .populate("villagehead", "username");

      res.json(request);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* APPROVE REQUEST */

router.put(
  "/admin/camp-request/:id/approve",
  protect,
  adminOnly,
  async (req, res) => {
    try {

      const request = await CampRequest.findById(req.params.id);

      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }

      // ✅ Create camp
      const camp = new Camp({
        title: request.title,
        description: request.description,
        village: request.village,
        date: request.date,
        images: []
      });

      await camp.save();

      // ✅ UPDATE STATUS (DON'T DELETE)
      request.status = "approved";
      request.adminReply = "Your request has been approved";
      await request.save();

      res.json({
        message: "Camp approved successfully",
        camp
      });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* REJECT REQUEST */

router.put(
  "/admin/camp-request/:id/reject",
  protect,
  adminOnly,
  async (req, res) => {
    try {

      const request = await CampRequest.findById(req.params.id);

      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }

      // ✅ UPDATE STATUS (DON'T DELETE)
      request.status = "rejected";
      request.adminReply = req.body.reason || "Request rejected";
      await request.save();

      res.json({ message: "Request rejected successfully" });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.get(
  "/admin/all-camp-requests",
  protect,
  adminOnly,
  async (req, res) => {
    try {

      const requests = await CampRequest.find()
        .populate("village", "name")
        .populate("villagehead", "username")
        .sort({ createdAt: -1 });

      res.json(requests);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// =======================
// 👑 ADMIN: GET FEEDBACK
// =======================
router.get("/admin/feedback", protect, adminOnly, async (req, res) => {
  try {
    const feedback = await Feedback.find({status:"pending"})
      .populate("village", "name")
      .populate("villagehead", "username")
      .populate("camp", "title")
      .sort({ createdAt: -1 });

    res.json(feedback);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =======================
// 👑 ADMIN: REPLY FEEDBACK
// =======================
router.put("/admin/feedback/:id", protect, adminOnly, async (req, res) => {
  try {
    const { reply } = req.body;

    const updated = await Feedback.findByIdAndUpdate(
      req.params.id,
      {
        reply,
        status: "replied"
      },
      { new: true }
    );

    res.json({ message: "Reply sent", updated });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/admin/feedback/replied", protect, adminOnly, async (req, res) => {
  try {
    const feedback = await Feedback.find({ status: "replied" })
      .populate("village", "name")
      .populate("villagehead", "username")
      .populate("camp", "title")
      .sort({ createdAt: -1 });

    res.json(feedback);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router