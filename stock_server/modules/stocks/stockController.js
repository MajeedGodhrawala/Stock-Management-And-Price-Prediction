const Stock = require("./stockModel.js");
const HistoricalStockData = require("./historicalStockDataModel.js");
const { validationResult } = require("express-validator");
const multer = require("multer");
const path = require("path");
const XLSX = require("xlsx");
const moment = require("moment");
const axios = require("axios");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage }).fields([
  { name: "stock_pic", maxCount: 1 },
  { name: "historical_data_file", maxCount: 1 },
]);

const createStock = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Request Files:", req.files);

    const { name, short_name } = req.body;

    if (!req.files || !req.files["stock_pic"]) {
      return res.status(400).json({ message: "Stock picture is required" });
    }

    const stock_pic = req.files["stock_pic"][0].path;

    const newStock = new Stock({ name, short_name, stock_pic });
    await newStock.save();

    if (req.files["historical_data_file"]) {
      const filePath = req.files["historical_data_file"][0].path;
      console.log("Excel File Path:", filePath);

      const historicalData = await processExcelFile(filePath, newStock._id);
      console.log("Historical Data to Insert:", historicalData);

      await HistoricalStockData.insertMany(historicalData);
    }

    res
      .status(201)
      .json({ message: "Stock created successfully", stock: newStock });
  } catch (error) {
    console.error("Error creating stock:", error);
    res
      .status(500)
      .json({ message: "Failed to create stock", error: error.message });
  }
};

const getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find({});
    res.status(200).json(stocks);
  } catch (error) {
    console.error("Error fetching stocks:", error);
    res.status(500).json({ message: "Failed to fetch stocks" });
  }
};

const getStockById = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) return res.status(404).json({ message: "Stock not found" });
    res.status(200).json(stock);
  } catch (error) {
    console.error("Error fetching stock:", error);
    res.status(500).json({ message: "Failed to fetch stock" });
  }
};

const updateStock = async (req, res) => {
  try {
    const { name, short_name } = req.body;
    const stock = await Stock.findById(req.params.id);
    if (!stock) return res.status(404).json({ message: "Stock not found" });

    stock.name = name;
    stock.short_name = short_name;

    if (req.files["stock_pic"]) {
      stock.stock_pic = req.files["stock_pic"][0].path;
    }

    await stock.save();
    res.status(200).json({ message: "Stock updated successfully", stock });
  } catch (error) {
    console.error("Error updating stock:", error);
    res.status(500).json({ message: "Failed to update stock" });
  }
};

const deleteStock = async (req, res) => {
  try {
    const stock = await Stock.findByIdAndDelete(req.params.id);
    if (!stock) return res.status(404).json({ message: "Stock not found" });

    await HistoricalStockData.deleteMany({ stock_id: stock._id });

    res.status(200).json({ message: "Stock deleted successfully" });
  } catch (error) {
    console.error("Error deleting stock:", error);
    res.status(500).json({ message: "Failed to delete stock" });
  }
};

const processExcelFile = async (filePath, stockId) => {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    // Read the sheet data without automatic date conversion
    const data = XLSX.utils.sheet_to_json(sheet, { raw: true });

    console.log("Excel Data:", data);

    const historicalData = data.map((row) => {
      let rawDate = row.Date;
      console.log(`Raw Date from Excel: ${rawDate}`);

      let date;

      // Check if the date is stored as an Excel serial number
      if (typeof rawDate === "number") {
        const parsedDate = XLSX.SSF.parse_date_code(rawDate);
        date = new Date(Date.UTC(parsedDate.y, parsedDate.m - 1, parsedDate.d));
      } else {
        // If it's a string, try to parse it normally
        date = new Date(rawDate);
      }

      console.log(`Parsed Date: ${date}`);

      // Validate date
      if (isNaN(date.getTime())) {
        throw new Error(`Invalid date format: ${rawDate}`);
      }

      return {
        stock_id: stockId,
        date: date.toISOString(), // Store date in ISO format
        open: parseFloat(row.Open),
        high: parseFloat(row.High),
        low: parseFloat(row.Low),
        close: parseFloat(row.Close),
        volume: parseInt(row.Volume, 10),
      };
    });

    console.log("Processed Historical Data:", historicalData);

    return historicalData;
  } catch (error) {
    console.error("Error processing Excel file:", error);
    throw error;
  }
};

const getStocks = async (req, res) => {
  try {
    // Fetch all stocks
    const stocks = await Stock.find({});

    // Transform the data to include currentPrice and previousPrice
    const formattedStocks = await Promise.all(
      stocks.map(async (stock) => {
        // Fetch historical data for the current stock
        const historicalData = await HistoricalStockData.find({
          stock_id: stock._id,
        })
          .sort({ date: -1 }) // Sort by date in descending order (latest first)
          .limit(2); // Limit to the latest 2 records

        // Extract the latest and second-latest historical data points
        const latestData = historicalData[0];
        const previousData = historicalData[1];

        return {
          _id: stock._id,
          name: stock.name,
          short_name: stock.short_name,
          stock_pic: stock.stock_pic,
          currentPrice: latestData ? latestData.close : 0, // Use the latest close price
          previousPrice: previousData ? previousData.close : 0, // Use the previous close price
        };
      })
    );

    // Send the response
    res.status(200).json(formattedStocks);
  } catch (error) {
    console.error("Error fetching stocks:", error);
    res.status(500).json({ message: "Failed to fetch stocks" });
  }
};

const getHistoricalData = async (req, res) => {
  try {
    const stockId = req.params.id;

    const historicalData = await HistoricalStockData.find({
      stock_id: stockId,
    }).sort({ date: 1 });

    const formattedData = historicalData.map((data) => ({
      date: data.date.toISOString().split("T")[0],
      open: data.open,
      close: data.close,
      low: data.low,
      high: data.high,
      volume: data.volume,
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    console.error("Error fetching historical data:", error);
    res.status(500).json({ message: "Failed to fetch historical data" });
  }
};

const predictStock = async (req, res) => {
  try {
    const { ticker } = req.query;

    if (!ticker) {
      return res.status(400).json({ error: "Ticker is required" });
    }

    // Call Flask API to predict stock price
    const response = await axios.get(
      `http://127.0.0.1:5000/predict?ticker=${ticker}`
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error predicting stock:", error);
    res.status(500).json({ error: "Failed to predict stock price" });
  }
};

module.exports = {
  createStock,
  getAllStocks,
  getStockById,
  updateStock,
  deleteStock,
  upload,
  getStocks,
  getHistoricalData,
  predictStock,
};
