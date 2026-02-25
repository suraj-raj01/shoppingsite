import express from "express";
import { uploadImage, uploadMultipleImages } from "../controllers/uploadImage/uploadImage.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post("/single", upload.single("image"), uploadImage);
router.post("/multiple", upload.array("images", 10), uploadMultipleImages);

export default router;