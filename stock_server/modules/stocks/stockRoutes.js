const express = require("express");
const { getStocks, getHistoricalData } = require("./stockController.js");
const { addUserStock, getUserStocks } = require("./userStockController.js");

const router = express.Router();

router.get("/get-stocks", getStocks);
router.get("/:id/historical-data", getHistoricalData);
router.get("/get-user-stocks", getUserStocks);
router.post("/add-user-stock", addUserStock);

module.exports = router;
