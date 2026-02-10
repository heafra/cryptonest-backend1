// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import db from '../db.js';

export default function auth(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = db.prepare('SELECT id, email, is_admin FROM users WHERE id = ?').get(decoded.userId);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    req.user = { userId: user.id, email: user.email, isAdmin: !!user.is_admin };
    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}
