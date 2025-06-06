const express = require("express");
const router = express.Router();
const Chef = require("../models/Chef");

// GET all chefs
router.get("/", async (req, res) => {
  try {
    const chefs = await Chef.find();
    res.json(chefs);
  } catch (error) {
    console.error("Error fetching chefs:", error);
    res.status(500).json({ message: "Failed to fetch chefs" });
  }
});

module.exports = router;
