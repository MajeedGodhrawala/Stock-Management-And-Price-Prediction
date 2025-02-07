const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    gender: { type: String, required: true, enum: ["0", "1"] },
    dob: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    created_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
