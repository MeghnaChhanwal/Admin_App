const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  name: String,
  chairs: Number,
  status: {
    type: String,
    enum: ["available", "reserved"],
    default: "available",
  },
});

module.exports = mongoose.model("Table", tableSchema);
