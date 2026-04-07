import express from "express";
import {
    createReview,
    updateReview,
    getReviews,
    getReviewById,
    deleteReview,
} from "../../controllers/reviews/reviewController.js";

const router = express.Router();

router.post("/", createReview);
router.patch("/:id", updateReview);
router.get("/", getReviews);
router.get("/:id", getReviewById);
router.delete("/:id", deleteReview);

export default router;