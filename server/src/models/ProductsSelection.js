import mongoose from "mongoose";

const productSelectionSchema = new mongoose.Schema({
  idProduct: { type: String },
  imageURL: { type: String },
  nameProduct: { type: String },
  isDesign: { type: Boolean, default: false },
  printSide: { type: String, default: "" },
  color: { type: String },
  newPrice: { type: Number },
  quantities: { type: Number },
});

export default mongoose.model(
  "ProductsSelection",
  productSelectionSchema,
  "productSeleciton"
);
