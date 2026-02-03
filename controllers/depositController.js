const users = require("./authController").users || [];

module.exports.depositFunds = (req, res) => {
  const { userId, amount, type } = req.body;
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  // Add deposit to portfolio
  user.portfolio.totalValue += parseFloat(amount);
  user.portfolio.assets.push({ name: type === "crypto" ? "USDT" : "Bank Deposit", symbol: type === "crypto" ? "USDT" : "BANK", amountUSD: parseFloat(amount) });

  res.json({ message: "Deposit successful", portfolio: user.portfolio });
};
