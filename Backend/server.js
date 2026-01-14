// ============================================
// BACKEND: Install Socket.io
// ============================================
// npm install socket.io

// ============================================
// BACKEND: server/server.js - MODIFIED
// ============================================

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
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

const app = express();
const server = http.createServer(app);

// Socket.io configuration
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// CORS Configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors(corsOptions));
app.use(morgan("dev"));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Routes usage
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/feedback", feedbackRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use(errorHandler);

// ============================================
// SOCKET.IO REAL-TIME EVENTS
// ============================================

io.on('connection', (socket) => {
  console.log(`✨ User connected: ${socket.id}`);

  // User joins a course room
  socket.on('join-course', (courseId) => {
    socket.join(`course-${courseId}`);
    console.log(`📚 User joined course: ${courseId}`);
  });

  // User leaves a course room
  socket.on('leave-course', (courseId) => {
    socket.leave(`course-${courseId}`);
    console.log(`👋 User left course: ${courseId}`);
  });

  // Broadcast when a new course is created
  socket.on('course-created', (course) => {
    io.emit('new-course', course);
    console.log(`🆕 New course created: ${course.title}`);
  });

  // Broadcast when course is updated
  socket.on('course-updated', (course) => {
    io.to(`course-${course._id}`).emit('course-updated', course);
    console.log(`✏️ Course updated: ${course.title}`);
  });

  // Broadcast when a module is added
  socket.on('module-added', (data) => {
    io.to(`course-${data.courseId}`).emit('module-added', data.module);
    console.log(`📝 Module added to course`);
  });

  // Broadcast when assignment is created
  socket.on('assignment-created', (data) => {
    io.to(`course-${data.courseId}`).emit('assignment-created', data.assignment);
    console.log(`📋 Assignment created`);
  });

  // Broadcast when assignment is submitted
  socket.on('assignment-submitted', (data) => {
    io.to(`course-${data.courseId}`).emit('assignment-submitted', data);
    console.log(`✅ Assignment submitted`);
  });

  // Broadcast when note is uploaded
  socket.on('note-uploaded', (data) => {
    io.to(`course-${data.courseId}`).emit('note-uploaded', data.note);
    console.log(`📄 Note uploaded`);
  });

  // Broadcast when user enrolls
  socket.on('user-enrolled', (data) => {
    io.to(`course-${data.courseId}`).emit('student-enrolled', {
      courseId: data.courseId,
      timestamp: new Date()
    });
    console.log(`🎓 Student enrolled`);
  });

  // Broadcast progress update
  socket.on('progress-updated', (data) => {
    io.to(`course-${data.courseId}`).emit('progress-updated', data);
    console.log(`📊 Progress updated`);
  });

  // Broadcast feedback submitted
  socket.on('feedback-submitted', (data) => {
    io.to(`course-${data.courseId}`).emit('feedback-submitted', data);
    console.log(`💬 Feedback submitted`);
  });

  // Disconnect event
  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

// ============================================
// FRONTEND: Install Socket.io Client
// ============================================
// npm install socket.io-client

// ============================================
// FRONTEND: src/services/socket.js - NEW FILE
// ============================================


const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`🔌 Socket.io enabled - Real-time updates active`);
});