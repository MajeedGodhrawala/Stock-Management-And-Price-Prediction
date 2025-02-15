const express = require("express");
const {
  createStock,
  getAllStocks,
  getStockById,
  updateStock,
  deleteStock,
  upload,
} = require("./stockController.js");
const { stockValidationRules } = require("./validators.js");
const protect = require("../../middlewares/authMiddleware.js");

const router = express.Router();

router.post("/", protect, upload, stockValidationRules, createStock);
router.get("/", protect, getAllStocks);
router.get("/:id", protect, getStockById);
router.put("/:id", protect, upload, stockValidationRules, updateStock);
router.delete("/:id", protect, deleteStock);

module.exports = router;
