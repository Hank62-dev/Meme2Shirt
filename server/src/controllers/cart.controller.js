import ShippingCart from "../models/ShippingCart";
const logError = (error, context = "Cart Controller") => {
  console.error(`[${context}] Error:`, error.message);
};
// 1. GET CART (Lấy toàn bộ giỏ hàng của User)
export const getCart = async (req, res) => {
  const userID = req.user.id;
  console.log(`[GET CART] User: ${userID}`);

  try {
    // Tìm tất cả sản phẩm thuộc về User này
    const cartItems = await ShippingCart.find({ owner: userID });

    // Trả về danh sách (dù rỗng cũng trả về 200 OK để Frontend xử lý)
    return res.status(200).json({
      items: cartItems || [],
      message:
        cartItems.length === 0
          ? "Cart is empty."
          : "Cart retrieved successfully.",
    });
  } catch (error) {
    logError(error, "GET CART");
    return res
      .status(500)
      .json({ message: "Server error while retrieving cart." });
  }
};

// 2. ADD ITEM (Thêm sản phẩm vào giỏ)
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
    // Validate dữ liệu đầu vào
    if (!idCart || !quantities || Number(quantities) <= 0) {
      return res.status(400).json({ message: "Invalid product data." });
    }

    // Tìm xem sản phẩm này (với cùng size, màu, mặt in) đã có trong giỏ chưa
    const existingItem = await ShippingCart.findOne({
      owner: userID,
      idCart: idCart,
      size: size,
      color: color,
      printSide: printSide,
    });

    if (existingItem) {
      // Nếu đã có thì cập nhật số lượng
      console.log(`[ADD ITEM] Item exists. Updating quantity...`);
      existingItem.quantities += Number(quantities);
      await existingItem.save();

      return res
        .status(200)
        .json({ message: "Item quantity updated", item: existingItem });
    } else {
      // Nếu chưa có thì tạo mới
      console.log(`[ADD ITEM] Creating new item...`);
      const newItem = new ShippingCart({
        owner: userID, // Gắn ID người dùng vào item
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
      return res
        .status(201)
        .json({ message: "Item added to cart", item: newItem });
    }
  } catch (error) {
    logError(error, "ADD ITEM");
    return res.status(500).json({ message: "Server error while adding item." });
  }
};
// 3. UPDATE ITEM (Cập nhật số lượng)
export const updateItem = async (req, res) => {
  const userID = req.user.id;
  // Cần đủ thông tin để định danh sản phẩm cần sửa
  const { idCart, size, color, printSide, quantities } = req.body;

  try {
    if (!idCart || Number(quantities) <= 0) {
      return res.status(400).json({ message: "Invalid quantity." });
    }

    // Tìm và cập nhật số lượng
    const updatedItem = await ShippingCart.findOneAndUpdate(
      {
        owner: userID,
        idCart,
        size,
        color,
        printSide, // Điều kiện tìm kiếm
      },
      { $set: { quantities: Number(quantities) } }, // Dữ liệu cập nhật
      { new: true } // Trả về document mới sau khi update
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found in cart." });
    }

    return res
      .status(200)
      .json({ message: "Item updated successfully", item: updatedItem });
  } catch (error) {
    logError(error, "UPDATE ITEM");
    return res
      .status(500)
      .json({ message: "Server error while updating item." });
  }
};

// 4. REMOVE ITEM (Xóa sản phẩm)
export const removeItem = async (req, res) => {
  const userID = req.user.id;
  const { idCart, size, color, printSide } = req.body;

  try {
    // Tìm và xóa item khớp với các tiêu chí
    const deleteResult = await ShippingCart.deleteOne({
      owner: userID,
      idCart,
      size,
      color,
      printSide,
    });

    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ message: "Item not found to delete." });
    }

    return res.status(200).json({ message: "Item removed successfully." });
  } catch (error) {
    logError(error, "REMOVE ITEM");
    return res
      .status(500)
      .json({ message: "Server error while removing item." });
  }
};
