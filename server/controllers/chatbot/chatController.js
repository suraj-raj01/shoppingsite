import { chatBot } from "../../lib/chatBot.js";
import Chat from "../../models/chatbot/chatModel.js";

// ================= CREATE CHAT =================
export const createChat = async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    // ✅ validation
    if (!sessionId || !message) {
      return res.status(400).json({
        success: false,
        message: "sessionId and message required",
      });
    }

    // ✅ find chat using sessionId
    let chat = await Chat.findOne({ sessionId });

    if (!chat) {
      chat = await Chat.create({
        sessionId,
        messages: [],
      });
    }

    // ✅ add user message
    chat.messages.push({
      role: "user",
      content: message,
    });

    // ✅ limit history (important)
    if (chat.messages.length > 20) {
      chat.messages = chat.messages.slice(-20);
    }

    // ✅ AI response
    const aiResponse = await chatBot(chat.messages);
    console.log("AI Response:", aiResponse);

    // ✅ add AI reply
    chat.messages.push({
      role: "assistant",
      content: aiResponse,
    });

    await chat.save();

    res.status(200).json({
      success: true,
      response: aiResponse,
      chat,
    });

  } catch (error) {
    console.error("CHAT ERROR:", error);
    res.status(500).json({
      success: false,
      error: error.message,
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
export const getChats = async (req, res) => {
  try {
    const data = await Chat.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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