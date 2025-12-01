import express from "express";
const order_routes = express.Router();
import * as order_controller from "../controllers/order.controller.js";
//1. Thông tin  thị đơn hàng
order_routes.get("/", order_controller.displayFinalBill);
//2.Xuất đơn
order_routes.post("/add", order_controller.placeOrder);

export default cart_router;
