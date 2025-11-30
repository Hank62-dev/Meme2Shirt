import express from "express";
import { getProductById } from "../controllers/productController.js";

const router = express.Router();

// Route: GET /api/product/:id
// Ví dụ gọi: http://localhost:3000/api/product/TSHIRT01
router.get("/product/:id", getProductById);

export default router;
