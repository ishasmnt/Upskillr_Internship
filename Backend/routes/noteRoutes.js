const express = require('express');
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const { roleCheck } = require('../middleware/roleMiddleware');
const { getNotes, createNote, updateNote, deleteNote, downloadNote } = require('../controllers/noteController');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

// Public route - anyone can view notes
router.get('/:courseId', getNotes);

// Protected routes - only instructors can create/update/delete
router.post('/:courseId', protect, roleCheck(['instructor']), upload.single('file'), createNote);
router.put('/:id', protect, roleCheck(['instructor']), updateNote);
router.delete('/:id', protect, roleCheck(['instructor']), deleteNote);

// Download route - learners can download notes
router.get('/:noteId/download', protect, downloadNote);

module.exports = router;