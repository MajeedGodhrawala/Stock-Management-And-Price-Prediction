const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    short_name: { type: String, required: true, trim: true },
    stock_pic: { type: String, required: true }, 
    created_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Stock", stockSchema);
