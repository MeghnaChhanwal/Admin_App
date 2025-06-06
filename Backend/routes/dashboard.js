const express = require('express');
const router = express.Router();
const { getDashboardData } = require('../controllers/dashboard');

router.get('/api/order', getDashboardData);

module.exports = router;
