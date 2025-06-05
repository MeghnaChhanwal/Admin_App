// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // If using .env locally

// Import routes
const tableRoutes = require("./routes/table");
const orderRoutes = require("./routes/order");         // Optional
const chefRoutes = require("./routes/chef");           // Optional
const dashboardRoutes = require("./routes/dashboard"); // Optional

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Route mounting
app.use("/api/tables", tableRoutes);
app.use("/api/orders", orderRoutes);         // Optional
app.use("/api/chefs", chefRoutes);           // Optional
app.use("/api/dashboard", dashboardRoutes);  // Optional

// Health check route
app.get("/", (req, res) => {
  res.send("🚀 Table Management Backend Running");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started at http://localhost:${PORT}`);
});
