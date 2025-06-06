const Order = require("../models/Order");
const Table = require("../models/Table");
const Chef = require("../models/Chef");

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("table").populate("chef").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

exports.createOrder = async (req, res) => {
  try {
    // your create order logic here
  } catch (err) {
    res.status(500).json({ message: "Failed to create order" });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    // your update order logic here
  } catch (err) {
    res.status(500).json({ message: "Failed to update order" });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    // your delete order logic here
  } catch (err) {
    res.status(500).json({ message: "Failed to delete order" });
  }
};