// Backend/routes/chef.js
const express = require("express");
const router = express.Router();
const chefController = require("../controllers/chef");

router.get("/", chefController.getChefs);
router.post("/", chefController.createChef);

module.exports = router;
