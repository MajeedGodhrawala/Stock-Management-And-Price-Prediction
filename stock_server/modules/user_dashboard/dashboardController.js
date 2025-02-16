const UserStock = require("../stocks/UserStock.js");
const HistoricalStockData = require("../stocks/historicalStockDataModel.js");

const getUserStocks = async (req, res) => {
  try {
    const userId = req.query.user_id; // Get user_id from query parameter
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const userStocks = await UserStock.find({ user_id: userId }).populate(
      "stock_id"
    );
    res.status(200).json(userStocks);
  } catch (error) {
    console.error("Error fetching user stocks:", error);
    res.status(500).json({ message: "Failed to fetch user stocks" });
  }
};

const getStockPerformanceData = async (req, res) => {
  try {
    const userId = req.query.user_id; // Get user_id from query parameter
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const userStocks = await UserStock.find({ user_id: userId });
    const stockIds = userStocks.map((stock) => stock.stock_id);

    const performanceData = await HistoricalStockData.find({
      stock_id: { $in: stockIds },
    }).sort({ date: 1 });
    res.status(200).json(performanceData);
  } catch (error) {
    console.error("Error fetching stock performance data:", error);
    res.status(500).json({ message: "Failed to fetch stock performance data" });
  }
};

const getProfitLossData = async (req, res) => {
  try {
    const userId = req.query.user_id; // Get user_id from query parameter
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Fetch user's stocks
    const userStocks = await UserStock.find({ user_id: userId }).populate(
      "stock_id"
    );

    // Fetch latest stock prices
    const stockIds = userStocks.map((stock) => stock.stock_id);
    const latestStockPrices = await HistoricalStockData.find({
      stock_id: { $in: stockIds },
    })
      .sort({ date: -1 })
      .limit(stockIds.length);

    // Calculate profit/loss for each stock
    let totalProfitLoss = 0;
    const profitLossData = userStocks.map((stock) => {
      const latestPrice =
        latestStockPrices.find((price) =>
          price.stock_id.equals(stock.stock_id._id)
        )?.close || 0;
      const profitLoss = (latestPrice - stock.purchasePrice) * stock.qty;
      totalProfitLoss += profitLoss;

      return {
        date: new Date().toISOString().split("T")[0], // Use current date for simplicity
        stockName: stock.stock_id.name,
        profitLoss: profitLoss,
      };
    });

    res.status(200).json({
      data: profitLossData,
      totalProfitLoss: totalProfitLoss,
    });
  } catch (error) {
    console.error("Error fetching profit/loss data:", error);
    res.status(500).json({ message: "Failed to fetch profit/loss data" });
  }
};

module.exports = {
  getUserStocks,
  getStockPerformanceData,
  getProfitLossData,
};
