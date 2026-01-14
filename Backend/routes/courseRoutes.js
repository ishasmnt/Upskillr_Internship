const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { roleCheck } = require("../middleware/roleMiddleware");
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getInstructorCourses,
} = require("../controllers/courseController");

// Public routes
router.get("/", getCourses);

// Specific routes MUST come before generic :id routes
router.get("/instructor/my-courses", protect, roleCheck(["instructor"]), getInstructorCourses);

// Generic routes
router.get("/:id", getCourseById);
router.post("/", protect, roleCheck(["instructor"]), createCourse);
router.put("/:id", protect, roleCheck(["instructor"]), updateCourse);
router.delete("/:id", protect, roleCheck(["instructor"]), deleteCourse);

module.exports = router;