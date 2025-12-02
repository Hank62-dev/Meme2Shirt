import ShippingCart from "../models/ShippingCart";
// Xuất lỗi
const logError = (error, context = "Cart Controller") => {
  console.error(`[${context}] Error:`, error.message);
};
// Hàm tính tổng
const calculateTotal = (items) => {
  if (!items || items.length === 0) return 0;
  return items.reduce((sum, item) => {
    return sum + item.newPrice * item.quantities;
  }, 0);
};
// 1. Lấy giỏ hàng của User đang đăng nhập
export const getCart = async (req, res) => {
  const userID = req.user.id; // Lấy ID để dô đc giỏ hàng của người đó
  console.log(`[GET CART] Fetching for User: ${userID}`);

  try {
    const cartItems = await ShippingCart.find({ owner: userID });
    const totalAmount = calculateTotal(cartItems);

    return res.status(200).json({
      items: cartItems,
      total: totalAmount,
      message: cartItems.length === 0 ? "Nothing in cart." : "Your cart.",
    });
  } catch (error) {
    logError(error, "GET CART");
    return res.status(500).json({ message: "ERROR!!!." });
  }
};
// 2. Thêm sản phẩm vào giỏ hàng
export const addItemToCart = async (req, res) => {
  const userID = req.user.id;
  const {
    idCart,
    imageURL,
    nameProduct,
    isDesign,
    printSide,
    size,
    color,
    newPrice,
    quantities,
  } = req.body;

  try {
    if (!idCart || !quantities || Number(quantities) <= 0) {
      return res.status(400).json({ message: "ERROR!!." });
    }

    // Tìm đã có sản phẩm y hệt trong giỏ chưa
    const existingItem = await ShippingCart.findOne({
      owner: userID, // Của user này
      idCart: idCart, // Cùng ID sản phẩm
      size: size, // Cùng size
      color: color, // Cùng màu
      printSide: printSide, // Cùng mặt in
    });

    if (existingItem) {
      // Nếu có rồi thì cộng dồn số lượng
      console.log(`[ADD ITEM] Item exists. Updating quantity...`);
      existingItem.quantities += Number(quantities);
      await existingItem.save();
      return res
        .status(200)
        .json({ message: "Update success!", item: existingItem });
    } else {
      // Nếu chưa có -> Tạo mới
      console.log(`[ADD ITEM] Creating new item...`);
      const newItem = new ShippingCart({
        owner: userID, // Quan trọng: Gắn chủ sở hữu
        idCart,
        imageURL,
        nameProduct,
        isDesign,
        printSide,
        size,
        color,
        newPrice: Number(newPrice),
        quantities: Number(quantities),
      });
      await newItem.save();
      return res.status(201).json({ message: "Added to cart", item: newItem });
    }
  } catch (error) {
    logError(error, "ADD ITEM");
    return res.status(500).json({ message: "ERROR!!!." });
  }
};
// 3. Cập nhật số lượng item
export const updateItem = async (req, res) => {
  const userID = req.user.id;
  // Cần đầy đủ thông tin để tìm đúng item cần sửa
  const { idCart, size, color, printSide, quantities } = req.body;

  try {
    if (Number(quantities) <= 0) {
      return res.status(400).json({ message: "Số lượng phải lớn hơn 0." });
    }

    // Tìm và cập nhật
    const updatedItem = await ShippingCart.findOneAndUpdate(
      {
        owner: userID,
        idCart,
        size,
        color,
        printSide, // Điều kiện tìm kiếm
      },
      { $set: { quantities: Number(quantities) } }, // Dữ liệu update
      { new: true } // Trả về data mới sau khi update
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Don't find anything in cart" });
    }

    return res.status(200).json({ message: "UPDATED", item: updatedItem });
  } catch (error) {
    logError(error, "UPDATE ITEM");
    return res.status(500).json({ message: "ERROR!!" });
  }
};
// 4.Xóa sản phẩm khỏi giỏ
export const removeItem = async (req, res) => {
  const userID = req.user.id;
  const { idCart, size, color, printSide } = req.body;

  try {
    const result = await ShippingCart.deleteOne({
      owner: userID,
      idCart,
      size,
      color,
      printSide,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Don't find anything in cart" });
    }

    return res.status(200).json({ message: "Deleted" });
  } catch (error) {
    logError(error, "REMOVE ITEM");
    return res.status(500).json({ message: "ERROR!!!" });
  }
};
