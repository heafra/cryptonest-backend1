const users = require("./authController").users || [];

module.exports.investFunds = (req, res) => {
  const { userId, amount } = req.body;
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  // Add investment with 1% daily interest
  const investment = {
    name: "Investment",
    symbol: "INV",
    amountUSD: parseFloat(amount),
    dailyInterest: 0.01
  };
  user.portfolio.assets.push(investment);
  user.portfolio.totalValue += parseFloat(amount);

  res.json({ message: "Investment successful", portfolio: user.portfolio });
};
