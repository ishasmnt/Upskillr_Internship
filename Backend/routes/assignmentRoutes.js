const express = require("express");
const router = express.Router();

router.get("/:courseId", (req, res) => {
  res.json({ message: "Assignments fetched" });
});

module.exports = router;
