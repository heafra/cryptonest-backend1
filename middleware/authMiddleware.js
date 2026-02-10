// middleware/authMiddleware.js
import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    const token = req.cookies?.token; // read from HTTP-only cookie
    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info to request
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

export default auth;

