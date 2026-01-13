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

router.get("/", getCourses);
router.get("/instructor/my-courses", protect, roleCheck(["instructor"]), getInstructorCourses);
router.get("/:id", getCourseById);
router.post("/", protect, roleCheck(["instructor"]), createCourse);
router.put("/:id", protect, roleCheck(["instructor"]), updateCourse);
router.delete("/:id", protect, roleCheck(["instructor"]), deleteCourse);

module.exports = router;