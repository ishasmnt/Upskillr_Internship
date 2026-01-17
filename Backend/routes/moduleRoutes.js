const express = require("express");
const { videoStorage } = require("../config/cloudinary");
const multer = require("multer");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { roleCheck } = require("../middleware/roleMiddleware");
const {
  getModules,
  createModule,
  updateModule,
  deleteModule,
  streamVideo,
} = require("../controllers/moduleController");

// Configure multer with Cloudinary storage
const upload = multer({
  storage: videoStorage,
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB max file size
});

// Public routes
router.get("/:courseId", getModules);
router.get("/:moduleId/stream", streamVideo); // Video streaming endpoint

// Protected routes - only instructors can create/update/delete
router.post("/:courseId", protect, roleCheck(["instructor"]), upload.single("video"), createModule);
router.put("/:id", protect, roleCheck(["instructor"]), upload.single("video"), updateModule);
router.delete("/:id", protect, roleCheck(["instructor"]), deleteModule);

module.exports = router;