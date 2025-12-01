import express from "express";
import {
  getAllProducts,
  getProductById,
} from "../controllers/home.controller.js";

const router = express.Router();

// Route lấy danh sách (Frontend đang gọi cái này)
// http://localhost:3000/api/products
router.get("/products", getAllProducts);

// Route lấy chi tiết
// http://localhost:3000/api/product/TSHIRT-01
router.get("/product/:id", getProductById);

export default router;
