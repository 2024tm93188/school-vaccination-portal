const express = require('express');
const driveController = require('../controllers/drive.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const router = express.Router();

// Get all vaccination drives with optional filters
router.get('/', authMiddleware, driveController.getAllDrives);

// Get vaccination drive by ID
router.get('/:id', authMiddleware, driveController.getDriveById);

// Create new vaccination drive
router.post('/', authMiddleware, driveController.createDrive);

// Update vaccination drive
router.put('/:id', authMiddleware, driveController.updateDrive);

// Cancel vaccination drive
router.patch('/:id/cancel', authMiddleware, driveController.cancelDrive);

// Mark vaccination drive as completed
router.patch('/:id/complete', authMiddleware, driveController.completeDrive);

// Get students for a specific drive
router.get('/:id/students', authMiddleware, driveController.getDriveStudents);

module.exports = router;