// server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Load .env before using any env variable

// Routes
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

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is undefined. Check your .env file.");
  process.exit(1); // Exit if URI is missing
}

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true, // Optional, now deprecated
  useUnifiedTopology: true, // Optional, now deprecated
})
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Routes
app.use("/api/tables", tableRoutes);
app.use("/api/orders", orderRoutes);         // Optional
app.use("/api/chefs", chefRoutes);           // Optional
app.use("/api/dashboard", dashboardRoutes);  // Optional

// Health check
app.get("/", (req, res) => {
  res.send("🚀 Table Management Backend Running");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started at http://localhost:${PORT}`);
});
