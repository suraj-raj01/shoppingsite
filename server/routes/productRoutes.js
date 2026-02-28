import express from "express";
import {
  saveProduct,
  updateProduct,
  getProducts,
  getProductById,
  deleteProduct,
  trandingProduct,
  searchProducts
} from "../controllers/productController.js";

const router = express.Router();

router.post("/", saveProduct);
router.get("/trainding", trandingProduct)
router.put("/:id", updateProduct);

router.get("/", getProducts);
router.get("/:id", getProductById);
router.get("/search/:query", searchProducts);
router.delete("/:id", deleteProduct);

export default router;
