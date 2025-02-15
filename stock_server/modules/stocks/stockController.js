const Stock = require("./stockModel.js");
const HistoricalStockData = require("./historicalStockDataModel.js");
const { validationResult } = require("express-validator");
const multer = require("multer");
const path = require("path");
const XLSX = require("xlsx");

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
      console.log("Excel File Path:", filePath); // Log the file path

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
    const data = XLSX.utils.sheet_to_json(sheet);

    console.log("Excel Data:", data);

    const historicalData = data.map((row) => ({
      stock_id: stockId,
      date: new Date(row.Date),
      open: row.Open,
      high: row.High,
      low: row.Low,
      close: row.Close,
      volume: row.Volume,
    }));

    console.log("Processed Historical Data:", historicalData);

    return historicalData;
  } catch (error) {
    console.error("Error processing Excel file:", error);
    throw error;
  }
};

module.exports = {
  createStock,
  getAllStocks,
  getStockById,
  updateStock,
  deleteStock,
  upload,
};
