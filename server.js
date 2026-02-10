import dotenv from "dotenv";

dotenv.config();



import express from "express";

import cors from "cors";

import cookieParser from "cookie-parser";

import morgan from "morgan";



import connectDB from "./db.js";

import authRoutes from "./routes/authRoutes.js";



connectDB();



const app = express();



// ======================

// CORS

// ======================

const allowedOrigins = [

  "http://localhost:3000",

  "https://cryptonep.com",

  "https://www.cryptonep.com"

];



app.use(

  cors({

    origin: (origin, callback) => {

      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) return callback(null, true);

      return callback(new Error("Not allowed by CORS"));

    },

    credentials: true

  })

);



// ======================

// MIDDLEWARE

// ======================

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(morgan("dev"));



// ======================

// ROUTES

// ======================

app.use("/api/auth", authRoutes);



// ======================

// HEALTH CHECK

// ======================

app.get("/", (req, res) => {

  res.json({ message: "CryptoNest Backend is running 🚀" });

});



// ======================

// START SERVER

// ======================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {

  console.log(`✅ Server running on port ${PORT}`);

});