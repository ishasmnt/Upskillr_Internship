const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema);