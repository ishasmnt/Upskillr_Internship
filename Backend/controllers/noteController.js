const Note = require('../models/Note');
const Course = require('../models/Course');
const axios = require('axios');

// Get all notes for a course
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ course: req.params.courseId });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create note with file upload to Cloudinary
exports.createNote = async (req, res) => {
  const { title, description, category } = req.body;
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course || course.instructor.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Course not found or unauthorized' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'File is required' });
    }

    const note = await Note.create({
      course: req.params.courseId, 
      title, 
      description, 
      category,
      fileName: req.file.originalname,
      filePath: req.file.path, // Cloudinary URL
      fileSize: `${(req.file.size / 1024).toFixed(2)} KB`,
    });
    
    course.notes.push(note._id);
    await course.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update note
exports.updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    Object.assign(note, req.body);
    await note.save();
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete note
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Download note - FIXED VERSION
exports.downloadNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.noteId);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Increment downloads counter
    note.downloads += 1;
    await note.save();

    // Fetch file from Cloudinary
    const response = await axios({
      method: 'GET',
      url: note.filePath,
      responseType: 'stream'
    });

    // Set headers for download
    res.setHeader('Content-Type', response.headers['content-type']);
    res.setHeader('Content-Disposition', `attachment; filename="${note.fileName}"`);

    // Pipe the file to response
    response.data.pipe(res);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: error.message });
  }
};

// NEW: Preview note (view in browser)
exports.previewNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.noteId);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Return Cloudinary URL for preview
    res.json({ 
      url: note.filePath,
      fileName: note.fileName,
      fileSize: note.fileSize
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};