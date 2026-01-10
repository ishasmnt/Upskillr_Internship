const express = require('express');
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const { roleCheck } = require('../middleware/roleMiddleware');
const { getNotes, createNote, updateNote, deleteNote } = require('../controllers/noteController');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.get('/:courseId', protect, getNotes);
router.post('/:courseId', protect, roleCheck(['instructor']), upload.single('file'), createNote);
router.put('/:id', protect, roleCheck(['instructor']), updateNote);
router.delete('/:id', protect, roleCheck(['instructor']), deleteNote);

module.exports = router;