// middleware/adminAuthMiddleware.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // 1️⃣ Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Bearer <token>
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // 2️⃣ Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ Check if user is admin
    if (!decoded.isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    // 4️⃣ Attach decoded user to request
    req.user = decoded; // { userId, email, isAdmin }

    next(); // ✅ Allow access
  } catch (err) {
    console.error("ADMIN AUTH ERROR:", err.message);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
