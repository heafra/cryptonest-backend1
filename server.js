import express from "express";

import cors from "cors";

import cookieParser from "cookie-parser";



import authRoutes from "./routes/authRoutes.js";

import portfolioRoutes from "./routes/portfolioRoutes.js";



const app = express();



app.use(cors({

  origin: "https://www.cryptonep.com",

  credentials: true

}));



app.use(express.json());

app.use(cookieParser());



app.use("/auth", authRoutes);

app.use("/portfolio", portfolioRoutes);



app.get("/health", (req, res) => {

  res.json({ status: "ok" });

});



app.listen(5000, () => {

  console.log("Server running on port 5000");

});