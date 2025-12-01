import inforUsersOrders from "../models/InforUsersOrder.js";

export const creatOrderInfor = async (req, res) => {
  try {
    const newOrder = new inforUsersOrders(req.body);
    await newOrder.save();

    res.status(201).json({
      message: "Order information saved successfully",
      data: newOrder,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
