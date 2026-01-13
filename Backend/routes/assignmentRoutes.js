const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { roleCheck } = require("../middleware/roleMiddleware");
const {
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
} = require("../controllers/assignmentController");

router.get("/:courseId", protect, getAssignments);
router.post("/:courseId", protect, roleCheck(["instructor"]), createAssignment);
router.put("/:id", protect, roleCheck(["instructor"]), updateAssignment);
router.delete("/:id", protect, roleCheck(["instructor"]), deleteAssignment);

module.exports = router;