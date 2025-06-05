const mongoose = require("mongoose");

const chefSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model("Chef", chefSchema);
