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



app.use(cors({

  origin: [

    "http://localhost:3000",

    "https://cryptonep.com",

    "https://www.cryptonep.com"

  ],

  credentials: true

}));



app.use(express.json());

app.use(cookieParser());

app.use(morgan("dev"));



app.use("/api/auth", authRoutes);



app.get("/", (_, res) => res.json({ ok: true }));



app.listen(5000, "0.0.0.0", () =>

  console.log("✅ Backend running on port 5000")

);



