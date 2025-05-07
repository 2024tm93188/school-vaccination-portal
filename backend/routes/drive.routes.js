const express = require('express');
const driveController = require('../controllers/drive.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     VaccinationDrive:
 *       type: object
 *       required:
 *         - vaccineName
 *         - date
 *         - availableDoses
 *         - applicableClasses
 *       properties:
 *         vaccineName:
 *           type: string
 *         date:
 *           type: string
 *           format: date
 *         availableDoses:
 *           type: integer
 *           minimum: 1
 *         applicableClasses:
 *           type: array
 *           items:
 *             type: string
 *         status:
 *           type: string
 *           enum: [Scheduled, Completed, Cancelled]
 *         createdBy:
 *           type: string
 *           description: ObjectId of the user who created the drive
 */

/**
 * @swagger
 * tags:
 *   name: Vaccination Drives
 *   description: Managing vaccination drives
 */

/**
 * @swagger
 * /drives:
 *   get:
 *     summary: Get all vaccination drives
 *     tags: [Vaccination Drives]
 *     responses:
 *       200:
 *         description: List of vaccination drives
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VaccinationDrive'
 */
router.get('/', driveController.getAllDrives);

/**
 * @swagger
 * /drives/{id}:
 *   get:
 *     summary: Get a vaccination drive by ID
 *     tags: [Vaccination Drives]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vaccination drive details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VaccinationDrive'
 */
router.get('/:id', driveController.getDriveById);

/**
 * @swagger
 * /drives:
 *   post:
 *     summary: Create a new vaccination drive
 *     tags: [Vaccination Drives]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VaccinationDrive'
 *     responses:
 *       201:
 *         description: Vaccination drive created
 */
router.post('/', driveController.createDrive);

/**
 * @swagger
 * /drives/{id}:
 *   put:
 *     summary: Update a vaccination drive
 *     tags: [Vaccination Drives]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VaccinationDrive'
 *     responses:
 *       200:
 *         description: Vaccination drive updated
 */
router.put('/:id', driveController.updateDrive);

/**
 * @swagger
 * /drives/{id}/cancel:
 *   patch:
 *     summary: Cancel a vaccination drive
 *     tags: [Vaccination Drives]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vaccination drive cancelled
 */
router.patch('/:id/cancel', driveController.cancelDrive);

/**
 * @swagger
 * /drives/{id}/complete:
 *   patch:
 *     summary: Mark a vaccination drive as completed
 *     tags: [Vaccination Drives]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vaccination drive marked as completed
 */
router.patch('/:id/complete', driveController.completeDrive);

/**
 * @swagger
 * /drives/{id}/students:
 *   get:
 *     summary: Get students for a specific vaccination drive
 *     tags: [Vaccination Drives]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vaccination drive ID
 *     responses:
 *       200:
 *         description: List of students for the drive
 */
router.get('/:id/students', driveController.getDriveStudents);

module.exports = router;
