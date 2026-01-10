import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Video, CheckCircle, FileText, Download, ArrowLeft, Trophy } from 'lucide-react'; // Added Trophy
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';
import FeedbackForm from './FeedbackForm'; // Import the UI component we created
import '../../styles/CoursePlayer.css';

const CoursePlayer = ({ enrolledCourses }) => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  
  const course = enrolledCourses.find(c => c.id === parseInt(courseId));
  
  const [currentLessonIndex, setCurrentLessonIndex] = useState(course?.currentLesson - 1 || 0);
  const [completedLessons, setCompletedLessons] = useState([]);

  if (!course) {
    return (
      <div className="course-player-page">
        <div className="course-player-container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'rgb(17, 24, 39)', marginBottom: '1rem' }}>Course not found</h1>
          <Button onClick={() => navigate('/learner/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const currentLesson = course.lessons[currentLessonIndex];

  const markAsComplete = () => {
    if (!completedLessons.includes(currentLessonIndex)) {
      setCompletedLessons([...completedLessons, currentLessonIndex]);
    }
    if (currentLessonIndex < course.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  const progress = Math.round((completedLessons.length / course.lessons.length) * 100);
  const isCourseComplete = completedLessons.length === course.lessons.length;

  return (
    <div className="course-player-page">
      <div className="course-player-container">
        <button 
          onClick={() => navigate('/learner/dashboard')}
          className="course-player-back-button"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </button>

        <div className="course-player-grid">
          {/* Main Content */}
          <div className="course-player-main">
            <div className="course-player-main-card">
              
              {/* If course is 100% complete, show Feedback Form instead of Video */}
              {isCourseComplete ? (
                <div className="course-completion-view" style={{ padding: '40px', textAlign: 'center' }}>
                   <FeedbackForm courseName={course.title} />
                </div>
              ) : (
                <>
                  <div className="course-player-video-container">
                    <Video className="course-player-video-icon" />
                  </div>
                  <div className="course-player-content">
                    <h1 className="course-player-title">{currentLesson.title}</h1>
                    <p className="course-player-description">{currentLesson.description}</p>
                    
                    <div className="course-player-actions">
                      <Button onClick={markAsComplete}>
                        <CheckCircle className="w-5 h-5" /> Mark as Complete
                      </Button>
                      {currentLessonIndex > 0 && (
                        <Button variant="ghost" onClick={() => setCurrentLessonIndex(currentLessonIndex - 1)}>
                          Previous
                        </Button>
                      )}
                      {currentLessonIndex < course.lessons.length - 1 && (
                        <Button variant="ghost" onClick={() => setCurrentLessonIndex(currentLessonIndex + 1)}>
                          Next
                        </Button>
                      )}
                    </div>

                    <div className="course-player-resources">
                      <h3 className="course-player-resources-title">Resources</h3>
                      <div className="course-player-resources-list">
                        {currentLesson.resources.map((resource, i) => (
                          <div key={i} className="course-player-resource-item">
                            <FileText className="course-player-resource-icon" />
                            <span className="course-player-resource-text">{resource}</span>
                            <Download className="course-player-resource-download" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="course-player-sidebar">
            <div className="course-player-progress-card">
              <h3 className="course-player-progress-title">Course Progress</h3>
              <ProgressBar progress={progress} showLabel={false} />
              <p className="course-player-progress-text">
                {completedLessons.length} of {course.lessons.length} lessons completed
              </p>
              {isCourseComplete && (
                <div style={{ marginTop: '10px', color: '#059669', display: 'flex', alignItems: 'center', fontSize: '0.875rem', fontWeight: '600' }}>
                  <Trophy className="w-4 h-4 mr-1" /> Course Completed!
                </div>
              )}
            </div>

            <div className="course-player-content-card">
              <h3 className="course-player-content-title">Course Content</h3>
              <div className="course-player-lessons-list">
                {course.lessons.map((lesson, i) => (
                  <div
                    key={i}
                    onClick={() => setCurrentLessonIndex(i)}
                    className={`course-player-lesson-item ${
                      i === currentLessonIndex 
                        ? 'course-player-lesson-item-active' 
                        : completedLessons.includes(i)
                        ? 'course-player-lesson-item-completed'
                        : 'course-player-lesson-item-default'
                    }`}
                  >
                    <div className="course-player-lesson-content">
                      {completedLessons.includes(i) ? (
                        <CheckCircle className="course-player-lesson-check" />
                      ) : (
                        <div className="course-player-lesson-circle"></div>
                      )}
                      <div className="course-player-lesson-info">
                        <div className="course-player-lesson-number">Lesson {i + 1}</div>
                        <div className="course-player-lesson-name">{lesson.title}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;