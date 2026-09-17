const express = require('express');
const router = express.Router();

const { registerUser, loginUser, getMe } = require('../../controllers/auth.controller');
const { protect } = require('../../middleware/auth.middleware');

// Public
router.post('/register', registerUser);
router.post('/login', loginUser);

// Private
router.get('/me', protect, getMe);

module.exports = router;