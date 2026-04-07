import express from "express";
import {
    createReturn,
    updateReturn,
    getReturns,
    getReturnById,
    deleteReturn,
} from "../../controllers/returns/returnsController.js";

const router = express.Router();

router.post("/", createReturn);
router.patch("/:id", updateReturn);
router.get("/", getReturns);
router.get("/:id", getReturnById);
router.delete("/:id", deleteReturn);

export default router;