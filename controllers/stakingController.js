const { calculateReward } = require('../services/stakingService');
const pool = require('../config/db');

// Get all Staking Info for User
const getStakingInfo = async (req, res, next) => {
  try {
    const userId = req.user.id;  // Assuming JWT authentication is set up
    const result = await pool.query('SELECT * FROM staking WHERE user_id=$1', [userId]);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// Stake Asset (Initiate Staking)
const stakeAsset = async (req, res, next) => {
  try {
    const { asset, amount, duration } = req.body;
    const userId = req.user.id;  // Assuming JWT authentication is set up
    const apr = 5;  // Example APR (Annual Percentage Rate)
    
    // Calculate staking reward based on duration
    const reward = calculateReward(amount, apr, duration);

    // Store staking information in DB (you can adjust based on your schema)
    const result = await pool.query(
      'INSERT INTO staking (user_id, asset, amount, duration, reward) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, asset, amount, duration, reward]
    );

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

module.exports = { getStakingInfo, stakeAsset };

