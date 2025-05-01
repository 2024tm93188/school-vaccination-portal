const express = require('express');
const studentController = require('../controllers/student.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const router = express.Router();

// Get all students with optional filters
router.get('/', authMiddleware, studentController.getAllStudents);

// Get student by ID
router.get('/:id', authMiddleware, studentController.getStudentById);

// Create new student
router.post('/', authMiddleware, studentController.createStudent);

// Update student
router.put('/:id', authMiddleware, studentController.updateStudent);

// Delete student
router.delete('/:id', authMiddleware, studentController.deleteStudent);

// Bulk import students via CSV
router.post('/import', authMiddleware, upload.single('file'), studentController.importStudents);

// Mark student as vaccinated
router.post('/:id/vaccinate', authMiddleware, studentController.vaccinateStudent);

module.exports = router;