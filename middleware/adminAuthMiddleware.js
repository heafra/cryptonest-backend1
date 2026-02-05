// middleware/adminAuthMiddleware.js
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    // 1️⃣ Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    // 2️⃣ Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ Check if user is admin
    // ✅ Support both `is_admin` boolean or role string
    if (!decoded.is_admin && decoded.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    // 4️⃣ Attach decoded user to request
    req.user = decoded;
    next();
  } catch (err) {
    console.error("ADMIN AUTH ERROR:", err);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};