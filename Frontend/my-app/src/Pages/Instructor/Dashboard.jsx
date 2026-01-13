import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, BookOpen, TrendingUp, Star, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../../components/Button';
import { courseAPI } from '../../services/api';
import '../../styles/Dashboard.css';

const InstructorDashboard = ({ instructorCourses, onCreateCourse, onDeleteCourse, onRefresh }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    category: 'Development',
    duration: '',
    price: 0
  });

  const handleCreateCourse = async () => {
    if (!newCourse.title || !newCourse.description) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await onCreateCourse(newCourse);
      setNewCourse({ 
        title: '', 
        description: '', 
        category: 'Development', 
        duration: '', 
        price: 0 
      });
      setShowModal(false);
      if (onRefresh) await onRefresh();
    } catch (error) {
      console.error('Error creating course:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalStudents = instructorCourses.reduce((sum, course) => sum + (course.students || 0), 0);
  const publishedCourses = instructorCourses.filter(c => c.status === 'Published').length;
  const avgRating = instructorCourses.length > 0 
    ? (instructorCourses.reduce((sum, c) => sum + (c.rating || 0), 0) / instructorCourses.length).toFixed(1)
    : 0;

  return (
    <motion.div 
      className="dashboard-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="dashboard-container">
        {/* Header */}
        <motion.div 
          className="dashboard-header"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="dashboard-header-content">
            <motion.h1 
              className="dashboard-title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Instructor Dashboard
            </motion.h1>
            <motion.p 
              className="dashboard-subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Manage your courses and track your impact
            </motion.p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button size="lg" onClick={() => setShowModal(true)}>
              <Plus className="w-5 h-5" /> Create New Course
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div 
          className="dashboard-stats-grid"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {[
            { label: 'Total Students', value: totalStudents, icon: Users, trend: '+12%' },
            { label: 'Active Courses', value: publishedCourses, icon: BookOpen, trend: `${instructorCourses.length} total` },
            { label: 'Total Courses', value: instructorCourses.length, icon: TrendingUp, trend: 'All courses' },
            { label: 'Avg. Rating', value: avgRating || 'N/A', icon: Star, trend: publishedCourses > 0 ? 'Excellent' : 'No ratings' }
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              className="dashboard-stat-card"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="dashboard-stat-header">
                <stat.icon className="dashboard-stat-icon" />
                <span className="dashboard-stat-trend">
                  {stat.trend}
                </span>
              </div>
              <div className="dashboard-stat-value">{stat.value}</div>
              <div className="dashboard-stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Course Management */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          <motion.h2 
            className="dashboard-section-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.4 }}
          >
            Your Courses
          </motion.h2>
          {instructorCourses.length === 0 ? (
            <motion.div 
              className="dashboard-empty-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <BookOpen className="dashboard-empty-icon" />
              <h3 className="dashboard-empty-title">No courses created yet</h3>
              <p className="dashboard-empty-description">Create your first course and start teaching</p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button onClick={() => setShowModal(true)}>
                  <Plus className="w-5 h-5" /> Create Your First Course
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <div className="dashboard-courses-list">
              {instructorCourses.map((course, i) => (
                <motion.div 
                  key={course._id || i} 
                  className="dashboard-course-card"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + i * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.02, y: -3 }}
                >
                  <div className="dashboard-course-header">
                    <div className="dashboard-course-content">
                      <div className="dashboard-course-title-row">
                        <h3 className="dashboard-course-title">{course.title}</h3>
                        <span className={`dashboard-course-status ${
                          course.status === 'Published' 
                            ? 'dashboard-course-status-published' 
                            : 'dashboard-course-status-draft'
                        }`}>
                          {course.status}
                        </span>
                      </div>
                      <div className="dashboard-course-meta">
                        <div className="dashboard-course-meta-item">
                          <Users className="w-4 h-4" />
                          <span>{course.students || 0} students</span>
                        </div>
                        <div className="dashboard-course-meta-item">
                          <BookOpen className="w-4 h-4" />
                          <span>{course.duration || 'N/A'}</span>
                        </div>
                        {course.rating > 0 && (
                          <div className="dashboard-course-meta-item">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{course.rating} rating</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="dashboard-course-actions">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                          variant="ghost" 
                          onClick={() => navigate(`/instructor/course/${course._id}/manage`)}
                        >
                          <Edit className="w-4 h-4" /> Manage
                        </Button>
                      </motion.div>
                      <motion.button 
                        onClick={() => onDeleteCourse(course)}
                        className="dashboard-delete-button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Create Course Modal */}
      {showModal && (
        <motion.div 
          className="dashboard-modal-overlay"
          onClick={() => !loading && setShowModal(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="dashboard-modal-content"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.h2 
              className="dashboard-modal-title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              Create New Course
            </motion.h2>
            <div className="dashboard-modal-form">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <label className="dashboard-modal-label">Course Title *</label>
                <input 
                  type="text" 
                  placeholder="Enter course title"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                  className="dashboard-modal-input"
                  disabled={loading}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <label className="dashboard-modal-label">Category</label>
                <select 
                  value={newCourse.category}
                  onChange={(e) => setNewCourse({...newCourse, category: e.target.value})}
                  className="dashboard-modal-input"
                  disabled={loading}
                >
                  <option>Development</option>
                  <option>Design</option>
                  <option>Data Science</option>
                  <option>Business</option>
                  <option>Marketing</option>
                </select>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <label className="dashboard-modal-label">Description *</label>
                <textarea 
                  placeholder="Describe your course"
                  rows="4"
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                  className="dashboard-modal-textarea"
                  disabled={loading}
                ></textarea>
              </motion.div>
              <motion.div 
                className="dashboard-modal-grid"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                <div>
                  <label className="dashboard-modal-label">Duration</label>
                  <input 
                    type="text" 
                    placeholder="e.g., 12h"
                    value={newCourse.duration}
                    onChange={(e) => setNewCourse({...newCourse, duration: e.target.value})}
                    className="dashboard-modal-input"
                    disabled={loading}
                  />
                </div>
              </motion.div>
              <motion.div 
                className="dashboard-modal-actions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.3 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    className="dashboard-modal-button-flex" 
                    onClick={handleCreateCourse}
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Course'}
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowModal(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default InstructorDashboard;