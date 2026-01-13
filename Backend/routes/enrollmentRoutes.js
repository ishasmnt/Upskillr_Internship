const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { roleCheck } = require('../middleware/roleMiddleware');
const {
  getEnrollments,
  enrollInCourse,
  updateProgress,
  getCourseProgress,
} = require('../controllers/enrollmentController');
const router = express.Router();

router.get('/', protect, roleCheck(['learner']), getEnrollments);
router.post('/:courseId', protect, roleCheck(['learner']), enrollInCourse);
router.put('/:courseId/progress', protect, roleCheck(['learner']), updateProgress);
router.get('/:courseId/progress', protect, roleCheck(['learner']), getCourseProgress);

module.exports = router;