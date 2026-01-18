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

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize Cloudinary
require('./config/cloudinary');

const app = express();
const server = http.createServer(app);

// Create uploads directories if they don't exist
const uploadsDir = path.join(__dirname, 'uploads');
const videosDir = path.join(__dirname, 'uploads/videos');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir, { recursive: true });
}

// CORS Configuration - UPDATED FOR PRODUCTION
const getAllowedOrigins = () => {
  if (process.env.NODE_ENV === 'production') {
    // In production, use CORS_ORIGIN from environment variables
    if (process.env.CORS_ORIGIN) {
      return process.env.CORS_ORIGIN.split(',').map(origin => origin.trim());
    }
    return []; // Empty array if not set
  }
  // Development origins
  return ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001'];
};

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = getAllowedOrigins();
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.length === 0) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Socket.io configuration - UPDATED FOR PRODUCTION
const io = socketIo(server, {
  cors: {
    origin: getAllowedOrigins(),
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000
});

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors(corsOptions));

// Logging - only in development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Upskillr Backend is running 🚀",
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "Server is running",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/feedback", feedbackRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: "Route not found",
    path: req.path 
  });
});

// Error handler
app.use(errorHandler);

// Socket.io events
io.on('connection', (socket) => {
  console.log(`✨ User connected: ${socket.id}`);

  // Join course room
  socket.on('join-course', (courseId) => {
    socket.join(`course-${courseId}`);
    console.log(`📚 User ${socket.id} joined course: ${courseId}`);
  });

  // Leave course room
  socket.on('leave-course', (courseId) => {
    socket.leave(`course-${courseId}`);
    console.log(`👋 User ${socket.id} left course: ${courseId}`);
  });

  // User login event
  socket.on('user-login', (data) => {
    console.log(`👤 User logged in: ${data.role} - ${data.userId}`);
    socket.userId = data.userId;
    socket.userRole = data.role;
  });

  // User logout event
  socket.on('user-logout', (data) => {
    console.log(`👋 User logged out: ${data.userId}`);
  });

  // Course created
  socket.on('course-created', (course) => {
    io.emit('new-course', course);
    console.log(`🆕 New course created: ${course.title}`);
  });

  // Course updated
  socket.on('course-updated', (course) => {
    io.to(`course-${course._id}`).emit('course-updated', course);
    io.emit('course-updated', course); // Also broadcast to all
    console.log(`✏️ Course updated: ${course.title}`);
  });

  // Module added
  socket.on('module-added', (data) => {
    io.to(`course-${data.courseId}`).emit('module-added', data.module);
    console.log(`📖 Module added to course: ${data.courseId}`);
  });

  // Assignment created
  socket.on('assignment-created', (data) => {
    io.to(`course-${data.courseId}`).emit('assignment-created', data.assignment);
    console.log(`📋 Assignment created for course: ${data.courseId}`);
  });

  // Assignment submitted
  socket.on('assignment-submitted', (data) => {
    io.to(`course-${data.courseId}`).emit('assignment-submitted', data);
    console.log(`✅ Assignment submitted for course: ${data.courseId}`);
  });

  // Note uploaded
  socket.on('note-uploaded', (data) => {
    io.to(`course-${data.courseId}`).emit('note-uploaded', data.note);
    console.log(`📄 Note uploaded for course: ${data.courseId}`);
  });

  // User enrolled
  socket.on('user-enrolled', (data) => {
    io.to(`course-${data.courseId}`).emit('student-enrolled', {
      courseId: data.courseId,
      timestamp: new Date()
    });
    console.log(`🎓 Student enrolled in course: ${data.courseId}`);
  });

  // Progress updated
  socket.on('progress-updated', (data) => {
    io.to(`course-${data.courseId}`).emit('progress-updated', data);
    console.log(`📊 Progress updated for course: ${data.courseId}`);
  });

  // Feedback submitted
  socket.on('feedback-submitted', (data) => {
    io.to(`course-${data.courseId}`).emit('feedback-submitted', data);
    console.log(`💬 Feedback submitted for course: ${data.courseId}`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });

  // Handle errors
  socket.on('error', (error) => {
    console.error(`🔴 Socket error from ${socket.id}:`, error);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log('=================================');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📹 Video uploads directory: ${videosDir}`);
  console.log(`🔌 Socket.io enabled - Real-time updates active`);
  console.log(`🌐 CORS origins: ${getAllowedOrigins().join(', ') || 'Not configured'}`);
  console.log('=================================');
});

module.exports = { app, server, io };
