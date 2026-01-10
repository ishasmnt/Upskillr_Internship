const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

router.get("/:courseId", protect, (req, res) => {
  res.json({ message: "Modules fetched" });
});

module.exports = router;
