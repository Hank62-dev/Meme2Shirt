import mongoose from "mongoose";

const productSelectionSchema = new mongoose.Schema(
  {
    idProduct: { type: String },
    imageURL: { type: String },
    nameProduct: { type: String },
    isDesign: { type: Boolean, default: true },
    printSide: { type: String, default: "" },
    color: { type: String },
    newPrice: { type: Number },
    quantities: { type: Number },
  },
  {
    versionKey: false,
  }
);

const ProductSelection = mongoose.model(
  "ProductsSelection",
  productSelectionSchema,
  "productSelection"
);

export default ProductSelection;
