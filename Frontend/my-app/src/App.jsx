import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MyProfile from './components/MyProfile';
import ScrollToTop from './components/ScrollToTop';
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
  const [userRole, setUserRole] = useState('learner'); // 'learner' or 'instructor'
  
  // All available courses
  const [allCourses] = useState([
    {
      id: 1,
      title: 'Advanced React Patterns',
      description: 'Master advanced React patterns including hooks, context, and performance optimization',
      category: 'Development',
      rating: 4.9,
      duration: '12h',
      students: 2345,
      instructor: 'Sarah Chen',
      price: 49,
      lessons: [
        { title: 'Introduction to Advanced Patterns', description: 'Overview of what we will learn', resources: ['Slides.pdf', 'Code Examples'] },
        { title: 'Custom Hooks Deep Dive', description: 'Creating reusable custom hooks', resources: ['Hook Templates'] },
        { title: 'Context API Mastery', description: 'Managing global state effectively', resources: ['Context Patterns.pdf'] },
        { title: 'Performance Optimization', description: 'Making your React apps faster', resources: ['Performance Guide'] },
      ],
      modules: [],
      assignments: [],
      notes: []
    },
    {
      id: 2,
      title: 'UI/UX Design Mastery',
      description: 'Create stunning user interfaces and delightful user experiences from scratch',
      category: 'Design',
      rating: 4.8,
      duration: '8h',
      students: 1876,
      instructor: 'James Wilson',
      price: 39,
      lessons: [
        { title: 'Design Fundamentals', description: 'Basic principles of good design', resources: ['Design Principles.pdf'] },
        { title: 'Prototyping in Figma', description: 'Create interactive prototypes', resources: ['Figma Templates'] },
        { title: 'User Research Methods', description: 'Understanding your users', resources: ['Research Guide'] },
      ],
      modules: [],
      assignments: [],
      notes: []
    },
    {
      id: 3,
      title: 'Data Science Fundamentals',
      description: 'Learn data analysis, visualization, and machine learning basics with Python',
      category: 'Data Science',
      rating: 4.7,
      duration: '15h',
      students: 3124,
      instructor: 'Dr. Maya Patel',
      price: 59,
      lessons: [
        { title: 'Introduction to Python', description: 'Python basics for data science', resources: ['Python Cheatsheet'] },
        { title: 'Introduction to Pandas', description: 'Data manipulation with Pandas', resources: ['Pandas Guide'] },
        { title: 'Data Visualization', description: 'Creating charts and graphs', resources: ['Matplotlib Examples'] },
      ],
      modules: [],
      assignments: [],
      notes: []
    },
    {
      id: 4,
      title: 'Digital Marketing Strategy',
      description: 'Build comprehensive marketing campaigns that drive real business results',
      category: 'Marketing',
      rating: 4.6,
      duration: '10h',
      students: 1543,
      instructor: 'Lisa Anderson',
      price: 44,
      lessons: [],
      modules: [],
      assignments: [],
      notes: []
    },
    {
      id: 5,
      title: 'Full-Stack Web Development',
      description: 'Build complete web applications from frontend to backend and deployment',
      category: 'Development',
      rating: 4.9,
      duration: '20h',
      students: 4231,
      instructor: 'Michael Torres',
      price: 79,
      lessons: [],
      modules: [],
      assignments: [],
      notes: []
    },
    {
      id: 6,
      title: 'Business Strategy & Leadership',
      description: 'Develop strategic thinking and leadership skills for modern business',
      category: 'Business',
      rating: 4.5,
      duration: '6h',
      students: 987,
      instructor: 'Robert Chen',
      price: 34,
      lessons: [],
      modules: [],
      assignments: [],
      notes: []
    },
  ]);

  // Enrolled courses for learner
  const [enrolledCourses, setEnrolledCourses] = useState([
    {
      ...allCourses[0],
      progress: 68,
      currentLesson: 2,
      totalLessons: 4,
      nextLesson: 'Context API Mastery'
    },
    {
      ...allCourses[1],
      progress: 45,
      currentLesson: 2,
      totalLessons: 3,
      nextLesson: 'User Research Methods'
    }
  ]);

  // Instructor courses
  const [instructorCourses, setInstructorCourses] = useState([
    {
      ...allCourses[0],
      status: 'Published'
    },
    {
      ...allCourses[4],
      status: 'Published'
    },
    {
      title: 'Web Performance Optimization',
      description: 'Make your websites blazing fast',
      category: 'Development',
      duration: '8h',
      price: 44,
      students: 0,
      rating: 0,
      instructor: 'You',
      status: 'Draft',
      lessons: [],
      modules: [],
      assignments: [],
      notes: []
    }
  ]);

  const handleEnroll = (course) => {
    const isAlreadyEnrolled = enrolledCourses.some(c => c.id === course.id);
    if (!isAlreadyEnrolled) {
      setEnrolledCourses([...enrolledCourses, {
        ...course,
        progress: 0,
        currentLesson: 1,
        totalLessons: course.lessons.length || 5,
        nextLesson: course.lessons[0]?.title || 'Introduction'
      }]);
    }
  };

  const handleCreateCourse = (course) => {
    setInstructorCourses([...instructorCourses, course]);
  };

  const handleDeleteCourse = (course) => {
    setInstructorCourses(instructorCourses.filter(c => c !== course));
  };

  const handleLogin = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Protected Route Component
  const ProtectedRoute = ({ children, requireAuth = true, allowedRole = null }) => {
    if (requireAuth && !isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    
    if (allowedRole && userRole !== allowedRole) {
      return <Navigate to="/" replace />;
    }
    
    return children;
  };

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
            <Route path="/courses" element={<CourseList allCourses={allCourses} onEnroll={handleEnroll} />} />

            {/* Learner Routes */}
             <Route path="/learner/profile" element={<MyProfile userRole="learner" />} />
            <Route 
              path="/learner/dashboard" 
              element={
                <ProtectedRoute allowedRole="learner">
                  <LearnerDashboard enrolledCourses={enrolledCourses} />
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
                  <CoursePlayer enrolledCourses={enrolledCourses} />
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
                  />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/instructor/course/:courseId/manage" 
              element={
                <ProtectedRoute allowedRole="instructor">
                  <ManageCourse instructorCourses={instructorCourses} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/instructor/course/:courseId/modules" 
              element={
                <ProtectedRoute allowedRole="instructor">
                  <AddModules instructorCourses={instructorCourses} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/instructor/course/:courseId/assignments" 
              element={
                <ProtectedRoute allowedRole="instructor">
                  <AddAssignments instructorCourses={instructorCourses} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/instructor/course/:courseId/notes" 
              element={
                <ProtectedRoute allowedRole="instructor">
                  <UploadNotes instructorCourses={instructorCourses} />
                </ProtectedRoute>
              } 
            />
            <Route path="/instructor/profile" element={<MyProfile userRole="instructor" />} />

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