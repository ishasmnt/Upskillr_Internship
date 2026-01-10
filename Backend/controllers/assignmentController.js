const Assignment = require('../models/Assignment');
const Course = require('../models/Course');

exports.getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ course: req.params.courseId });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createAssignment = async (req, res) => {
  const { title, description, dueDate, totalMarks, type, instructions } = req.body;
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course || course.instructor.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Course not found' });
    }
    const assignment = await Assignment.create({
      course: req.params.courseId, title, description, dueDate, totalMarks, type, instructions,
    });
    course.assignments.push(assignment._id);
    await course.save();
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    Object.assign(assignment, req.body);
    await assignment.save();
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Assignment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};