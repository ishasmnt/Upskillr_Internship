import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MyProfile from './components/MyProfile';
import ScrollToTop from './components/ScrollToTop';
import { authAPI, courseAPI, enrollmentAPI } from './services/api';
import socketService from './services/socket';
import './App.css';

// Pages
import Home from './Pages/Home';
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import NotFoundPage from './Pages/404Page';

// Learner Pages
import LearnerDashboard from './Pages/Learner/Dashboard';
import CourseList from './Pages/Learner/CourseList';
import MyCourses from './Pages/Learner/MyCourses';
import CoursePlayer from './Pages/Learner/CoursePlayer';
import SubmitAssignment from './Pages/Learner/SubmitAssignment';
import Notes from './Pages/Learner/Notes';

// Instructor Pages
import InstructorDashboard from './Pages/Instructor/Dashboard';
import ManageCourse from './Pages/Instructor/ManageCourse';
import AddModules from './Pages/Instructor/AddModules';
import AddAssignments from './Pages/Instructor/AddAssignments';
import ViewSubmissions from './Pages/Instructor/ViewSubmissions';
import UploadNotes from './Pages/Instructor/UploadNotes';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socketConnected, setSocketConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  // All available courses from backend
  const [allCourses, setAllCourses] = useState([]);
  
  // Enrolled courses for learner
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  // Instructor courses
  const [instructorCourses, setInstructorCourses] = useState([]);

  // Real-time updates state
  const [realtimeUpdates, setRealtimeUpdates] = useState({
    newCourse: null,
    updatedCourse: null,
    newModule: null,
    newAssignment: null,
    newEnrollment: null,
    updatedProgress: null
  });

  // Initialize Socket.io
  useEffect(() => {
    const socket = socketService.connect();
    
    socket.on('connect', () => {
      setSocketConnected(true);
      console.log('✨ Socket connected to server');
    });

    socket.on('disconnect', () => {
      setSocketConnected(false);
      console.log('❌ Socket disconnected');
    });

    return () => {
      // Keep connection alive
    };
  }, []);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setIsAuthenticated(true);
          setUserRole(userData.role);
          setUser(userData);
          
          // Fetch user-specific data
          if (userData.role === 'learner') {
            await fetchEnrolledCourses();
          } else if (userData.role === 'instructor') {
            await fetchInstructorCourses();
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          handleLogout();
        }
      }
      setLoading(false);
    };

    checkAuth();
    fetchAllCourses();
  }, []);

  // Fetch all courses
  const fetchAllCourses = async () => {
    try {
      const courses = await courseAPI.getAllCourses();
      setAllCourses(courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  // Fetch enrolled courses for learner
  const fetchEnrolledCourses = async () => {
    try {
      const enrollments = await enrollmentAPI.getMyEnrollments();
      setEnrolledCourses(enrollments);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    }
  };

  // Fetch instructor courses
  const fetchInstructorCourses = async () => {
    try {
      const courses = await courseAPI.getInstructorCourses();
      setInstructorCourses(courses);
    } catch (error) {
      console.error('Error fetching instructor courses:', error);
    }
  };

  // Handle enrollment
  const handleEnroll = async (course) => {
    try {
      const enrollment = await enrollmentAPI.enrollInCourse(course._id);
      await fetchEnrolledCourses();
      
      // Notify via socket
      socketService.notifyUserEnrolled(course._id);
      
      addNotification('Successfully enrolled in the course!', 'success');
    } catch (error) {
      console.error('Enrollment error:', error);
      addNotification(error.response?.data?.message || 'Failed to enroll in course', 'error');
    }
  };

  // Handle course creation
  const handleCreateCourse = async (courseData) => {
    try {
      const newCourse = await courseAPI.createCourse(courseData);
      setInstructorCourses([...instructorCourses, newCourse]);
      
      // Notify all users via socket
      socketService.notifyCourseCreated(newCourse);
      
      addNotification('Course created successfully!', 'success');
    } catch (error) {
      console.error('Error creating course:', error);
      addNotification('Failed to create course', 'error');
    }
  };

  // Handle course deletion
  const handleDeleteCourse = async (course) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await courseAPI.deleteCourse(course._id);
        setInstructorCourses(instructorCourses.filter(c => c._id !== course._id));
        addNotification('Course deleted successfully!', 'success');
      } catch (error) {
        console.error('Error deleting course:', error);
        addNotification('Failed to delete course', 'error');
      }
    }
  };

  // Handle login
  const handleLogin = (role, userData) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setUser(userData);
    
    // Fetch role-specific data
    if (role === 'learner') {
      fetchEnrolledCourses();
      socketService.emit('user-login', { role: 'learner', userId: userData._id });
    } else if (role === 'instructor') {
      fetchInstructorCourses();
      socketService.emit('user-login', { role: 'instructor', userId: userData._id });
    }
  };

  // Handle logout
  const handleLogout = () => {
    authAPI.logout();
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUserRole(null);
    setUser(null);
    setEnrolledCourses([]);
    setInstructorCourses([]);
    
    socketService.emit('user-logout', { userId: user?._id });
    addNotification('Logged out successfully', 'info');
  };

  // Add notification
  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // Setup real-time listeners
  useEffect(() => {
    if (!socketConnected) return;

    // Listen for new courses
    socketService.onNewCourse((course) => {
      console.log('📚 New course:', course.title);
      setAllCourses(prev => {
        const exists = prev.some(c => c._id === course._id);
        return exists ? prev : [course, ...prev];
      });
      setRealtimeUpdates(prev => ({ ...prev, newCourse: course }));
      if (user?.role !== 'instructor' || user._id !== course.instructor._id) {
        addNotification(`New course: ${course.title}`, 'info');
      }
    });

    // Listen for course updates
    socketService.onCourseUpdated((course) => {
      console.log('✏️ Course updated:', course.title);
      setAllCourses(prev => 
        prev.map(c => c._id === course._id ? course : c)
      );
      if (userRole === 'instructor') {
        setInstructorCourses(prev =>
          prev.map(c => c._id === course._id ? course : c)
        );
      }
      setRealtimeUpdates(prev => ({ ...prev, updatedCourse: course }));
      addNotification(`Course updated: ${course.title}`, 'info');
    });

    // Listen for module additions
    socketService.onModuleAdded((module) => {
      console.log('📝 Module added:', module.title);
      setAllCourses(prev =>
        prev.map(c => c._id === module.course ? { ...c, modules: [...(c.modules || []), module] } : c)
      );
      setRealtimeUpdates(prev => ({ ...prev, newModule: module }));
      addNotification(`New module: ${module.title}`, 'info');
    });

    // Listen for assignment creation
    socketService.onAssignmentCreated((assignment) => {
      console.log('📋 Assignment created:', assignment.title);
      setRealtimeUpdates(prev => ({ ...prev, newAssignment: assignment }));
      addNotification(`New assignment: ${assignment.title}`, 'info');
    });

    // Listen for student enrollment
    socketService.onStudentEnrolled((data) => {
      console.log('🎓 Student enrolled in:', data.courseId);
      setAllCourses(prev =>
        prev.map(c => c._id === data.courseId ? { ...c, students: (c.students || 0) + 1 } : c)
      );
      setRealtimeUpdates(prev => ({ ...prev, newEnrollment: data }));
      addNotification('New student enrolled!', 'info');
    });

    // Listen for note uploads
    socketService.onNoteUploaded((note) => {
      console.log('📄 Note uploaded:', note.title);
      addNotification(`New note: ${note.title}`, 'info');
    });

    // Listen for progress updates
    socketService.onProgressUpdated((data) => {
      console.log('📊 Progress updated:', data.progress);
      setRealtimeUpdates(prev => ({ ...prev, updatedProgress: data }));
      
      // Update enrolled courses if it's current user
      if (userRole === 'learner') {
        setEnrolledCourses(prev =>
          prev.map(e => e.course._id === data.courseId ? { ...e, progress: data.progress } : e)
        );
      }
    });

    // Listen for feedback
    socketService.onFeedbackSubmitted((feedback) => {
      console.log('💬 Feedback submitted');
      addNotification('Feedback received!', 'info');
    });

    return () => {
      socketService.off('new-course');
      socketService.off('course-updated');
      socketService.off('module-added');
      socketService.off('assignment-created');
      socketService.off('student-enrolled');
      socketService.off('note-uploaded');
      socketService.off('progress-updated');
      socketService.off('feedback-submitted');
    };
  }, [socketConnected, user, userRole]);

  // Protected Route Component
  const ProtectedRoute = ({ children, requireAuth = true, allowedRole = null }) => {
    if (loading) {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh' 
        }}>
          <div>Loading...</div>
        </div>
      );
    }

    if (requireAuth && !isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    
    if (allowedRole && userRole !== allowedRole) {
      return <Navigate to="/" replace />;
    }
    
    return children;
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <ScrollToTop />
        
        {/* Notifications */}
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          maxWidth: '400px'
        }}>
          {notifications.map(notif => (
            <div
              key={notif.id}
              style={{
                marginBottom: '10px',
                padding: '12px 16px',
                borderRadius: '8px',
                background: notif.type === 'success' ? '#dcfce7' : 
                            notif.type === 'error' ? '#fee2e2' : '#dbeafe',
                color: notif.type === 'success' ? '#166534' : 
                       notif.type === 'error' ? '#991b1b' : '#0c4a6e',
                border: `1px solid ${notif.type === 'success' ? '#86efac' : 
                                    notif.type === 'error' ? '#fca5a5' : '#7dd3fc'}`,
                animation: 'slideIn 0.3s ease'
              }}
            >
              {notif.message}
            </div>
          ))}
        </div>

        {/* Socket Status Indicator */}
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '8px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          background: socketConnected ? '#dcfce7' : '#fee2e2',
          color: socketConnected ? '#166534' : '#991b1b',
          border: `1px solid ${socketConnected ? '#86efac' : '#fca5a5'}`,
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: socketConnected ? '#22c55e' : '#ef4444',
            animation: socketConnected ? 'pulse 2s infinite' : 'none'
          }}></span>
          {socketConnected ? 'Real-time' : 'Offline'}
        </div>

        <Navbar 
          isAuthenticated={isAuthenticated} 
          userRole={userRole}
          onLogout={handleLogout}
          socketConnected={socketConnected}
        />
        
        <main className="app-main">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home allCourses={allCourses} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/courses" 
              element={
                <CourseList 
                  allCourses={allCourses} 
                  onEnroll={handleEnroll}
                  isAuthenticated={isAuthenticated}
                />
              } 
            />

            {/* Learner Routes */}
            <Route 
              path="/learner/profile" 
              element={
                <ProtectedRoute allowedRole="learner">
                  <MyProfile userRole="learner" user={user} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/learner/dashboard" 
              element={
                <ProtectedRoute allowedRole="learner">
                  <LearnerDashboard 
                    enrolledCourses={enrolledCourses}
                    onRefresh={fetchEnrolledCourses}
                    realtimeUpdates={realtimeUpdates}
                  />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/learner/my-courses" 
              element={
                <ProtectedRoute allowedRole="learner">
                  <MyCourses enrolledCourses={enrolledCourses} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/learner/course/:courseId/player" 
              element={
                <ProtectedRoute allowedRole="learner">
                  <CoursePlayer 
                    enrolledCourses={enrolledCourses}
                    onRefresh={fetchEnrolledCourses}
                  />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/learner/course/:courseId/assignments" 
              element={
                <ProtectedRoute allowedRole="learner">
                  <SubmitAssignment enrolledCourses={enrolledCourses} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/learner/course/:courseId/notes" 
              element={
                <ProtectedRoute allowedRole="learner">
                  <Notes enrolledCourses={enrolledCourses} />
                </ProtectedRoute>
              } 
            />

            {/* Instructor Routes */}
            <Route 
              path="/instructor/dashboard" 
              element={
                <ProtectedRoute allowedRole="instructor">
                  <InstructorDashboard 
                    instructorCourses={instructorCourses}
                    onCreateCourse={handleCreateCourse}
                    onDeleteCourse={handleDeleteCourse}
                    onRefresh={fetchInstructorCourses}
                    realtimeUpdates={realtimeUpdates}
                  />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/instructor/course/:courseId/manage" 
              element={
                <ProtectedRoute allowedRole="instructor">
                  <ManageCourse 
                    instructorCourses={instructorCourses}
                    onRefresh={fetchInstructorCourses}
                  />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/instructor/course/:courseId/modules" 
              element={
                <ProtectedRoute allowedRole="instructor">
                  <AddModules 
                    instructorCourses={instructorCourses}
                    onRefresh={fetchInstructorCourses}
                  />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/instructor/course/:courseId/assignments" 
              element={
                <ProtectedRoute allowedRole="instructor">
                  <AddAssignments 
                    instructorCourses={instructorCourses}
                    onRefresh={fetchInstructorCourses}
                  />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/instructor/course/:courseId/assignments/:assignmentId/submissions" 
              element={
                <ProtectedRoute allowedRole="instructor">
                  <ViewSubmissions instructorCourses={instructorCourses} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/instructor/course/:courseId/notes" 
              element={
                <ProtectedRoute allowedRole="instructor">
                  <UploadNotes 
                    instructorCourses={instructorCourses}
                    onRefresh={fetchInstructorCourses}
                  />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/instructor/profile" 
              element={
                <ProtectedRoute allowedRole="instructor">
                  <MyProfile userRole="instructor" user={user} />
                </ProtectedRoute>
              } 
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <Footer />
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </Router>
  );
};

export default App;
