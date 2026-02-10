import express from "express";

import mongoose from "mongoose";

import cors from "cors";

import cookieParser from "cookie-parser";

import dotenv from "dotenv";



dotenv.config();



const app = express();



// =====================

// MIDDLEWARE

// =====================

app.use(express.json());

app.use(cookieParser());



// =====================

// CORS (VERY IMPORTANT)

// =====================

app.use(

  cors({

    origin: [

      "http://localhost:3000",

      "https://cryptonep.com",

      "https://www.cryptonep.com",

      "https://cryptonep.vercel.app",

    ],

    credentials: true, // ✅ REQUIRED for cookies

  })

);



// =====================

// TEST ROUTE

// =====================

app.get("/", (req, res) => {

  res.send("API running");

});



// =====================

// AUTH ROUTES

// =====================

app.post("/api/auth/login", async (req, res) => {

  const { email } = req.body;



  // ⚠️ Normally you'd verify password & user

  const fakeToken = "jwt_token_example";



  res.cookie("token", fakeToken, {

    httpOnly: true,

    secure: true,      // ✅ REQUIRED (Vercel = HTTPS)

    sameSite: "none",  // ✅ REQUIRED (cross-site)

    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days

  });



  console.log("✅ Login success:", email);



  res.json({

    success: true,

    user: { email },

  });

});



app.post("/api/auth/logout", (req, res) => {

  res.clearCookie("token", {

    httpOnly: true,

    secure: true,

    sameSite: "none",

  });



  res.json({ success: true });

});



// =====================

// PROTECTED ROUTE

// =====================

app.get("/api/portfolio", (req, res) => {

  const token = req.cookies.token;



  if (!token) {

    return res.status(401).json({ error: "Unauthorized" });

  }



  res.json({

    balance: 1000,

    invested: 250,

  });

});



// =====================

// MONGODB

// =====================

mongoose

  .connect(process.env.MONGO_URI)

  .then(() => console.log("✅ MongoDB connected"))

  .catch((err) => console.error("❌ Mongo error:", err));



// =====================

// SERVER

// =====================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>

  console.log(`✅ Server running on port ${PORT}`)

);