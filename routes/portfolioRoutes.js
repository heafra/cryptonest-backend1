// routes/portfolioRoutes.js
import express from "express";
import auth from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// GET /portfolio — protected route
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("email balance invested");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ email: user.email, balance: user.balance, invested: user.invested });
  } catch (err) {
    console.error("Portfolio error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
