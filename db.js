// db.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const mongoUri = process.env.MONGO_URI;

console.log("Connecting to MongoDB:", mongoUri ? "(loaded)" : "(missing)");

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri, {
      autoIndex: true,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
