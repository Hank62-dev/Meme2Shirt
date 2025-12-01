import ProductsSelection from "../models/ProductsSelection.js"; // Import schema bạn đã cung cấp

export const createSelection = async (req, res) => {
  try {
    const {
      idProduct,
      imageURL,
      nameProduct,
      isDesign,
      printSide,
      color,
      size,
      newPrice,
      quantities,
    } = req.body;

    // Logic kiểm tra dữ liệu server-side
    // Nếu isDesign là false, bắt buộc printSide phải rỗng
    const finalPrintSide = isDesign ? printSide : "";

    const newSelection = new ProductsSelection({
      idProduct,
      imageURL,
      nameProduct,
      isDesign,
      printSide: finalPrintSide,
      color,
      size,
      newPrice,
      quantities,
    });

    const savedSelection = await newSelection.save();

    res.status(201).json({
      message: "Đã lưu lựa chọn sản phẩm thành công",
      data: savedSelection,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lưu sản phẩm", error: error.message });
  }
};
