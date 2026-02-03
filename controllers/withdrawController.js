const users = require("./authController").users || [];

module.exports.withdrawFunds = (req, res) => {
  const { userId, amount } = req.body;
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  // Show compliance message, do not deduct for demo
  res.json({ message: "Withdrawal requires compliance clearance", portfolio: user.portfolio });
};