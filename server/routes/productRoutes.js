import express from "express";
import {
  saveProduct,
  updateProduct,
  getProducts,
  getProductById,
  deleteProduct,
  trandingProduct
} from "../controllers/productController.js";

const router = express.Router();

router.post("/", saveProduct);
router.get("/trainding", trandingProduct)
router.put("/:id", updateProduct);

router.get("/", getProducts);
router.get("/:id", getProductById);
router.delete("/:id", deleteProduct);

export default router;
