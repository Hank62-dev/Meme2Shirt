// Import Model để tương tác với DB
import Product from "../models/Product";
import Order from "../models/Order";
import User from "../models/User";

// ----------------------------------------------------
// 1. [GET] Lấy thông tin Giỏ hàng của Người dùng
// ----------------------------------------------------
export const getCart = async (req, res) => {
  try {
    // Lấy User ID từ token xác thực (req.user.id được thêm vào bởi Middleware)
    const userId = req.user.id;

    // Tìm giỏ hàng của người dùng, điền thông tin chi tiết của sản phẩm (populate)
    const cart = await User.findOne({ user: userId }).populate(
      "items.product",
      "name price imageURL"
    ); // Lấy chi tiết sản phẩm

    if (!cart) {
      // Nếu chưa có giỏ hàng, trả về một giỏ hàng trống
      return res.status(200).json({ items: [], totalAmount: 0 });
    }

    res.status(200).json(cart);
  } catch (error) {
    logError(error);
    res.status(500).json({ message: "Lỗi server khi lấy giỏ hàng." });
  }
};

// ----------------------------------------------------
// 2. [POST] Thêm sản phẩm (hoặc tùy chỉnh áo meme) vào Giỏ hàng
// ----------------------------------------------------
export const addItemToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity, customizationDetails } = req.body; // customizationDetails chứa link ảnh meme đã ghép mặt

    // 1. Kiểm tra sản phẩm có tồn tại không
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại." });
    }

    // 2. Tìm hoặc tạo Giỏ hàng mới cho người dùng
    let cart = await User.findOne({ user: userId });
    if (!cart) {
      cart = await User.create({ user: userId, items: [] });
    }

    // 3. Kiểm tra sản phẩm đã có trong giỏ hàng chưa
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // Nếu đã có: Cập nhật số lượng
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Nếu chưa có: Thêm mục mới vào giỏ hàng
      cart.items.push({
        product: productId,
        quantity: quantity,
        customization: customizationDetails,
      });
    }

    await cart.save();
    res
      .status(200)
      .json({ message: "Sản phẩm đã được thêm vào giỏ hàng.", cart });
  } catch (error) {
    logError(error);
    res.status(500).json({ message: "Lỗi server khi thêm sản phẩm." });
  }
};

// ----------------------------------------------------
// 3. [PUT] Cập nhật số lượng sản phẩm trong Giỏ hàng
// ----------------------------------------------------
export const updateItemQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    const cart = await User.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại." });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // Cập nhật số lượng
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      return res
        .status(200)
        .json({ message: "Cập nhật số lượng thành công.", cart });
    } else {
      return res
        .status(404)
        .json({ message: "Sản phẩm không có trong giỏ hàng." });
    }
  } catch (error) {
    logError(error);
    res.status(500).json({ message: "Lỗi server khi cập nhật số lượng." });
  }
};

// ----------------------------------------------------
// 4. [DELETE] Xóa một mục khỏi Giỏ hàng
// ----------------------------------------------------
export const removeItemFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body; // Hoặc dùng req.params nếu route là DELETE /cart/:productId

    const cart = await User.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại." });
    }

    // Lọc (filter) ra mục cần xóa
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    res.status(200).json({ message: "Đã xóa sản phẩm khỏi giỏ hàng.", cart });
  } catch (error) {
    logError(error);
    res.status(500).json({ message: "Lỗi server khi xóa sản phẩm." });
  }
};
