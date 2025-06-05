const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order");

// GET सर्व ऑर्डर्स
router.get("/", orderController.getOrders);

// POST नवीन ऑर्डर तयार करणे
router.post("/", orderController.createOrder);

// PUT ऑर्डर अपडेट करणे
router.put("/:id", orderController.updateOrder);

// DELETE ऑर्डर हटवणे
router.delete("/:id", orderController.deleteOrder);

module.exports = router;
