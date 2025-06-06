const mongoose = require('mongoose');

const TableSchema = new mongoose.Schema({
  name: String,
  chairs: Number,
  isReserved: Boolean,
  status: String
});

module.exports = mongoose.model('Table', TableSchema);
