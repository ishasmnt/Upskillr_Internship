const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  videoUrl: String,
  duration: String,
  resources: [String], // Array of resource names
}, { timestamps: true });

module.exports = mongoose.model('Module', moduleSchema);