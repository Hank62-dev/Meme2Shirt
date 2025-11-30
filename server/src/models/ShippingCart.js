import mongoose from "mongoose";

const shippingCartSchema = new mongoose.Schema({
  idCart: { type: String },
  imageURL: { type: String },
  nameProduct: { type: String },
  isDesign: { type: Boolean, default: false },
  printSide: { type: String, default: "" },
  size: { type: String },
  color: { type: String },
  newPrice: { type: Number },
  quantities: { type: Number },
});

export default mongoose.model(
  "ShippingCart",
  shippingCartSchema,
  "shippingCart"
);
