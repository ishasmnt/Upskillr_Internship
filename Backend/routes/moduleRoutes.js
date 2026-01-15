const express = require("express");
const { videoStorage } = require("../config/cloudinary");
const multer = require("multer");
const path = require("path");
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

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/videos/');
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'video-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept video files only
  const allowedTypes = /mp4|avi|mkv|mov|wmv|flv|webm/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only video files are allowed!'));
  }
};

const upload = multer({
  storage: videoStorage,
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB
});

// Public routes
router.get("/:courseId", getModules);
router.get("/:moduleId/stream", streamVideo); // Video streaming endpoint

// Protected routes - only instructors can create/update/delete
router.post("/:courseId", protect, roleCheck(["instructor"]), upload.single("video"), createModule);
router.put("/:id", protect, roleCheck(["instructor"]), upload.single("video"), updateModule);
router.delete("/:id", protect, roleCheck(["instructor"]), deleteModule);

module.exports = router;