const Table = require("../models/Table");

exports.getTables = async (req, res) => {
  try {
    const tables = await Table.find();
    res.json(tables);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tables" });
  }
};

exports.createTable = async (req, res) => {
  try {
    const { name, chairs } = req.body;
    const table = new Table({ name, chairs });
    await table.save();
    res.status(201).json(table);
  } catch (err) {
    res.status(500).json({ error: "Failed to create table" });
  }
};

exports.updateTable = async (req, res) => {
  try {
    const updated = await Table.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update table" });
  }
};

exports.deleteTable = async (req, res) => {
  try {
    await Table.findByIdAndDelete(req.params.id);
    res.json({ message: "Table deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete table" });
  }
};
