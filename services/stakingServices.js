const calculateReward = (amount, apr, days) => {
  // Simple daily interest calculation
  const dailyRate = apr / 365 / 100;
  return amount * dailyRate * days;
};

module.exports = { calculateReward };

