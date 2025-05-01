const express = require('express');
const authController = require('../controllers/auth.controller');
const router = express.Router();

// Login route
router.post('/login', authController.login);

// Register route (for development purposes)
router.post('/register', authController.register);

module.exports = router;



