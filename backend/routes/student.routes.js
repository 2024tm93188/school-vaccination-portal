const express = require('express');
const studentController = require('../controllers/student.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Vaccination:
 *       type: object
 *       properties:
 *         drive:
 *           type: string
 *           description: ObjectId of the vaccination drive
 *         vaccineName:
 *           type: string
 *         dateAdministered:
 *           type: string
 *           format: date
 *         status:
 *           type: string
 *           enum: [Scheduled, Completed, Missed]

 *     Student:
 *       type: object
 *       required:
 *         - name
 *         - studentId
 *         - class
 *         - section
 *         - age
 *         - gender
 *       properties:
 *         name:
 *           type: string
 *         studentId:
 *           type: string
 *         class:
 *           type: string
 *         section:
 *           type: string
 *         age:
 *           type: integer
 *         gender:
 *           type: string
 *           enum: [Male, Female, Other]
 *         vaccinations:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Vaccination'
 */

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Student management
 */

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Get all students
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: List of students
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 */
router.get('/', studentController.getAllStudents);

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Get a student by ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *     responses:
 *       200:
 *         description: Student data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 */
router.get('/:id', studentController.getStudentById);

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Create a new student
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       201:
 *         description: Student created
 */
router.post('/', studentController.createStudent);

/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Update a student
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       200:
 *         description: Student updated
 */
router.put('/:id', studentController.updateStudent);

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Delete a student
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *     responses:
 *       204:
 *         description: Student deleted
 */
router.delete('/:id', studentController.deleteStudent);

/**
 * @swagger
 * /students/import:
 *   post:
 *     summary: Bulk import students via CSV
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Students imported successfully
 */
router.post('/import', upload.single('file'), studentController.importStudents);

/**
 * @swagger
 * /students/{id}/vaccinate:
 *   post:
 *     summary: Mark student as vaccinated
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               drive:
 *                 type: string
 *               vaccineName:
 *                 type: string
 *               dateAdministered:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Vaccination recorded
 */
router.post('/:id/vaccinate', studentController.vaccinateStudent);

module.exports = router;