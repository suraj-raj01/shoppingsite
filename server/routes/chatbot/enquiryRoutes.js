import express from "express";
import { createEnquiry, deleteEnquiry, getEnquiryById, getEnquirys, updateEnquiry } from "../../controllers/chatbot/enquiryController.js";

const router = express.Router();

router.post("/", createEnquiry);
router.get("/", getEnquirys);
router.delete("/:id", deleteEnquiry);
router.patch("/:id", updateEnquiry);
router.get("/:id", getEnquiryById);

export default router;