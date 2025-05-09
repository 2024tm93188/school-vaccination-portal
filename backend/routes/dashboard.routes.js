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

/**
 * @swagger
 * /dashboard/report:
 *   get:
 *     summary: Generate vaccination report
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: vaccineName
 *         schema:
 *           type: string
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: class
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Paginated vaccination report
 */
router.get('/report', dashboardController.generateReport);

module.exports = router;
