const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const mongoose = require('mongoose');

router.post('/submit', async (req, res) => {
  // 1. Log immediately so you see it in VS Code terminal
  console.log("------------------------------------");
  console.log("📩 NEW FEEDBACK RECEIVED:");
  console.log("Data:", req.body); 
  console.log("------------------------------------");

  try {
    // 2. Only attempt DB save if the connection is actually 'Connected' (1)
    if (mongoose.connection.readyState === 1) {
      const newFeedback = new Feedback(req.body);
      await newFeedback.save();
      return res.status(201).json({ message: "Saved to MongoDB!" });
    } else {
      // 3. If DB is offline, we still send 'Success' so React doesn't show an error
      console.log("⚠️ DB Offline: Logging to console only.");
      return res.status(200).json({ message: "Logged in terminal (DB Offline)" });
    }
  } catch (error) {
    console.error("❌ Route Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;