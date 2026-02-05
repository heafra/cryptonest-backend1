const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const pool = require("../db");

// ✅ Admin-only balance update
router.put("/update-balance", auth, async (req, res) => {
  try {
    const { userId, balance } = req.body;

    if (!userId || balance === undefined) {
      return res.status(400).json({ error: "userId and balance required" });
    }

    // 🔐 Optional: enforce admin role
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    await pool.query(
      "UPDATE users SET balance = $1 WHERE id = $2",
      [balance, userId]
    );

    res.json({ message: "Balance updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;