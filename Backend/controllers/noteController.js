const Note = require('../models/Note');
const Course = require('../models/Course');
const fs = require('fs');
const path = require('path');

exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ course: req.params.courseId });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createNote = async (req, res) => {
  const { title, description, category } = req.body;
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course || course.instructor.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // FIX: Check if file is provided
    if (!req.file) {
      return res.status(400).json({ message: 'File is required' });
    }

    const note = await Note.create({
      course: req.params.courseId, 
      title, 
      description, 
      category,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileSize: `${(req.file.size / 1024).toFixed(2)} KB`,
    });
    course.notes.push(note._id);
    await course.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    // Delete file from server
    if (note.filePath && fs.existsSync(note.filePath)) {
      fs.unlinkSync(note.filePath);
    }

    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// NEW: Download note endpoint
exports.downloadNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.noteId);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Check if file exists
    if (!fs.existsSync(note.filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Increment downloads counter
    note.downloads += 1;
    await note.save();

    // Send file
    res.download(note.filePath, note.fileName);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};