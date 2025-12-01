import ProductsDefault from "../models/ProductsDefault.js"; // Nhớ thêm .js nếu dùng ES Modules

// 1. Lấy danh sách sản phẩm (Hàm bạn đang thiếu)
export const getAllProducts = async (req, res) => {
  try {
    const { type } = req.query; // Hỗ trợ lọc ?type=polo
    let filter = {};
    if (type) filter.category = type;

    const products = await ProductsDefault.find(filter);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Lấy 1 sản phẩm theo ID (Hàm bạn đã có)
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductsDefault.findOne({ idProduct: id });
    if (!product) return res.status(404).json({ message: "Không tìm thấy" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
