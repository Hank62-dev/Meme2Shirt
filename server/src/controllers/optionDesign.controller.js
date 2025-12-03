import ProductsSelection from "../models/ProductsSelection.js";
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
      message: "Your order request was successful.",
      data: savedSelection,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending request.", error: error.message });
  }
};
