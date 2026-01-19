const express = require("express");
const multer = require("multer");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { roleCheck } = require("../middleware/roleMiddleware");
const {
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  getAssignmentSubmissions,
  getMySubmission,
  gradeSubmission,
} = require("../controllers/assignmentController");

const upload = multer({ dest: 'uploads/' });

// Public route - learners and anyone can view assignments
router.get("/:courseId", getAssignments);

// Protected routes - only instructors can create/update/delete
router.post("/:courseId", protect, roleCheck(["instructor"]), createAssignment);
router.put("/:id", protect, roleCheck(["instructor"]), updateAssignment);
router.delete("/:id", protect, roleCheck(["instructor"]), deleteAssignment);

// Learner submission routes
router.post("/:assignmentId/submit", protect, roleCheck(["learner"]), upload.single("file"), submitAssignment);
router.get("/:assignmentId/my-submission", protect, roleCheck(["learner"]), getMySubmission);

// Instructor routes - view and grade submissions
router.get("/:assignmentId/submissions", protect, roleCheck(["instructor"]), getAssignmentSubmissions);
router.put("/submissions/:submissionId/grade", protect, roleCheck(["instructor"]), gradeSubmission);

module.exports = router;