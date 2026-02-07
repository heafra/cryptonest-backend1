// 🔑 LOAD ENV FIRST

require("dotenv").config();



const express = require("express");

const cors = require("cors");

const cookieParser = require("cookie-parser");



const app = express();



// ======================

// CORS (FIXED)

// ======================

const allowedOrigins = [

  "http://localhost:3000",

  "https://cryptonep.com",

  "https://www.cryptonep.com",

];



app.use(

  cors({

    origin: function (origin, callback) {

      // allow requests with no origin (like curl, Postman)

      if (!origin) return callback(null, true);



      if (allowedOrigins.includes(origin)) {

        return callback(null, true);

      }



      return callback(new Error("Not allowed by CORS"));

    },

    credentials: true,

    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization"],

  })

);



// IMPORTANT: allow preflight to succeed

app.options("*", cors());



app.use(express.json());

app.use(cookieParser());



// ======================

// Routes

// ======================

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



// ======================

// Health Check

// ======================

app.get("/", (req, res) => {

  res.json({ message: "CryptoNest Backend is running 🚀" });

});



// ======================

// Start Server

// ======================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {

  console.log(`✅ Server running on port ${PORT}`);

});