const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  description: String,
  fileName: String,
  filePath: String, // Path to uploaded file
  fileSize: String,
  category: { type: String, default: 'Lecture Notes' },
  uploadDate: { type: Date, default: Date.now },
  downloads: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);