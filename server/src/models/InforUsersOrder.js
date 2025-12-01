import mongoose from "mongoose";
import { describe } from "node:test";

const inforUsersOrder = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  province: { type: String, required: true },
  ward: { type: String, required: true },
  address: { type: String, required: true },
  note: { type: String },
});

export default mongoose.model(
  "InforUsersOrder",
  inforUsersOrder,
  "inforUsersOrders"
);
