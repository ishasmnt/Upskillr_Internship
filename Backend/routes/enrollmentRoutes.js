const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { roleCheck } = require('../middleware/roleMiddleware');
const { getEnrollments, updateProgress } = require('../controllers/enrollmentController');
const router = express.Router();

router.get('/', protect, roleCheck(['learner']), getEnrollments);
router.put('/:courseId/progress', protect, roleCheck(['learner']), updateProgress);

module.exports = router;