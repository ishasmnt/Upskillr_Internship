const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: Date,
  totalMarks: Number,
  type: { type: String, default: 'Written' },
  instructions: String,
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);