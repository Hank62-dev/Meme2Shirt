import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import authRoutes from "./routes/auth.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Kết nối database
connectDB();

// Middleware - PHẢI ĐẶT TRƯỚC KHI DÙNG ROUTES
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes - ĐẶT TRƯỚC static files để ưu tiên
app.use("/api", authRoutes);

// Test route - kiểm tra users trong database
app.get("/test-db", async (req, res) => {
  try {
    const User = (await import("./models/Users.js")).default;
    const allUsers = await User.find({});
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();

    res.json({
      database: mongoose.connection.name,
      collections: collections.map((c) => c.name),
      usersCount: allUsers.length,
      users: allUsers,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve static files từ thư mục client
const clientDir = path.join(__dirname, "..", "..", "client");

// Serve assets (CSS, JS, images)
app.use("/assets", express.static(path.join(clientDir, "assets")));

// Serve pages
app.use("/pages", express.static(path.join(clientDir, "pages")));

app.use(
  express.static(clientDir, {
    extensions: ["html", "css"],
  })
);

// Serve specific pages
app.get("/", (req, res) => {
  res.redirect("/page_login");
});

app.get("/page_login", (req, res) => {
  res.sendFile(path.join(clientDir, "pages", "page_login", "login.html"));
});

// Serve static files cho page_login (CSS, JS trong cùng thư mục)
app.use(
  "/page_login",
  express.static(path.join(clientDir, "pages", "page_login"))
);

app.get("/page_register", (req, res) => {
  res.sendFile(path.join(clientDir, "pages", "page_register", "register.html"));
});

// Serve static files cho page_register
app.use(
  "/page_register",
  express.static(path.join(clientDir, "pages", "page_register"))
);

app.get("/page_home", (req, res) => {
  res.sendFile(path.join(clientDir, "pages", "page_home", "index.html"));
});

// Serve static files cho page_home
app.use(
  "/page_home",
  express.static(path.join(clientDir, "pages", "page_home"))
);

app.get("/page_design", (req, res) => {
  res.sendFile(path.join(clientDir, "pages", "page_design", "design.html"));
});

// Serve static files cho page_design
app.use(
  "/page_design",
  express.static(path.join(clientDir, "pages", "page_design"))
);

app.get("/page_optionDesign", (req, res) => {
  res.sendFile(
    path.join(clientDir, "pages", "page_optionDesign", "option.html")
  );
});

// Serve static files cho page_optionDesign
app.use(
  "/page_optionDesign",
  express.static(path.join(clientDir, "pages", "page_optionDesign"))
);

app.get("/page_cart", (req, res) => {
  res.sendFile(path.join(clientDir, "pages", "page_cart", "cart.html"));
});

// Serve static files cho page_cart
app.use(
  "/page_cart",
  express.static(path.join(clientDir, "pages", "page_cart"))
);

app.get("/page_checkout", (req, res) => {
  res.sendFile(path.join(clientDir, "pages", "page_checkout", "checkout.html"));
});

// Serve static files cho page_checkout
app.use(
  "/page_checkout",
  express.static(path.join(clientDir, "pages", "page_checkout"))
);

app.get("/page_orderList", (req, res) => {
  res.sendFile(
    path.join(clientDir, "pages", "page_orderList", "orderList.html")
  );
});

// Serve static files cho page_orderList
app.use(
  "/page_orderList",
  express.static(path.join(clientDir, "pages", "page_orderList"))
);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port : http://localhost:${PORT}`);
});

export default app;
