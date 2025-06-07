// server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors());                    // ✅ Allow all origins
app.use(express.json());

// connect to Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB err:", err));

// Example router usage
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/orders", require("./routes/order"));
app.use("/api/tables", require("./routes/table"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
