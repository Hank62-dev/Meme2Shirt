// dùng models để tương tác với db
import Product from "../models/Product";
import User from "../models/User";
// 1 Lấy thông tin để hiện thị giỏ hàng
const getCart = async (req, res) => {
  try {
    // cho thằng này từ middleware auth
    const userID = req.user.id;
    const cart = await User.findUser(userID).populate(
      "cart.product",
      "name price customLink"
    );
    if (!cart) {
      // nếu rỗng thì báo
      return res.status(200).json({ cart: [], total: 0 });
    }
    res.status(200).json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: " ERROR!!!" });
  }
};
// 2 Thêm mới sản phẩm
const addItemToCart = async (req, res) => {
  try {
    const userID = req.user.id;
    const { productID, quantity, customLink } = req.body;
    // quantity là số lượng
    // customLink là đường link ảnh sản phẩm
    const product = await Product.findByID(productID);
    if (!product) {
      // nếu k thấy sản phẩm
      return res.status(404).json({ message: "ERROR!!Don't find this item" });
    }
    // tạo giỏ hàng
    const cart = await User.findOne(userID);
    if (!cart) {
      // không thấy thì tạo mới
      cart = await User.create(userID, []); //hàm nhận vào id ng dùng và giỏ hàng sẽ là rỗng
    }
    // nếu thêm trùng sản phẩm thì số lượng tăng thêm
    const itemIndex = cart.items.findIndex((item) => {
      item.product.toString() === productID && item.customLink === customLink;
    });
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += 1; //đoạn này là khi mà nếu chọn trùng thì tăng lên 1
    } else {
      //chưa có thì thêm vào
      cart.items.push(productID, quantity, customLink);
    }
    // xong r thì lưu và cập nhậ lại
    await cart.save();
    res.status(200).json({ message: "Add to cart successfully" }, cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: " ERROR!!!" });
  }
};
// 3 Cập nhật lại số lượng và các sản phẩm
const updateItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productID, quantity } = req.body;
    const cart = await User.findOne(userId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const itemIndex = cart.item.findIndex(
      (item) => item.product.toString() === productID
    );
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      res.status(200).json({ message: "Update cart successfully" }, cart);
    } else {
      return res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: " ERROR!!!" });
  }
};
// 4 Xoá sản phẩm khỏi giỏ hàng
const removeItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productID } = req.body;
    const cart = await User.findOne(userId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    } else {
      cart.items = cart.items.filter(
        (item) => item.product.toString() !== productID
      );
      await cart.save();
      res.status(200).json({ message: "Remove item successfully" }, cart);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: " ERROR!!!" });
  }
};
