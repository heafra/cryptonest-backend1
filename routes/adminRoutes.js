const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const pool = require("../db");

// ✅ Admin-only balance update (add or subtract)
router.put("/update-balance", auth, async (req, res) => {
  try {
    const { userId, amount } = req.body;

    // ✅ Validation
    if (!userId || typeof amount !== "number") {
      return res.status(400).json({
        error: "userId and numeric amount are required",
      });
    }

    // 🔐 Enforce admin role
    if (req.user.role !== "admin") {
      return res.status(403).json({
        error: "Admin access required",
      });
    }

    // ✅ Update balance safely
    const result = await pool.query(
      `
      UPDATE users
      SET balance = balance + $1
      WHERE id = $2
      RETURNING id, balance
      `,
      [amount, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.json({
      message: "Balance updated successfully",
      user: result.rows[0],
    });
  } catch (err) {
    console.error("Update balance error:", err);
    res.status(500).json({
      error: "Server error",
    });
  }
});

module.exports = router;