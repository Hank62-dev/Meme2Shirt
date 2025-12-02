import mongoose from "mongoose";

const orderListSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 2. Thông tin giao hàng & Thanh toán
    shipAddress: { type: String, required: true },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["COD", "BANK_TRANSFER"],
    },
    status: { type: String, default: "Pending" }, // Pending, Processing, Shipped...

    // 3. Danh sách sản phẩm được chọn để mua(từ shippingCart qua OrderList )
    items: [
      {
        idCart: { type: String }, // ID gốc của sản phẩm
        imageURL: String,
        nameProduct: String,
        isDesign: Boolean,
        printSide: String,
        size: String,
        color: String,
        newPrice: Number,
        quantities: Number,
      },
    ],

    // 4. Thông tin giá cả
    subTotal: { type: Number, required: true }, // Tổng tiền hàng
    shippingFee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    finalTotal: { type: Number, required: true }, // Tổng thanh toán cuối cùng
  },
  { timestamps: true }
);

export default mongoose.model("OrderList", orderListSchema, "orderList");
