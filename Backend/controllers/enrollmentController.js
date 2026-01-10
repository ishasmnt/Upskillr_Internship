const Enrollment = require('../models/Enrollment');

exports.getEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id }).populate('course');
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProgress = async (req, res) => {
  const { progress, currentLesson, completedLessons } = req.body;
  try {
    const enrollment = await Enrollment.findOne({ user: req.user._id, course: req.params.courseId });
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });
    enrollment.progress = progress;
    enrollment.currentLesson = currentLesson;
    enrollment.completedLessons = completedLessons;
    await enrollment.save();
    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};