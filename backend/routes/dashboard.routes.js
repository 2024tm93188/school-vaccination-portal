
const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const router = express.Router();

// Get dashboard statistics
router.get('/', dashboardController.getDashboardStats);

// Generate vaccination report
router.get('/report', dashboardController.generateReport);

module.exports = router;