const express = require("express");
const { investFunds } = require("../controllers/investController");
const router = express.Router();

router.post("/", investFunds);

module.exports = router;