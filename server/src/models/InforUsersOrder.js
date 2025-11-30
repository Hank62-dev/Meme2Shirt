import mongoose from "mongoose";
import { describe } from "node:test";

const inforUsersOrder = new mongoose.Schema({
  name: { type: String },
  phone: { type: String },
  email: { type: String },
  province: { type: String },
  ward: { type: String },
  address: { type: String },
});

export default mongoose.model(
  "InforUsersOrder",
  inforUsersOrder,
  "inforUsersOrders"
);
