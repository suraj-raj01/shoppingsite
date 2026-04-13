import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EnquiryUser",
      default: null, // ✅ not required now
    },

    sessionId: {
      type: String,
      required: true,
      unique: true, // ✅ ensures one chat per session
      index: true,
    },

    messages: [messageSchema],

    // ✅ metadata
    messageCount: {
      type: Number,
      default: 0,
    },

    lastMessageAt: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);