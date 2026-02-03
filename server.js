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
    origin: "http://localhost:3000",
    credentials: true, // 🔥 REQUIRED for cookies
  })
);

app.use(express.json());
app.use(cookieParser()); // 🔥 REQUIRED for reading cookies

// ======================
// Routes
// ======================
const authRoutes = require("./routes/authRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const depositRoutes = require("./routes/depositRoutes");
const withdrawRoutes = require("./routes/withdrawRoutes");
const investRoutes = require("./routes/investRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Route prefixes
app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/deposit", depositRoutes);
app.use("/api/withdraw", withdrawRoutes);
app.use("/api/invest", investRoutes);
app.use("/api/admin", adminRoutes);

// ======================
// Health Check
// ======================
app.get("/", (req, res) => {
  res.send("CryptoNest Backend is running 🚀");
});

// ======================
// Start Server
// ======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

