import ShippingCart from "../models/ShippingCart";
import Order from "../models/OrderList";
const logError = (error, context = "Order Controller") => {
  console.error(`[${context}] Error:`, error.message);
};

// Tính tổng tiền hàng (Subtotal)
const calculateSubTotal = (items) => {
  if (!items || items.length === 0) return 0;
  return items.reduce((sum, item) => {
    const price = Number(item.newPrice) || 0;
    const qty = Number(item.quantities) || 0;
    return sum + price * qty;
  }, 0);
};

// Tính tỉ lệ giảm giá dựa trên số lượng
const calculateDiscountRate = (items) => {
  // Tính tổng số lượng item
  const totalQuantity = items.reduce(
    (sum, item) => sum + (item.quantities || 0),
    0
  );

  if (totalQuantity >= 30) return 0.4; // Giảm 40%
  if (totalQuantity >= 20) return 0.2; // Giảm 20%
  if (totalQuantity > 10) return 0.1; // Giảm 10%
  return 0;
};
// 1.Xem trước hóa đơn cho các món đã chọn
export const displayFinalBill = async (req, res) => {
  try {
    const userID = req.user.id;
    // Lấy danh sách ID các sản phẩm được tick chọn từ Frontend
    const { selectedItemIds } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (
      !selectedItemIds ||
      !Array.isArray(selectedItemIds) ||
      selectedItemIds.length === 0
    ) {
      return res.status(200).json({
        items: [],
        subTotal: 0,
        finalTotal: 0,
        message: "No items selected.",
      });
    }

    // Tìm các sản phẩm trong giỏ hàng khớp với danh sách ID đã chọn
    const selectedItems = await ShippingCart.find({
      owner: userID, // Phải thuộc về User hiện tại
      _id: { $in: selectedItemIds }, // ID phải nằm trong danh sách selectedItemIds
    });

    if (!selectedItems || selectedItems.length === 0) {
      return res
        .status(404)
        .json({ message: "Selected items not found in cart." });
    }

    // Tính toán các loại phí
    const subTotal = calculateSubTotal(selectedItems);
    const discountRate = calculateDiscountRate(selectedItems);
    const discountAmount = subTotal * discountRate;
    const shippingFee = 30000; // Phí ship cố định (có thể thay đổi logic sau này)

    // Tính tổng cuối cùng
    const finalTotal = subTotal - discountAmount + shippingFee;

    // Trả về kết quả cho Frontend hiển thị
    res.status(200).json({
      items: selectedItems,
      subTotal: subTotal,
      shippingFee: shippingFee,
      discountRate: discountRate,
      discountAmount: discountAmount,
      finalTotal: finalTotal,
    });
  } catch (error) {
    logError(error, "Display Bill");
    res.status(500).json({ message: "Server error while calculating bill." });
  }
};
// 2. PLACE ORDER (Đặt hàng & Xóa item đã chọn khỏi giỏ)
export const placeOrder = async (req, res) => {
  try {
    const userID = req.user.id;
    // Frontend gửi thông tin giao hàng và danh sách ID sản phẩm được chọn
    const { shipAddress, paymentMethod, selectedItemIds } = req.body;

    // Validate thông tin bắt buộc
    if (!shipAddress || !paymentMethod) {
      return res
        .status(400)
        .json({ message: "Shipping address and payment method are required." });
    }
    if (
      !selectedItemIds ||
      !Array.isArray(selectedItemIds) ||
      selectedItemIds.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Please select at least one item to checkout." });
    }

    // Lấy dữ liệu thực tế từ DB dựa trên ID đã chọn (Bảo mật: Không tin dữ liệu giá từ Frontend)
    const selectedCartItems = await ShippingCart.find({
      owner: userID,
      _id: { $in: selectedItemIds },
    });

    if (selectedCartItems.length === 0) {
      return res
        .status(400)
        .json({ message: "Selected items no longer exist." });
    }

    // Tính toán lại tiền (Server-side calculation)
    const subTotal = calculateSubTotal(selectedCartItems);
    const discountRate = calculateDiscountRate(selectedCartItems);
    const discountAmount = subTotal * discountRate;
    const shippingFee = 30000;
    const finalTotal = subTotal - discountAmount + shippingFee;

    // Tạo đối tượng Order mới
    const newOrder = new Order({
      owner: userID,
      items: selectedCartItems, // Mongoose tự động copy cấu trúc JSON
      shipAddress: shipAddress,
      paymentMethod: paymentMethod,
      subTotal: subTotal,
      shippingFee: shippingFee,
      discount: discountAmount,
      finalTotal: finalTotal,
      status: "Pending", // Trạng thái mặc định
    });

    // Lưu đơn hàng vào DB
    const savedOrder = await newOrder.save();

    // QUAN TRỌNG: Chỉ xóa những sản phẩm ĐÃ CHỌN khỏi giỏ hàng
    // Các sản phẩm không được chọn sẽ giữ nguyên trong giỏ
    await ShippingCart.deleteMany({
      owner: userID,
      _id: { $in: selectedItemIds },
    });

    // Trả về kết quả thành công
    res.status(201).json({
      message: "Order placed successfully!",
      orderId: savedOrder._id,
      finalTotal: savedOrder.finalTotal,
    });
  } catch (error) {
    logError(error, "Place Order");
    res.status(500).json({ message: "Server error while placing order." });
  }
};
