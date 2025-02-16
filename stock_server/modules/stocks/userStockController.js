const UserStock = require("./UserStock.js");
const Stock = require("./stockModel.js");
const HistoricalStockData = require("./historicalStockDataModel.js");

const addUserStock = async (req, res) => {
  try {
    const { user_id, stock_id, date, qty } = req.body;

    // Fetch the latest historical data for the stock
    const latestHistoricalData = await HistoricalStockData.findOne({ stock_id })
      .sort({ date: -1 }) // Get the latest entry
      .select("close"); // Select only the close price

    if (!latestHistoricalData) {
      return res
        .status(404)
        .json({ message: "Historical data not found for the stock" });
    }

    const purchasePrice = latestHistoricalData.close; // Use the latest close price as the purchase price

    // Create a new UserStock entry
    const newUserStock = new UserStock({
      user_id,
      stock_id,
      date,
      qty,
      purchasePrice, // Set the purchase price
    });

    await newUserStock.save();
    res
      .status(201)
      .json({ message: "Stock added successfully", userStock: newUserStock });
  } catch (error) {
    console.error("Error adding user stock:", error);
    res
      .status(500)
      .json({ message: "Failed to add stock", error: error.message });
  }
};

const getUserStocks = async (req, res) => {
  try {
    const { user_id } = req.query;

    // Validate user_id
    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Fetch user-specific stocks and populate stock details
    const userStocks = await UserStock.find({ user_id }).populate({
      path: "stock_id",
      select: "name short_name stock_pic", // Select only necessary fields
    });

    // Transform the data to include currentPrice, previousPrice, qty, and date
    const formattedStocks = await Promise.all(
      userStocks.map(async (userStock) => {
        // Fetch historical data for the current stock
        const historicalData = await HistoricalStockData.find({
          stock_id: userStock.stock_id._id,
        })
          .sort({ date: -1 }) // Sort by date in descending order (latest first)
          .limit(2); // Limit to the latest 2 records

        // Extract the latest and second-latest historical data points
        const latestData = historicalData[0];
        const previousData = historicalData[1];

        // Calculate profit/loss
        const currentPrice = latestData ? latestData.close : 0;
        const profitLoss =
          userStock.qty * (currentPrice - userStock.purchasePrice);

        return {
          _id: userStock._id,
          user_id: userStock.user_id,
          stock_id: {
            _id: userStock.stock_id._id,
            name: userStock.stock_id.name,
            short_name: userStock.stock_id.short_name,
            stock_pic: userStock.stock_id.stock_pic,
          },
          date: userStock.date, // Date of purchase
          qty: userStock.qty, // Quantity purchased
          purchasePrice: userStock.purchasePrice, // Purchase price
          currentPrice: currentPrice, // Latest close price
          previousPrice: previousData ? previousData.close : 0, // Previous close price
          profitLoss: profitLoss, // Profit/Loss calculation
        };
      })
    );

    // Send the response
    res.status(200).json(formattedStocks);
  } catch (error) {
    console.error("Error fetching user stocks:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch user stocks", error: error.message });
  }
};

module.exports = {
  addUserStock,
  getUserStocks,
};
