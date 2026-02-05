// 🔑 LOAD ENV FIRST
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// ======================
// Middleware
// ======================
app.use(
  cors({
    origin: "http://localhost:3000", // your frontend URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

// ======================
// Routes
// ======================

try {
  const authRoutes = require("./routes/authRoutes");
  const portfolioRoutes = require("./routes/portfolioRoutes");
  const depositRoutes = require("./routes/depositRoutes");
  const withdrawRoutes = require("./routes/withdrawRoutes");
  const investRoutes = require("./routes/investRoutes");
  const adminRoutes = require("./routes/adminRoutes");

  app.use("/api/auth", authRoutes);
  app.use("/api/portfolio", portfolioRoutes);
  app.use("/api/deposit", depositRoutes);
  app.use("/api/withdraw", withdrawRoutes);
  app.use("/api/invest", investRoutes);
  app.use("/api/admin", adminRoutes);
} catch (err) {
  console.error("ROUTE IMPORT FAILED:", err);
}

// ======================
// Health Check
// ======================
app.get("/", (req, res) => {
  res.status(200).json({ message: "CryptoNest Backend is running 🚀" });
});

// ======================
// Global Error Handler
// ======================
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ======================
// Catch uncaught exceptions & unhandled rejections
// ======================
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});

// ======================
// Start Server
// ======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});