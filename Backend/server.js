const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// Routes
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const moduleRoutes = require("./routes/moduleRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const noteRoutes = require("./routes/noteRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");

dotenv.config();
connectDB();
require("./config/cloudinary");

const app = express();
const server = http.createServer(app);

// ===================== UPLOAD DIRECTORIES =====================
const uploadsDir = path.join(__dirname, "uploads");
const videosDir = path.join(__dirname, "uploads/videos");

// ✅ SAFE FOR RENDER
fs.mkdirSync(uploadsDir, { recursive: true });
fs.mkdirSync(videosDir, { recursive: true });

// ===================== ALLOWED ORIGINS =====================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:3001",
  "https://upskillr-internship-fc3s.vercel.app",
  "https://upskillr-internship-dn8v.vercel.app"
];

// ===================== SOCKET.IO CONFIG =====================
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  }
});

// ===================== CORS CONFIG =====================
const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (mobile apps, curl, server-side)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked: ${origin}`), false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200
};

// ✅ APPLY CORS CORRECTLY
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// ===================== MIDDLEWARE =====================
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// 🔥 Logging
app.use(morgan("dev"));

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// ===================== ROUTES =====================
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/feedback", feedbackRoutes);

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Upskillr Backend is running 🚀"
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use(errorHandler);

// ===================== SOCKET EVENTS =====================
io.on("connection", (socket) => {
  console.log(`✨ User connected: ${socket.id}`);

  socket.on("join-course", (courseId) => {
    socket.join(`course-${courseId}`);
    console.log(`📚 User joined course: ${courseId}`);
  });

  socket.on("leave-course", (courseId) => {
    socket.leave(`course-${courseId}`);
    console.log(`👋 User left course: ${courseId}`);
  });

  socket.on("course-created", (course) => {
    io.emit("new-course", course);
    console.log(`🆕 New course created: ${course.title}`);
  });

  socket.on("course-updated", (course) => {
    io.to(`course-${course._id}`).emit("course-updated", course);
    console.log(`✏️ Course updated: ${course.title}`);
  });

  socket.on("module-added", (data) => {
    io.to(`course-${data.courseId}`).emit("module-added", data.module);
    console.log("📖 Module added to course");
  });

  socket.on("assignment-created", (data) => {
    io.to(`course-${data.courseId}`).emit("assignment-created", data.assignment);
    console.log("📋 Assignment created");
  });

  socket.on("assignment-submitted", (data) => {
    io.to(`course-${data.courseId}`).emit("assignment-submitted", data);
    console.log("✅ Assignment submitted");
  });

  socket.on("note-uploaded", (data) => {
    io.to(`course-${data.courseId}`).emit("note-uploaded", data.note);
    console.log("📄 Note uploaded");
  });

  socket.on("user-enrolled", (data) => {
    io.to(`course-${data.courseId}`).emit("student-enrolled", {
      courseId: data.courseId,
      timestamp: new Date()
    });
    console.log("🎓 Student enrolled");
  });

  socket.on("progress-updated", (data) => {
    io.to(`course-${data.courseId}`).emit("progress-updated", data);
    console.log("📊 Progress updated");
  });

  socket.on("feedback-submitted", (data) => {
    io.to(`course-${data.courseId}`).emit("feedback-submitted", data);
    console.log("💬 Feedback submitted");
  });

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

// ===================== SERVER START =====================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📹 Video uploads directory: ${videosDir}`);
});
