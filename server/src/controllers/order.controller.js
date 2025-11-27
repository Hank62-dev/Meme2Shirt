// xem tổng số tièn trước khi thanh toán
// lên đơn hàng
// thanh toán
// API với sọp pe
import express from "express";
import User from "../models/User";
import Product from "../models/Product";
import Order from "../models/Order";
// 1 tính tổng số tiền
const calculateTotal = (items) => {
  let total = items.reduce((sum, item) => {
    // lấy từng mục gồm só tiền từng món vs số lượng từng món, r giảm cho tới khi giỏ rỗng
    const itemPrice = item.product.price || 0;
    // itemPrice là giá từng sản phẩm,z nên lấy giá từng cái nhân cho số lượng
    return sum + itemPrice * item.quantity;
  }, 0);
  return total;
  //   sau khi giỏ rỗng tức là tính xong tổng tiền
};
// tính discount
const calculateDiscount = (items) => {
  let quantities = items.quantity;
  let discount = 0;
  if (quantities > 10) {
    discount = 0.1;
  } else if (quantities >= 20) {
    discount = 0.2;
  } else if (quantities >= 30) {
    discount = 0.4;
  }
  return discount;
};
// 2 hiện đơn hàng trước khi nôn tiền
const displaycFinalBill = async (req, res) => {
  try {
    const userID = req.user.id;
    const cart = await User.findCartById(userID);
    if (!cart) {
      // nếu rỗng thì báo
      return res.status(200).json({ cart: [], total: 0 });
    }
    const cartItems = cart.items;
    const subTotal = calculateTotal(cartItems);

    const shipFee = 2000; //cho đại tới đó tính
    const discount = calculateDiscount(cartItems);
    const finalTotal = subTotal * (1 - discount) + shipFee;
    res.status(200).json({
      items: cartItems,
      subTotal: subTotal,
      shipFee: shipFee,
      discount: discount,
      finalTotal: finalTotal,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: " ERROR!!!" });
  }
};
