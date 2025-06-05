const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  cartItems: [
    {
      name: String,
      qty: Number,
      price: Number,
    },
  ],
  user: {
    mobile: String,
    name: String,
  },
  instructions: String,
  orderType: String,
  totalAmount: Number,
  table: { type: mongoose.Schema.Types.ObjectId, ref: "Table" },
  chef: { type: mongoose.Schema.Types.ObjectId, ref: "Chef" },
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
