const User = require("../users/userModel");
const Stock = require("../stocks/stockModel");

const getTotalUsers = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching total users:", error);
    res.status(500).json({ message: "Failed to fetch total users" });
  }
};

const getTotalStocks = async (req, res) => {
  try {
    const count = await Stock.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching total stocks:", error);
    res.status(500).json({ message: "Failed to fetch total stocks" });
  }
};

const getUserGrowthData = async (req, res) => {
  try {
    const data = await User.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res
      .status(200)
      .json(data.map((item) => ({ date: item._id, count: item.count })));
  } catch (error) {
    console.error("Error fetching user growth data:", error);
    res.status(500).json({ message: "Failed to fetch user growth data" });
  }
};

const getStockGrowthData = async (req, res) => {
  try {
    const data = await Stock.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res
      .status(200)
      .json(data.map((item) => ({ date: item._id, count: item.count })));
  } catch (error) {
    console.error("Error fetching stock growth data:", error);
    res.status(500).json({ message: "Failed to fetch stock growth data" });
  }
};

module.exports = {
  getTotalUsers,
  getTotalStocks,
  getUserGrowthData,
  getStockGrowthData,
};
