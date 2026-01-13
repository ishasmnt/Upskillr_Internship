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

router.get("/:courseId", protect, getModules);
router.post("/:courseId", protect, roleCheck(["instructor"]), createModule);
router.put("/:id", protect, roleCheck(["instructor"]), updateModule);
router.delete("/:id", protect, roleCheck(["instructor"]), deleteModule);

module.exports = router;