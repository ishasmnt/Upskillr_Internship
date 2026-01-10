const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { roleCheck } = require("../middleware/roleMiddleware");
const {
  getCourses,
  createCourse,
} = require("../controllers/courseController");

router.get("/", getCourses);
router.post("/", protect, roleCheck(["instructor"]), createCourse);

module.exports = router;
