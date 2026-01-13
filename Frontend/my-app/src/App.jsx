import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MyProfile from './components/MyProfile';
import ScrollToTop from './components/ScrollToTop';
import { authAPI, courseAPI, enrollmentAPI } from './services/api';
import './App.css';

// Pages
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import NotFoundPage from './Pages/404Page';

// Learner Pages
import LearnerDashboard from './pages/Learner/Dashboard';
import CourseList from './pages/Learner/CourseList';
import MyCourses from './pages/Learner/MyCourses';
import CoursePlayer from './pages/Learner/CoursePlayer';
import SubmitAssignment from './pages/Learner/SubmitAssignment';
import Notes from './pages/Learner/Notes';

// Instructor Pages
import InstructorDashboard from './Pages/Instructor/Dashboard';
import ManageCourse from './pages/Instructor/ManageCourse';
import AddModules from './pages/Instructor/AddModules';
import AddAssignments from './pages/Instructor/AddAssignments';
import UploadNotes from './pages/Instructor/UploadNotes';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // All available courses from backend
  const [allCourses, setAllCourses] = useState([]);
  
  // Enrolled courses for learner
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  // Instructor courses
  const [instructorCourses, setInstructorCourses] = useState([]);

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
      alert('Successfully enrolled in the course!');
    } catch (error) {
      console.error('Enrollment error:', error);
      alert(error.response?.data?.message || 'Failed to enroll in course');
    }
  };

  // Handle course creation
  const handleCreateCourse = async (courseData) => {
    try {
      const newCourse = await courseAPI.createCourse(courseData);
      setInstructorCourses([...instructorCourses, newCourse]);
      alert('Course created successfully!');
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Failed to create course');
    }
  };

  // Handle course deletion
  const handleDeleteCourse = async (course) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await courseAPI.deleteCourse(course._id);
        setInstructorCourses(instructorCourses.filter(c => c._id !== course._id));
        alert('Course deleted successfully!');
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Failed to delete course');
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
    } else if (role === 'instructor') {
      fetchInstructorCourses();
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
  };

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
        <Navbar 
          isAuthenticated={isAuthenticated} 
          userRole={userRole}
          onLogout={handleLogout}
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
    </Router>
  );
};

export default App;