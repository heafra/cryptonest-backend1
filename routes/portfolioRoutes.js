// routes/portfolioRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const pool = require("../db");

// GET /portfolio — protected
router.get("/", auth, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT balance, invested FROM users WHERE id = $1",
      [req.user.userId]
    );
    if (!result.rows.length) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Portfolio error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

