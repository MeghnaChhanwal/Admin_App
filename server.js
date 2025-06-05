// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const tableRoutes = require("./routes/table");
const orderRoutes = require("./routes/order");         // Optional
const chefRoutes = require("./routes/chef");           // Optional
const dashboardRoutes = require("./routes/dashboard"); // Optional

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection URI from environment variable
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/tables", tableRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/chefs", chefRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("🚀 Table Management Backend Running");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started at http://localhost:${PORT}`);
});
