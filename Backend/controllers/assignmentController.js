const Assignment = require('../models/Assignment');
const Course = require('../models/Course');
const AssignmentSubmission = require('../models/AssignmentSubmission.js');

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
      course: req.params.courseId, 
      title, 
      description, 
      dueDate, 
      totalMarks, 
      type, 
      instructions,
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

// Submit assignment endpoint
exports.submitAssignment = async (req, res) => {
  try {
    const { text } = req.body;
    const { assignmentId } = req.params;

    // Validate that either text or file is provided
    if (!text && !req.file) {
      return res.status(400).json({ message: 'Submission text or file is required' });
    }

    // Check if already submitted
    const existingSubmission = await AssignmentSubmission.findOne({
      assignment: assignmentId,
      user: req.user._id
    });

    if (existingSubmission) {
      return res.status(400).json({ message: 'You have already submitted this assignment' });
    }

    // Create submission
    const submission = await AssignmentSubmission.create({
      assignment: assignmentId,
      user: req.user._id,
      text: text || '',
      file: req.file ? {
        originalName: req.file.originalname,
        path: req.file.path,
        size: req.file.size
      } : null,
      submittedAt: new Date()
    });

    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// NEW: Get submissions for an assignment (Instructor)
exports.getAssignmentSubmissions = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    
    const submissions = await AssignmentSubmission.find({ assignment: assignmentId })
      .populate('user', 'name email')
      .populate('assignment', 'title totalMarks')
      .sort({ submittedAt: -1 });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// NEW: Get learner's submission for an assignment
exports.getMySubmission = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    
    const submission = await AssignmentSubmission.findOne({
      assignment: assignmentId,
      user: req.user._id
    }).populate('assignment', 'title totalMarks dueDate');

    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// NEW: Grade a submission (Instructor)
exports.gradeSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { grade, feedback } = req.body;

    const submission = await AssignmentSubmission.findById(submissionId)
      .populate('assignment');

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Verify instructor owns the course
    const assignment = await Assignment.findById(submission.assignment._id).populate('course');
    const course = await Course.findById(assignment.course);
    
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    submission.grade = grade;
    submission.feedback = feedback;
    await submission.save();

    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};