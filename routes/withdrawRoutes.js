const express = require("express");
const router = express.Router();
const pool = require("../db");
const jwt = require("jsonwebtoken");

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// POST /api/withdraw
router.post("/", verifyToken, async (req, res) => {
  const { amount } = req.body;

  if (!amount || isNaN(amount) || amount <= 0)
    return res.status(400).json({ error: "Invalid withdraw amount" });

  try {
    // Check current balance
    const userRes = await pool.query(
      "SELECT balance FROM users WHERE id = $1",
      [req.userId]
    );
    const currentBalance = userRes.rows[0].balance;

    if (amount > currentBalance)
      return res.status(400).json({ error: "Insufficient balance" });

    const result = await pool.query(
      "UPDATE users SET balance = balance - $1 WHERE id = $2 RETURNING balance",
      [amount, req.userId]
    );

    res.json({ balance: result.rows[0].balance });
  } catch (err) {
    console.error("Withdraw error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;


