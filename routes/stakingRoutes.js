const express = require('express');
const router = express.Router();
const { getStakingInfo, stakeAsset } = require('../controllers/stakingController');

// Get staking information
router.get('/', getStakingInfo);

// Stake assets
router.post('/', stakeAsset);

module.exports = router;
