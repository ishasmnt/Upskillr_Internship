import io from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  /**
   * Initialize socket connection
   */
  connect() {
    if (this.socket) {
      return this.socket;
    }

    console.log('🔌 Connecting to Socket.io server:', SOCKET_URL);

    this.socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling']
    });

    // Connection events
    this.socket.on('connect', () => {
      this.isConnected = true;
      console.log('✨ Socket connected:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      console.log('❌ Socket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('🔴 Socket error:', error);
    });

    this.socket.on('reconnect_attempt', () => {
      console.log('🔄 Attempting to reconnect...');
    });

    return this.socket;
  }

  /**
   * Disconnect socket
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  /**
   * Check if connected
   */
  isConnectedToServer() {
    return this.isConnected && this.socket?.connected;
  }

  /**
   * Emit event to server
   */
  emit(event, data) {
    if (this.socket) {
      console.log(`📤 Emitting: ${event}`, data);
      this.socket.emit(event, data);
    } else {
      console.warn(`⚠️ Socket not connected. Cannot emit: ${event}`);
    }
  }

  /**
   * Listen for event from server
   */
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, (data) => {
        console.log(`📥 Received: ${event}`, data);
        callback(data);
      });
    }
  }

  /**
   * Listen for event once
   */
  once(event, callback) {
    if (this.socket) {
      this.socket.once(event, (data) => {
        console.log(`📥 Received (once): ${event}`, data);
        callback(data);
      });
    }
  }

  /**
   * Stop listening for event
   */
  off(event) {
    if (this.socket) {
      this.socket.off(event);
    }
  }

  /**
   * Remove all listeners for event
   */
  offAll(event) {
    if (this.socket) {
      this.socket.removeAllListeners(event);
    }
  }

  // ============================================
  // COURSE EVENTS
  // ============================================

  /**
   * Join a course room
   */
  joinCourse(courseId) {
    this.emit('join-course', courseId);
  }

  /**
   * Leave a course room
   */
  leaveCourse(courseId) {
    this.emit('leave-course', courseId);
  }

  /**
   * Listen for new courses
   */
  onNewCourse(callback) {
    this.on('new-course', callback);
  }

  /**
   * Notify new course created
   */
  notifyCourseCreated(course) {
    this.emit('course-created', course);
  }

  /**
   * Listen for course updates
   */
  onCourseUpdated(callback) {
    this.on('course-updated', callback);
  }

  /**
   * Notify course updated
   */
  notifyCourseUpdated(course) {
    this.emit('course-updated', course);
  }

  // ============================================
  // MODULE EVENTS
  // ============================================

  /**
   * Listen for new modules
   */
  onModuleAdded(callback) {
    this.on('module-added', callback);
  }

  /**
   * Notify module added
   */
  notifyModuleAdded(courseId, module) {
    this.emit('module-added', { courseId, module });
  }

  // ============================================
  // ASSIGNMENT EVENTS
  // ============================================

  /**
   * Listen for new assignments
   */
  onAssignmentCreated(callback) {
    this.on('assignment-created', callback);
  }

  /**
   * Notify assignment created
   */
  notifyAssignmentCreated(courseId, assignment) {
    this.emit('assignment-created', { courseId, assignment });
  }

  /**
   * Listen for assignment submissions
   */
  onAssignmentSubmitted(callback) {
    this.on('assignment-submitted', callback);
  }

  /**
   * Notify assignment submitted
   */
  notifyAssignmentSubmitted(courseId, submission) {
    this.emit('assignment-submitted', { courseId, submission });
  }

  // ============================================
  // NOTE EVENTS
  // ============================================

  /**
   * Listen for note uploads
   */
  onNoteUploaded(callback) {
    this.on('note-uploaded', callback);
  }

  /**
   * Notify note uploaded
   */
  notifyNoteUploaded(courseId, note) {
    this.emit('note-uploaded', { courseId, note });
  }

  // ============================================
  // ENROLLMENT EVENTS
  // ============================================

  /**
   * Listen for student enrollments
   */
  onStudentEnrolled(callback) {
    this.on('student-enrolled', callback);
  }

  /**
   * Notify user enrolled
   */
  notifyUserEnrolled(courseId) {
    this.emit('user-enrolled', { courseId });
  }

  // ============================================
  // PROGRESS EVENTS
  // ============================================

  /**
   * Listen for progress updates
   */
  onProgressUpdated(callback) {
    this.on('progress-updated', callback);
  }

  /**
   * Notify progress updated
   */
  notifyProgressUpdated(courseId, progress) {
    this.emit('progress-updated', { courseId, progress });
  }

  // ============================================
  // FEEDBACK EVENTS
  // ============================================

  /**
   * Listen for feedback submissions
   */
  onFeedbackSubmitted(callback) {
    this.on('feedback-submitted', callback);
  }

  /**
   * Notify feedback submitted
   */
  notifyFeedbackSubmitted(courseId, feedback) {
    this.emit('feedback-submitted', { courseId, feedback });
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;