import express from "express";
import {
  createFooter,
  updateFooter,
  getFooter,
  getFooterById,
  deleteFooter,
} from "../../controllers/site-settings/footerController.js";

const router = express.Router();

router.post("/", createFooter);
router.patch("/:id", updateFooter);
router.get("/", getFooter);
router.get("/:id", getFooterById);
router.delete("/:id", deleteFooter);

export default router;