// findByID
import mongoose from "mongoose";

const productsDefaultScheme = new mongoose.Schema({
  idProduct: { type: String, required: true, unique: true },
  imageURL: { type: String },
  nameProduct: { type: String },
  color: { type: String },
  oldPrice: { type: Number },
  newPrice: { type: Number },
});

export default mongoose.model(
  "ProductsDefault",
  productsDefaultScheme,
  "productDefault"
);
