// server.js

import express from "express";

import cors from "cors";

import cookieParser from "cookie-parser";



// Import your route modules

import authRoutes from "./routes/authRoutes.js";

import portfolioRoutes from "./routes/portfolioRoutes.js";



// Create Express app

const app = express();



// Middleware

app.use(express.json());

app.use(cookieParser());



// ✅ CORS configuration for frontend on Vercel

app.use(cors({

  origin: [

    "https://cryptonep.com",

    "https://www.cryptonep.com",

    "https://cryptonep.vercel.app"

  ],

  credentials: true, // needed for cookies

}));



// Routes

app.use("/auth", authRoutes);        // Auth routes: signup, login, logout

app.use("/portfolio", portfolioRoutes); // Portfolio routes: protected



// Health check endpoint

app.get("/", (req, res) => {

  res.send("API is running!");

});



// Start server

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`);

});