const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  name: { type: String, required: true },
  chairs: { type: Number, default: 4 },
  isReserved: { type: Boolean, default: false },
});

module.exports = mongoose.model("Table", tableSchema);
