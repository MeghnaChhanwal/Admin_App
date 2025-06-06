const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  username: String,
  phone: String,
});

module.exports = mongoose.model("Client", clientSchema);
