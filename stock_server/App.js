const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const usersRoutes = require("./modules/users/routes");

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/users", usersRoutes);

// MongoDB Connection with Logging
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected Successfully!"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Event Listeners to Log DB Status
mongoose.connection.on("connected", () => {
  console.log("MongoDB Connection Established");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB Connection Error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB Disconnected. Reconnecting...");
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
