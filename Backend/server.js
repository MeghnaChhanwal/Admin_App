const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

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
mongoose.connect("mongodb://localhost:27017/User", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
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
