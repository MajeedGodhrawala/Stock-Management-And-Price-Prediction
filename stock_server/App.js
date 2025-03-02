const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const usersRoutes = require("./modules/users/routes");
const stocksRoutes = require("./modules/stocks/routes");
const userStocksRoutes = require("./modules/stocks/stockRoutes");
const dashboardRoutes = require("./modules/admin_dashboard/routes");
const userDashboardRoutes = require("./modules/user_dashboard/routes");
const twilio = require("twilio");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/users", usersRoutes);
app.use("/api/stocks", stocksRoutes);
app.use("/api/user-stocks", userStocksRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/user-dashboard", userDashboardRoutes);

// Twilio Client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected Successfully!"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
