import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, Loader, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CourseCard from '../../components/CourseCard';
import CourseDetail from './CourseDetail';
import { courseAPI } from '../../services/api';
import socketService from '../../services/socket';
import '../../styles/CourseList.css';

const CourseList = ({ allCourses: propCourses, onEnroll, isAuthenticated }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = ['All', 'Development', 'Design', 'Data Science', 'Business', 'Marketing'];

  // Fetch courses on mount
  useEffect(() => {
    console.log('📚 CourseList mounted, fetching courses...');
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Fetching courses from API...');
      
      const data = await courseAPI.getAllCourses();
      console.log('📊 Courses received:', data);
      
      if (Array.isArray(data) && data.length > 0) {
        setCourses(data);
        console.log('✅ Courses set:', data.length, 'courses found');
      } else if (Array.isArray(data)) {
        setCourses([]);
        console.log('⚠️ No courses in database');
        setError('No courses available yet. Create one in the instructor dashboard!');
      } else {
        setCourses([]);
        console.log('❌ Invalid data format:', data);
        setError('Invalid course data format');
      }
    } catch (error) {
      console.error('❌ Error fetching courses:', error);
      setCourses([]);
      setError(`Failed to load courses: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Listen for real-time course updates
  useEffect(() => {
    socketService.onNewCourse((course) => {
      console.log('🆕 New course received:', course);
      setCourses(prev => {
        const exists = prev.some(c => c._id === course._id);
        return exists ? prev : [course, ...prev];
      });
    });

    socketService.onCourseUpdated((course) => {
      console.log('✏️ Course updated:', course);
      setCourses(prev =>
        prev.map(c => c._id === course._id ? course : c)
      );
    });

    return () => {
      socketService.off('new-course');
      socketService.off('course-updated');
    };
  }, []);

  const filteredCourses = courses.filter(course => {
    if (!course) return false;

    const title = (course.title || '').toLowerCase();
    const instructor = (course.instructor?.name || course.instructor || '').toString().toLowerCase();
    const matchesSearch = title.includes(searchTerm.toLowerCase()) || 
                         instructor.includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || (course.category === selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  const handleEnrollClick = (course) => {
    if (!isAuthenticated) {
      alert('Please login to enroll in courses');
      navigate('/login');
      return;
    }
    onEnroll(course);
    socketService.notifyUserEnrolled(course._id);
  };

  if (selectedCourse) {
    return (
      <CourseDetail
        course={selectedCourse}
        onBack={() => setSelectedCourse(null)}
        onStartLearning={() => {
          handleEnrollClick(selectedCourse);
          setSelectedCourse(null);
        }}
      />
    );
  }

  return (
    <motion.div
      className="course-list-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="course-list-container">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className="course-list-title">Browse All Courses</h1>
          <p className="course-list-subtitle">
            {loading ? 'Loading courses...' : `${courses.length} courses available`}
          </p>
        </motion.div>

        {/* Search & Filter */}
        <motion.div
          className="course-list-filters"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="course-list-filters-grid">
            <div className="course-list-search-wrapper">
              <Search className="course-list-search-icon" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="course-list-search-input"
              />
            </div>
            <div className="course-list-categories">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`course-list-category-button ${
                    selectedCategory === cat
                      ? 'course-list-category-button-active'
                      : 'course-list-category-button-inactive'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <button
              onClick={fetchCourses}
              style={{
                background: 'none',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px 12px',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: '#fee2e2',
              border: '1px solid #ef4444',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '20px',
              color: '#991b1b'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{error}</span>
              <button
                onClick={fetchCourses}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#991b1b',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Try Again
              </button>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px'
            }}
          >
            <Loader className="w-12 h-12 animate-spin text-blue-500" />
            <p>Loading courses...</p>
          </motion.div>
        ) : (
          <>
            {/* Courses Grid */}
            <motion.div
              className="course-list-grid"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <AnimatePresence>
                {filteredCourses && filteredCourses.length > 0 ? (
                  filteredCourses.map((course, i) => (
                    <motion.div
                      key={course._id || i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: 0.9 + i * 0.05, duration: 0.4 }}
                      whileHover={{ scale: 1.03, y: -5 }}
                    >
                      <CourseCard
                        course={course}
                        onEnroll={() => handleEnrollClick(course)}
                        onResume={() => navigate(`/learner/course/${course._id}/player`)}
                      />
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      gridColumn: '1 / -1',
                      textAlign: 'center',
                      padding: '60px 20px'
                    }}
                  >
                    <BookOpen style={{ width: '64px', height: '64px', margin: '0 auto 16px', color: '#d1d5db' }} />
                    <p>{courses.length === 0 ? 'No courses available' : 'No courses match your search'}</p>
                    {(searchTerm || selectedCategory !== 'All') && (
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedCategory('All');
                        }}
                        style={{
                          marginTop: '12px',
                          color: '#2563eb',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          textDecoration: 'underline'
                        }}
                      >
                        Clear filters
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default CourseList;