import express from "express";
import { createSelection } from "../controllers/optionDesign.controller.js";

const router = express.Router();

// Định nghĩa route POST để lưu thông tin selection
// URL sẽ là: http://localhost:3000/api/selection
router.post("/selection", createSelection);

export default router;
