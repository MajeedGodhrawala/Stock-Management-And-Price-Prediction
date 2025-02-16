const mongoose = require("mongoose");

const userStockSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  stock_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stock",
    required: true,
  }, // Reference to the Stock model
  date: { type: Date, required: true },
  qty: { type: Number, required: true },
  purchasePrice: { type: Number, required: true },
});

userStockSchema.index({ user_id: 1, stock_id: 1 }, { unique: true });

module.exports = mongoose.model("UserStock", userStockSchema);
