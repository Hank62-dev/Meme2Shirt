import bcrypt from "bcrypt";
import User from "../models/Users.js";

// Controller xử lý đăng ký
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body || {};

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Kiểm tra username đã tồn tại chưa
    const existingUser = await User.findOne({ name: username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Kiểm tra email đã tồn tại chưa
    const existingEmail = await User.findOne({ email: email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Tạo user mới (KHÔNG hash password - KHÔNG AN TOÀN!)
    const newUser = new User({
      name: username,
      email: email,
      password: password, // Lưu plain text - KHÔNG KHUYẾN NGHỊ
    });

    await newUser.save();

    return res.json({
      message: "User registered successfully",
      username: username,
    });
  } catch (error) {
    console.error("Register error (detailed):", error.message);
    console.error(error.stack);
    return res.status(500).json({
      message: "Server error during registration",
      error: error.message,
    });
  }
};

// Controller xử lý đăng nhập
export const login = async (req, res) => {
  try {
    const { username, password } = req.body || {};

    console.log("Login attempt:", { username, password });

    // Validate input
    if (!username || !password) {
      console.log("Missing fields");
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Tìm user trong database
    const user = await User.findOne({ name: username });
    console.log("User found:", user ? "Yes" : "No");

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // So sánh password trực tiếp (KHÔNG AN TOÀN!)
    console.log("Input password:", password);
    console.log("DB password:", user.password);

    if (password === user.password) {
      console.log("Password valid: true");
      return res.json({
        message: "Login successful",
        username: user.name,
        email: user.email,
      });
    } else {
      console.log("Password valid: false");
      return res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error during login" });
  }
};
