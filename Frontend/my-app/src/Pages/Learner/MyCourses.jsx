import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';
import '../../styles/MyCourses.css';

const MyCourses = ({ enrolledCourses }) => {
  const navigate = useNavigate();

  return (
    <motion.div 
      className="my-courses-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="my-courses-container">
        <motion.h1 
          className="my-courses-title"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          My Courses
        </motion.h1>
        <motion.p 
          className="my-courses-subtitle"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Track your progress and continue learning
        </motion.p>

        {enrolledCourses.length === 0 ? (
          <motion.div 
            className="my-courses-empty-state"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <BookOpen className="my-courses-empty-icon" />
            <h3 className="my-courses-empty-title">No courses enrolled yet</h3>
            <p className="my-courses-empty-description">Start learning by browsing our course catalog</p>
            <Button onClick={() => navigate('/courses')}>Browse Courses</Button>
          </motion.div>
        ) : (
          <div className="my-courses-grid">
            {enrolledCourses.map((enrollment, i) => {
              const course = enrollment.course;
              return (
                <motion.div 
                  key={enrollment._id || i} 
                  className="my-courses-card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                >
                  <div className="my-courses-card-image">
                    <BookOpen className="my-courses-card-icon" />
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: enrollment.progress === 100 ? '#059669' : '#3b82f6',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {enrollment.progress === 100 ? 'Completed' : `${enrollment.progress}%`}
                    </div>
                  </div>
                  <div className="my-courses-card-content">
                    <div className="my-courses-card-category">
                      <span className="my-courses-card-category-badge">
                        {course?.category || 'General'}
                      </span>
                    </div>
                    <h3 className="my-courses-card-title">{course?.title || 'Course'}</h3>
                    <p className="my-courses-card-instructor">
                      by {course?.instructor?.name || course?.instructor || 'Instructor'}
                    </p>
                    
                    <div className="my-courses-card-progress">
                      <ProgressBar 
                        progress={enrollment.progress || 0} 
                        label="Progress"
                      />
                    </div>

                    <Button 
                      className="my-courses-card-button" 
                      onClick={() => navigate(`/learner/course/${course?._id}/player`)}
                    >
                      <Play className="w-4 h-4" /> 
                      {enrollment.progress === 100 ? 'Review Course' : 'Resume Learning'}
                    </Button>
                    
                    <div className="my-courses-card-actions">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/learner/course/${course?._id}/assignments`)}
                      >
                        Assignments
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/learner/course/${course?._id}/notes`)}
                      >
                        Notes
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MyCourses;