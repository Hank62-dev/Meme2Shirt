import express from "express";
const cart_router = express.Router();
import * as cart_controller from "../controllers/cart.controller";
//1. Lấy thông tin giỏ hàng
cart_router.get("/", cart_controller.getCart);
//2.Thêm sản phẩm vào giỏ hàng
cart_router.post("/add", cart_controller.addItemToCart);
//3.Cập nhật số lượng sản phẩm giỏ hàng
cart_router.put("/update", cart_controller.updateItem);
// 4.Xóa 1 sản phẩm khỏi giỏ hàng
cart_router.delete("/delete", cart_controller.removeItem);
export default cart_router;
