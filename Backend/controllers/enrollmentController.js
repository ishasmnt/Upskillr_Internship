// backend/controllers/enrollmentController.js
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// @desc    Get user's enrollments
// @route   GET /api/enrollments
// @access  Private/Learner
exports.getEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id })
      .populate({
        path: 'course',
        populate: [
          { path: 'instructor', select: 'name email' },
          { path: 'modules' },
          { path: 'assignments' },
          { path: 'notes' }
        ]
      });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Enroll in a course
// @route   POST /api/enrollments/:courseId
// @access  Private/Learner
exports.enrollInCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      user: req.user._id,
      course: req.params.courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    const enrollment = await Enrollment.create({
      user: req.user._id,
      course: req.params.courseId,
    });

    // Increment student count
    course.students += 1;
    await course.save();

    const populatedEnrollment = await Enrollment.findById(enrollment._id)
      .populate('course');

    res.status(201).json(populatedEnrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update course progress
// @route   PUT /api/enrollments/:courseId/progress
// @access  Private/Learner
exports.updateProgress = async (req, res) => {
  const { progress, currentLesson, completedLessons } = req.body;
  
  try {
    const enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: req.params.courseId
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    if (progress !== undefined) enrollment.progress = progress;
    if (currentLesson !== undefined) enrollment.currentLesson = currentLesson;
    if (completedLessons !== undefined) enrollment.completedLessons = completedLessons;

    await enrollment.save();
    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get course progress
// @route   GET /api/enrollments/:courseId/progress
// @access  Private/Learner
exports.getCourseProgress = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: req.params.courseId
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Not enrolled in this course' });
    }

    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};