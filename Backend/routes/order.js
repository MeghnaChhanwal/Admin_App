// /routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// GET /api/orders
router.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders); // data properly send केलं पाहिजे
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
