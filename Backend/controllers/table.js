const Table = require("../models/Table");

// Get all tables
exports.getTables = async (req, res) => {
  try {
    const tables = await Table.find();
    res.json(tables);
  } catch (err) {
    console.error("Error fetching tables:", err);
    res.status(500).json({ error: "Failed to fetch tables" });
  }
};

// Create a new table
exports.createTable = async (req, res) => {
  try {
    const { name, chairs } = req.body;
    if (!name || !chairs) {
      return res.status(400).json({ error: "Name and chairs are required" });
    }

    const table = new Table({
      name,
      chairs,
      isReserved: false, // default
    });

    await table.save();
    res.status(201).json(table);
  } catch (err) {
    console.error("Error creating table:", err);
    res.status(500).json({ error: "Failed to create table" });
  }
};

// Update a table
exports.updateTable = async (req, res) => {
  try {
    const updated = await Table.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ error: "Table not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Error updating table:", err);
    res.status(500).json({ error: "Failed to update table" });
  }
};

// Delete a table
exports.deleteTable = async (req, res) => {
  try {
    const deleted = await Table.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Table not found" });
    }

    res.json({ message: "Table deleted" });
  } catch (err) {
    console.error("Error deleting table:", err);
    res.status(500).json({ error: "Failed to delete table" });
  }
};
