const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  
  
  videoFileName: String,
  videoPath: String,        // Path to uploaded video file
  videoSize: String,        // File size in MB
  
  duration: String,
  resources: [String],      
}, { timestamps: true });

module.exports = mongoose.model('Module', moduleSchema);