const express = require("express");
const { getStocks, getHistoricalData } = require("./stockController.js");

const router = express.Router();

router.get("/get-stocks", getStocks);
router.get("/:id/historical-data", getHistoricalData);

module.exports = router;
