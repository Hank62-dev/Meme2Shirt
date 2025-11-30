import ProductsDefault from "../models/ProductsDefault"; // Nhớ trỏ đúng đường dẫn file model

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params; // Lấy id từ đường dẫn URL (route param)

    // Tìm trong database xem có sản phẩm nào khớp idProduct không
    const product = await ProductsDefault.findOne({ idProduct: id });

    // Nếu không tìm thấy
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    // Trả về dữ liệu sản phẩm tìm thấy
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
