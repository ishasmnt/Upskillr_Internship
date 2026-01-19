// backend/controllers/userController.js
const User = require('../models/User');

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, location, website } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (website !== undefined) user.website = website;

    await user.save();

    // Return user without password
    const updatedUser = await User.findById(user._id).select('-password');
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user stats
// @route   GET /api/users/stats
// @access  Private
exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    let stats = {};

    if (userRole === 'learner') {
      const Enrollment = require('../models/Enrollment');
      
      const enrollments = await Enrollment.find({ user: userId });
      const completedCourses = enrollments.filter(e => e.progress === 100).length;
      const totalHours = enrollments.length * 5; // Estimated
      
      stats = {
        coursesEnrolled: enrollments.length,
        coursesCompleted: completedCourses,
        hoursLearned: totalHours,
        certificates: completedCourses,
        currentStreak: 0 // Can be calculated based on activity
      };
    } else if (userRole === 'instructor') {
      const Course = require('../models/Course');
      
      const courses = await Course.find({ instructor: userId });
      const totalStudents = courses.reduce((sum, course) => sum + (course.students || 0), 0);
      const avgRating = courses.length > 0
        ? courses.reduce((sum, c) => sum + (c.rating || 0), 0) / courses.length
        : 0;
      
      stats = {
        coursesCreated: courses.length,
        totalStudents: totalStudents,
        averageRating: avgRating.toFixed(1),
        totalRevenue: '₹0' // Placeholder
      };
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};