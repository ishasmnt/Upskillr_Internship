const mongoose = require('mongoose');

const assignmentSubmissionSchema = new mongoose.Schema({
  assignment: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Assignment', 
    required: true 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  text: {
    type: String,
    default: ''
  },
  file: {
    originalName: String,
    path: String,
    size: Number
  },
  grade: {
    type: Number,
    default: null
  },
  feedback: {
    type: String,
    default: null
  },
  submittedAt: { 
    type: Date, 
    default: Date.now 
  },
}, { timestamps: true });

module.exports = mongoose.model('AssignmentSubmission', assignmentSubmissionSchema);