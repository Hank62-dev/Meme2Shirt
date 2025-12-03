import mongoose from "mongoose";

const shippingCartSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Các thông tin sản phẩm
    idCart: { type: String, required: true }, // ID sản phẩm gốc
    imageURL: { type: String },
    nameProduct: { type: String },
    isDesign: { type: Boolean, default: false },
    printSide: { type: String, default: "" },
    size: { type: String },
    color: { type: String },
    newPrice: { type: Number, required: true },
    quantities: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);
export default mongoose.model(
  "ShippingCart",
  shippingCartSchema,
  "shippingCart"
);
