const mongoose = require("mongoose");

const chefSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  orderCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model("Chef", chefSchema);
