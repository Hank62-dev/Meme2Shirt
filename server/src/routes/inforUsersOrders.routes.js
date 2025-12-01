import express from "express";
import { creatOrderInfor } from "../controllers/inforUsersOrders.controller.js";

const router = express.Router();

// POST: api/orders
router.post("/orders", creatOrderInfor);

export default router;
