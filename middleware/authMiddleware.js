const jwt = require("jsonwebtoken");



module.exports = (req, res, next) => {

  const token = req.cookies?.token;



  // 🔥 No token → unauthorized (do NOT crash)

  if (!token) {

    return res.status(401).json({ error: "Not authenticated" });

  }



  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // { userId, email }

    next();

  } catch (err) {

    console.error("JWT VERIFY ERROR:", err.message);

    return res.status(401).json({ error: "Invalid token" });

  }

};



