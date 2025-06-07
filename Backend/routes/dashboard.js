const express = require("express");
const router  = express.Router();
const ctrl    = require("../controllers/dashboard");

// Dashboard summary
router.get("/", ctrl.getDashboardData);

// Chef management under dashboard
router.get("/chef",                     ctrl.getChefs);
router.post("/chef",                    ctrl.addChef);
router.patch("/chef/:chefId/increment", ctrl.incrementOrderCount);

module.exports = router;
