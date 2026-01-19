// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { updateProfile, getUserStats } = require('../controllers/userController');

// Protected routes
router.put('/profile', protect, updateProfile);
router.get('/stats', protect, getUserStats);

module.exports = router;