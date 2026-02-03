const express = require("express");
const router = express.Router();
const pool = require("../db");
const verifyToken = require("../middleware/verifyToken");

// GET /api/portfolio
router.get("/", verifyToken, async (req, res) => {
  try {
    console.log("📊 Portfolio route HIT for user:", req.userId);

    const result = await pool.query(
      "SELECT balance, invested FROM users WHERE id = $1",
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      balance: Number(result.rows[0].balance),
      invested: Number(result.rows[0].invested),
    });
  } catch (err) {
    console.error("PORTFOLIO ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;