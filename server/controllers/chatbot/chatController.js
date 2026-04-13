import { chatBot } from "../../lib/chatBot.js";
import Chat from "../../models/chatbot/chatModel.js";

// ================= CREATE CHAT =================

export const createChat = async (req, res) => {
  try {
    const { sessionId, message, userId } = req.body;

    // ✅ Validation
    if (!sessionId || !message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Session ID and message are required",
      });
    }

    // ✅ Find or create chat
    let chat = await Chat.findOne({ sessionId });

    if (!chat) {
      chat = new Chat({
        sessionId,
        userId: userId || null, // optional safety
        messages: [],
      });
    }

    // add user message first
    chat.messages.push({
      role: "user",
      content: message,
    });

    // ✅ send full conversation to AI
    const aiResponse = await chatBot(chat.messages);

    // add assistant message
    chat.messages.push({
      role: "assistant",
      content: aiResponse,
    });

    // ✅ update metadata
    chat.messageCount += 2;
    chat.lastMessageAt = new Date();

    if (chat.messages.length > 100) {
      chat.messages = chat.messages.slice(-100);
    }

    await chat.save();

    // ✅ send response

    return res.status(200).json({
      success: true,
      response: aiResponse,
      totalMessages: chat.messages.length,
    });
  } catch (error) {
    console.error("CHAT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ================= UPDATE CHAT =================
export const updateChat = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Chat.findByIdAndUpdate(
      id,
      {
        ...req.body,
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      data: updated,
      message: "Hero updated ✅",
    });
  } catch (error) {
    console.error("UPDATE HERO ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET ALL =================
// GET /api/chat/:sessionId
export const getChats = async (req, res) => {
  const chat = await Chat.findOne({
    sessionId: req.params.sessionId,
  });

  res.json(chat || { messages: [] });
};

// ================= GET ONE =================
export const getChatById = async (req, res) => {
  try {
    const data = await Chat.findById(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= DELETE =================
export const deleteChat = async (req, res) => {
  try {
    await Chat.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Chat deleted 🗑️",
    });
  } catch (error) {
    console.error("DELETE CHAT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};