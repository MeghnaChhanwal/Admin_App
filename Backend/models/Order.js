const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  cartItems: Array,
  user: {
    name: String,
    mobile: String,
    address: String,
  },
  orderType: String,
  totalPrepTime: Number,
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: 'processing' },
  chef: String,
  tableName: String,
});

module.exports = mongoose.model('Order', OrderSchema);
