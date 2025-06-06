const express = require("express");
const router = express.Router();
const Table = require("../models/Table");

router.post("/", async (req, res) => {
  try {
    const { tableNumber, reserved } = req.body;
    const table = new Table({ tableNumber, reserved });
    await table.save();
    res.status(201).json(table);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;