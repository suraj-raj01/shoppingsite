import express from "express";
import { createChat, deleteChat, getChatById, getChats, updateChat } from "../../controllers/chatbot/chatController.js";

const router = express.Router();

router.post("/", createChat);
router.get("/", getChats);
router.delete("/:id", deleteChat);
router.patch("/:id", updateChat);
router.get("/:id", getChatById);

export default router;