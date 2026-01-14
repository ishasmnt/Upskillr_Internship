const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { roleCheck } = require("../middleware/roleMiddleware");
const {
  getModules,
  createModule,
  updateModule,
  deleteModule,
} = require("../controllers/moduleController");

// Public route - learners and anyone can view modules
router.get("/:courseId", getModules);

// Protected routes - only instructors can create/update/delete
router.post("/:courseId", protect, roleCheck(["instructor"]), createModule);
router.put("/:id", protect, roleCheck(["instructor"]), updateModule);
router.delete("/:id", protect, roleCheck(["instructor"]), deleteModule);

module.exports = router;