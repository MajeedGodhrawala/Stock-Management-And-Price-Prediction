const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cors());

// const mongoURI = process.env.MONGO_URI || "your-mongodb-connection-string";
// mongoose
//   .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("API is running");
});

// const PORT = process.env.PORT || 5000;
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
