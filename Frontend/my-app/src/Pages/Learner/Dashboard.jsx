import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Award, TrendingUp, Play, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';
import socketService from '../../services/socket';
import '../../styles/LearnerDashboard.css';

const Dashboard = ({ enrolledCourses, onRefresh, realtimeUpdates }) => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState(enrolledCourses || []);
  const [liveUpdates, setLiveUpdates] = useState([]);
  const [showUpdates, setShowUpdates] = useState(true);

  // Update courses when prop changes
  useEffect(() => {
    setCourses(enrolledCourses || []);
  }, [enrolledCourses]);

  // Listen for real-time updates
  useEffect(() => {
    // Listen for progress updates
    socketService.onProgressUpdated((data) => {
      console.log('📊 Progress update received:', data);
      setCourses(prev =>
        prev.map(e =>
          e.course._id === data.courseId
            ? { ...e, progress: data.progress }
            : e
        )
      );
      addLiveUpdate(`Progress updated to ${data.progress}%`);
    });

    // Listen for new assignments
    socketService.onAssignmentCreated((assignment) => {
      addLiveUpdate(`New assignment: ${assignment.title}`);
    });

    // Listen for module additions
    socketService.onModuleAdded((module) => {
      addLiveUpdate(`New module: ${module.title}`);
    });

    // Listen for feedback
    socketService.onFeedbackSubmitted((feedback) => {
      addLiveUpdate('Instructor feedback received!');
    });

    return () => {
      socketService.off('progress-updated');
      socketService.off('assignment-created');
      socketService.off('module-added');
      socketService.off('feedback-submitted');
    };
  }, []);

  const addLiveUpdate = (message) => {
    const id = Date.now();
    setLiveUpdates(prev => [
      { id, message, timestamp: new Date() },
      ...prev.slice(0, 4) // Keep last 5
    ]);
  };

  // Calculate stats
  const totalCourses = courses.length;
  const completedCourses = courses.filter(e => e.progress === 100).length;
  const avgProgress = totalCourses > 0
    ? Math.round(courses.reduce((sum, e) => sum + (e.progress || 0), 0) / totalCourses)
    : 0;
  const hoursLearned = Math.round(totalCourses * 5); // Estimated

  return (
    <motion.div
      className="learner-dashboard-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="learner-dashboard-container">
        {/* Welcome Header */}
        <motion.div
          className="learner-dashboard-welcome"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <motion.h1
            className="learner-dashboard-welcome-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Welcome back! 👋
          </motion.h1>
          <motion.p
            className="learner-dashboard-welcome-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Continue your learning journey where you left off
          </motion.p>
        </motion.div>

        {/* Live Updates Panel */}
        <AnimatePresence>
          {showUpdates && liveUpdates.length > 0 && (
            <motion.div
              className="learner-dashboard-live-updates"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{
                background: '#eff6ff',
                border: '1px solid #7dd3fc',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '24px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Zap className="w-5 h-5 text-blue-500" />
                  <span style={{ fontWeight: '600', color: '#0c4a6e' }}>Real-Time Updates</span>
                </div>
                <button
                  onClick={() => setShowUpdates(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#0c4a6e',
                    fontSize: '20px'
                  }}
                >
                  ×
                </button>
              </div>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {liveUpdates.map((update, i) => (
                  <motion.div
                    key={update.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    style={{
                      padding: '8px 0',
                      borderBottom: i < liveUpdates.length - 1 ? '1px solid #bae6fd' : 'none',
                      fontSize: '0.875rem',
                      color: '#0369a1'
                    }}
                  >
                    <span style={{ fontWeight: '500' }}>✨ {update.message}</span>
                    <span style={{ color: '#64748b', marginLeft: '8px' }}>
                      {update.timestamp.toLocaleTimeString()}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Overview */}
        <motion.div
          className="learner-dashboard-stats-grid"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {[
            { label: 'Courses Enrolled', value: totalCourses, icon: BookOpen },
            { label: 'Completed', value: completedCourses, icon: Award },
            { label: 'In Progress', value: totalCourses - completedCourses, icon: Clock },
            { label: 'Avg. Progress', value: `${avgProgress}%`, icon: TrendingUp }
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="learner-dashboard-stat-card"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="learner-dashboard-stat-header">
                <stat.icon className="learner-dashboard-stat-icon" />
              </div>
              <div className="learner-dashboard-stat-value">{stat.value}</div>
              <div className="learner-dashboard-stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enrolled Courses */}
        <motion.div
          className="learner-dashboard-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          <motion.h2
            className="learner-dashboard-section-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.4 }}
          >
            Your Courses
          </motion.h2>

          {courses.length === 0 ? (
            <motion.div
              className="learner-dashboard-empty-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <BookOpen className="learner-dashboard-empty-icon" />
              <h3 className="learner-dashboard-empty-title">No courses enrolled yet</h3>
              <p className="learner-dashboard-empty-description">Start learning by browsing our course catalog</p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={() => navigate('/courses')}>Browse Courses</Button>
              </motion.div>
            </motion.div>
          ) : (
            <div className="learner-dashboard-courses-list">
              <AnimatePresence>
                {courses.map((enrollment, i) => {
                  const course = enrollment.course;
                  return (
                    <motion.div
                      key={enrollment._id || i}
                      className="learner-dashboard-course-card"
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ delay: 1.2 + i * 0.1, duration: 0.5 }}
                      whileHover={{ scale: 1.02, y: -3 }}
                      layout
                    >
                      <div className="learner-dashboard-course-header">
                        <div className="learner-dashboard-course-content">
                          <div className="learner-dashboard-course-title-row">
                            <h3 className="learner-dashboard-course-title">{course?.title || 'Course'}</h3>
                            <span className="learner-dashboard-course-category">
                              {course?.category || 'General'}
                            </span>
                          </div>
                          <p className="learner-dashboard-course-instructor">
                            by {course?.instructor?.name || course?.instructor || 'Instructor'}
                          </p>
                        </div>
                        <div className="learner-dashboard-course-actions">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button onClick={() => navigate(`/learner/course/${course?._id}/player`)}>
                              <Play className="w-5 h-5" /> Resume Learning
                            </Button>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              variant="ghost"
                              onClick={() => navigate(`/learner/course/${course?._id}/assignments`)}
                            >
                              Assignments
                            </Button>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              variant="ghost"
                              onClick={() => navigate(`/learner/course/${course?._id}/notes`)}
                            >
                              Notes
                            </Button>
                          </motion.div>
                        </div>
                      </div>

                      <ProgressBar
                        progress={enrollment.progress || 0}
                        label={`Progress: ${enrollment.progress || 0}%`}
                      />

                      {/* Live progress indicator */}
                      {realtimeUpdates.updatedProgress?.courseId === course._id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          style={{
                            marginTop: '8px',
                            padding: '4px 8px',
                            background: '#dcfce7',
                            color: '#166534',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <span style={{ animation: 'pulse 1s infinite' }}>●</span>
                          Live update
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Achievements */}
        <motion.div
          className="learner-dashboard-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <motion.h2
            className="learner-dashboard-section-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.4 }}
          >
            Your Achievements
          </motion.h2>
          <div className="learner-dashboard-achievements-grid">
            {[
              { title: 'First Course', desc: 'Enrolled in your first course', earned: totalCourses > 0 },
              { title: 'Quick Learner', desc: 'Completed 3 courses', earned: completedCourses >= 3 },
              { title: 'Dedicated Student', desc: 'Enrolled in 5+ courses', earned: totalCourses >= 5 },
              { title: 'Master Level', desc: 'Achieved 100% in 5 courses', earned: completedCourses >= 5 }
            ].map((badge, i) => (
              <motion.div
                key={i}
                className={`learner-dashboard-achievement-card ${badge.earned ? 'learner-dashboard-achievement-card-earned' : 'learner-dashboard-achievement-card-not-earned'}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.7 + i * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div
                  className={`learner-dashboard-achievement-icon-wrapper ${badge.earned ? 'learner-dashboard-achievement-icon-wrapper-earned' : 'learner-dashboard-achievement-icon-wrapper-not-earned'}`}
                >
                  <Award
                    className={`learner-dashboard-achievement-icon ${badge.earned ? 'learner-dashboard-achievement-icon-earned' : 'learner-dashboard-achievement-icon-not-earned'}`}
                  />
                </div>
                <h3 className="learner-dashboard-achievement-title">{badge.title}</h3>
                <p className="learner-dashboard-achievement-description">{badge.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </motion.div>
  );
};

export default Dashboard;