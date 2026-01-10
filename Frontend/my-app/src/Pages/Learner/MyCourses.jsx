import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Play } from 'lucide-react';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';
import '../../styles/MyCourses.css';

const MyCourses = ({ enrolledCourses }) => {
  const navigate = useNavigate();

  return (
    <div className="my-courses-page">
      <div className="my-courses-container">
        <h1 className="my-courses-title">My Courses</h1>
        <p className="my-courses-subtitle">Track your progress and continue learning</p>

        {enrolledCourses.length === 0 ? (
          <div className="my-courses-empty-state">
            <BookOpen className="my-courses-empty-icon" />
            <h3 className="my-courses-empty-title">No courses enrolled yet</h3>
            <p className="my-courses-empty-description">Start learning by browsing our course catalog</p>
            <Button onClick={() => navigate('/courses')}>Browse Courses</Button>
          </div>
        ) : (
          <div className="my-courses-grid">
            {enrolledCourses.map((course, i) => (
              <div key={i} className="my-courses-card">
                <div className="my-courses-card-image">
                  <BookOpen className="my-courses-card-icon" />
                </div>
                <div className="my-courses-card-content">
                  <div className="my-courses-card-category">
                    <span className="my-courses-card-category-badge">
                      {course.category}
                    </span>
                  </div>
                  <h3 className="my-courses-card-title">{course.title}</h3>
                  <p className="my-courses-card-instructor">by {course.instructor}</p>
                  
                  <div className="my-courses-card-progress">
                    <ProgressBar 
                      progress={course.progress} 
                      label="Progress"
                    />
                  </div>

                  <Button 
                    className="my-courses-card-button" 
                    onClick={() => navigate(`/learner/course/${course.id}/player`)}
                  >
                    <Play className="w-4 h-4" /> Resume Learning
                  </Button>
                  
                  <div className="my-courses-card-actions">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate(`/learner/course/${course.id}/assignments`)}
                    >
                      Assignments
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate(`/learner/course/${course.id}/notes`)}
                    >
                      Notes
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;