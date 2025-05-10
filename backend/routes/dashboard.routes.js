const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard statistics and summaries
 */

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Dashboard statistics data
 */
router.get('/', dashboardController.getDashboardStats);

module.exports = router;
