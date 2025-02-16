const express = require("express");
const router = express.Router();
const {
  getUserStocks,
  getStockPerformanceData,
  getProfitLossData,
} = require("./dashboardController");

router.get("/stocks", getUserStocks);
router.get("/performance", getStockPerformanceData);
router.get("/profit-loss", getProfitLossData);

module.exports = router;
