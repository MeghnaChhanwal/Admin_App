const Table = require("../models/Table");

exports.getTables = async (req, res) => {
  try {
    const tables = await Table.find();
    res.json(tables);
  } catch (err) {
    console.error("Error fetching tables:", err);
    res.status(500).json({ message: "Failed to fetch tables" });
  }
};

exports.createTable = async (req, res) => {
  try {
    const { name, chairs } = req.body;
    const table = new Table({ name, chairs, status: "available" });
    await table.save();
    res.status(201).json(table);
  } catch (err) {
    console.error("Error creating table:", err);
    res.status(400).json({ message: "Failed to create table" });
  }
};

exports.updateTable = async (req, res) => {
  try {
    const updated = await Table.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error("Error updating table:", err);
    res.status(400).json({ message: "Failed to update table" });
  }
};

exports.deleteTable = async (req, res) => {
  try {
    await Table.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    console.error("Error deleting table:", err);
    res.status(500).json({ message: "Failed to delete table" });
  }
};
