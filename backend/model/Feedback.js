import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    villagehead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    village: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Village",
      required: true
    },

    camp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Camp"
    },

    message: {
      type: String,
      required: true
    },

    reply: {
      type: String,
      default: ""
    },

    status: {
      type: String,
      enum: ["pending", "seen", "replied"],
      default: "pending"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);