// Backend/controllers/chefController.js
const Chef = require("../models/Chef");

exports.getChefs = async (req, res) => {
  try {
    const chefs = await Chef.find();
    res.json(chefs);
  } catch (err) {
    console.error("Error fetching chefs:", err);
    res.status(500).json({ message: "Failed to fetch chefs" });
  }
};

exports.createChef = async (req, res) => {
  try {
    const { name } = req.body;
    const chef = new Chef({ name });
    await chef.save();
    res.status(201).json(chef);
  } catch (err) {
    console.error("Error creating chef:", err);
    res.status(400).json({ message: "Failed to create chef" });
  }
};
