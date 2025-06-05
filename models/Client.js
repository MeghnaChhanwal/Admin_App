const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    name: String,
    mobileNumber: {
      type: String,
      required: true,
      unique: true // optional, ensures no duplicate entries
    },
    email: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
);

module.exports = mongoose.model("Client", clientSchema);
