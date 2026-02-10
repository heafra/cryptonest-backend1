// routes/portfolioRoutes.js
import express from 'express';
import auth from '../middleware/authMiddleware.js';
import db from '../db.js';

const router = express.Router();

router.get('/', auth, (req, res) => {
  try {
    const user = db.prepare('SELECT balance, invested FROM users WHERE id = ?').get(req.user.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Portfolio error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
