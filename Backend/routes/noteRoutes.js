const express = require('express');
const multer = require('multer');
const { documentStorage } = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware');
const { roleCheck } = require('../middleware/roleMiddleware');
const Note = require('../models/Note');

const { 
  getNotes, 
  createNote, 
  updateNote, 
  deleteNote, 
  downloadNote,
  previewNote  // NEW
} = require('../controllers/noteController');
const router = express.Router();

// Add this route for incrementing download count
router.post('/:noteId/increment-download', protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.noteId);
    if (note) {
      note.downloads += 1;
      await note.save();
      res.json({ downloads: note.downloads });
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Use Cloudinary storage for documents
const upload = multer({ 
  storage: documentStorage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB max
});

// Public route - anyone can view notes
router.get('/:courseId', getNotes);

// Protected routes - only instructors can create/update/delete
router.post('/:courseId', protect, roleCheck(['instructor']), upload.single('file'), createNote);
router.put('/:id', protect, roleCheck(['instructor']), updateNote);
router.delete('/:id', protect, roleCheck(['instructor']), deleteNote);

// Download route - learners can download notes
router.get('/:noteId/download', protect, downloadNote);

// NEW: Preview route
router.get('/:noteId/preview', protect, previewNote);

module.exports = router;