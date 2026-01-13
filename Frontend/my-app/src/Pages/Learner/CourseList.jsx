import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import CourseCard from '../../components/CourseCard';
import CourseDetail from './CourseDetail';
import ShinyText from '../../components/ui/ShinyText';
import '../../styles/CourseList.css';

const CourseList = ({ allCourses, onEnroll, isAuthenticated }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState(null);

  const categories = ['All', 'Development', 'Design', 'Data Science', 'Business', 'Marketing'];

  const filteredCourses = allCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (course.instructor?.name || course.instructor || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEnrollClick = (course) => {
    if (!isAuthenticated) {
      alert('Please login to enroll in courses');
      navigate('/login');
      return;
    }
    onEnroll(course);
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
          <motion.h1 
            className="course-list-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
           Browse All Courses
          </motion.h1>
          <motion.p 
            className="course-list-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Explore our complete course catalog ({allCourses.length} courses available)
          </motion.p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div 
          className="course-list-filters"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="course-list-filters-grid">
            <motion.div 
              className="course-list-search-wrapper"
              whileFocus={{ scale: 1.02 }}
            >
              <Search className="course-list-search-icon" />
              <input 
                type="text" 
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="course-list-search-input"
              />
            </motion.div>
            <div className="course-list-categories">
              {categories.map((cat, i) => (
                <motion.button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`course-list-category-button ${
                    selectedCategory === cat 
                      ? 'course-list-category-button-active' 
                      : 'course-list-category-button-inactive'
                  }`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.05, duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {cat}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Course Grid */}
        <motion.div 
          className="course-list-grid"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          {filteredCourses.map((course, i) => (
            <motion.div
              key={course._id || i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + i * 0.05, duration: 0.4 }}
              whileHover={{ scale: 1.03, y: -5 }}
            >
              <CourseCard 
                course={course}
                onEnroll={() => setSelectedCourse(course)}
              />
            </motion.div>
          ))}
        </motion.div>

        {filteredCourses.length === 0 && (
          <motion.div 
            className="course-list-empty-state"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            <BookOpen className="course-list-empty-icon" />
            <p className="course-list-empty-text">No courses found matching your criteria</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default CourseList;