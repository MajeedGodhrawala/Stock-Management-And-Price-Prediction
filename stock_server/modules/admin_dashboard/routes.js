const express = require("express");
const router = express.Router();
const {
  getTotalUsers,
  getTotalStocks,
  getUserGrowthData,
  getStockGrowthData,
} = require("./dashboardController");

router.get("/users/count", getTotalUsers);
router.get("/stocks/count", getTotalStocks);
router.get("/users/growth", getUserGrowthData);
router.get("/stocks/growth", getStockGrowthData);

module.exports = router;
