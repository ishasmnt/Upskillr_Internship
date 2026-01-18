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

// SIMPLE CORS - Allow your Vercel domain
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:3001',
  'https://upskillr-internship-qmaa.vercel.app',
  'https://upskillr-internship-qmaa-git-main-ishasmnt06s-projects.vercel.app', // Git branch preview
  'https://upskillr-internship-qmaa-*.vercel.app' // All Vercel previews
];

// Add CORS_ORIGIN from environment if set
if (process.env.CORS_ORIGIN) {
  const envOrigins = process.env.CORS_ORIGIN.split(',').map(o => o.trim());
  allowedOrigins.push(...envOrigins);
}

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Check if exact match
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Check if matches wildcard pattern (*.vercel.app)
    if (origin.match(/^https:\/\/upskillr-internship-qmaa.*\.vercel\.app$/)) {
      return callback(null, true);
    }
    
    console.log('⚠️ Origin not allowed:', origin);
    callback(null, true); // Allow anyway for now (remove in production)
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Socket.io configuration
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Logging
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

  socket.on('join-course', (courseId) => {
    socket.join(`course-${courseId}`);
    console.log(`📚 User ${socket.id} joined course: ${courseId}`);
  });

  socket.on('leave-course', (courseId) => {
    socket.leave(`course-${courseId}`);
    console.log(`👋 User ${socket.id} left course: ${courseId}`);
  });

  socket.on('user-login', (data) => {
    console.log(`👤 User logged in: ${data.role}`);
  });

  socket.on('user-logout', (data) => {
    console.log(`👋 User logged out`);
  });

  socket.on('course-created', (course) => {
    io.emit('new-course', course);
    console.log(`🆕 New course created: ${course.title}`);
  });

  socket.on('course-updated', (course) => {
    io.to(`course-${course._id}`).emit('course-updated', course);
    io.emit('course-updated', course);
    console.log(`✏️ Course updated: ${course.title}`);
  });

  socket.on('module-added', (data) => {
    io.to(`course-${data.courseId}`).emit('module-added', data.module);
    console.log(`📖 Module added`);
  });

  socket.on('assignment-created', (data) => {
    io.to(`course-${data.courseId}`).emit('assignment-created', data.assignment);
    console.log(`📋 Assignment created`);
  });

  socket.on('assignment-submitted', (data) => {
    io.to(`course-${data.courseId}`).emit('assignment-submitted', data);
    console.log(`✅ Assignment submitted`);
  });

  socket.on('note-uploaded', (data) => {
    io.to(`course-${data.courseId}`).emit('note-uploaded', data.note);
    console.log(`📄 Note uploaded`);
  });

  socket.on('user-enrolled', (data) => {
    io.to(`course-${data.courseId}`).emit('student-enrolled', {
      courseId: data.courseId,
      timestamp: new Date()
    });
    console.log(`🎓 Student enrolled`);
  });

  socket.on('progress-updated', (data) => {
    io.to(`course-${data.courseId}`).emit('progress-updated', data);
    console.log(`📊 Progress updated`);
  });

  socket.on('feedback-submitted', (data) => {
    io.to(`course-${data.courseId}`).emit('feedback-submitted', data);
    console.log(`💬 Feedback submitted`);
  });

  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });

  socket.on('error', (error) => {
    console.error(`🔴 Socket error:`, error);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM: Closing server');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('SIGINT: Closing server');
  server.close(() => process.exit(0));
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log('=================================');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Allowed origins:`, allowedOrigins.slice(0, 3).join(', '));
  console.log('=================================');
});

module.exports = { app, server, io };
