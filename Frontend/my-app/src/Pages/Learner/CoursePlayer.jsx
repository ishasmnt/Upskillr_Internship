import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Video, CheckCircle, FileText, Download, ArrowLeft, Trophy } from 'lucide-react';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';
import FeedbackForm from './FeedbackForm';
import { enrollmentAPI, moduleAPI } from '../../services/api';
import '../../styles/CoursePlayer.css';

const CoursePlayer = ({ enrolledCourses, onRefresh }) => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  
  const enrollment = enrolledCourses.find(e => e.course?._id === courseId);
  const course = enrollment?.course;
  
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [completedModules, setCompletedModules] = useState(enrollment?.completedLessons || []);
  const [progress, setProgress] = useState(enrollment?.progress || 0);
  const [videoUrl, setVideoUrl] = useState(null);

  // Fetch video URL
useEffect(() => {
  const fetchVideoUrl = async () => {
    if (currentModule?.videoPath) {
      // If it's a Cloudinary URL, use it directly
      if (currentModule.videoPath.includes('cloudinary.com')) {
        setVideoUrl(currentModule.videoPath);
      } else {
        // Otherwise fetch from streaming endpoint
        try {
          const response = await fetch(moduleAPI.getVideoStreamUrl(currentModule._id));
          const data = await response.json();
          setVideoUrl(data.videoUrl);
        } catch (error) {
          console.error('Error fetching video:', error);
        }
      }
    }
  };
  
  fetchVideoUrl();
}, [currentModule]);

  useEffect(() => {
    if (course) {
      fetchModules();
    }
  }, [courseId]);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const data = await moduleAPI.getModules(courseId);
      setModules(data);
    } catch (error) {
      console.error('Error fetching modules:', error);
      // Fallback to lessons if modules not found
      if (course?.lessons) {
        setModules(course.lessons.map((lesson, idx) => ({
          _id: idx,
          title: lesson.title,
          description: lesson.description,
          resources: lesson.resources || []
        })));
      }
    } finally {
      setLoading(false);
    }
  };

  if (!enrollment || !course) {
    return (
      <div className="course-player-page">
        <div className="course-player-container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'rgb(17, 24, 39)', marginBottom: '1rem' }}>
            Course not found or not enrolled
          </h1>
          <Button onClick={() => navigate('/learner/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const currentModule = modules[currentModuleIndex];

  const markAsComplete = async () => {
    if (!completedModules.includes(currentModuleIndex)) {
      const newCompleted = [...completedModules, currentModuleIndex];
      setCompletedModules(newCompleted);
      
      // Calculate new progress
      const newProgress = Math.round((newCompleted.length / modules.length) * 100);
      setProgress(newProgress);

      // Update backend
      try {
        await enrollmentAPI.updateProgress(courseId, {
          progress: newProgress,
          currentLesson: currentModuleIndex + 1,
          completedLessons: newCompleted
        });
        if (onRefresh) await onRefresh();
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    }
    
    // Move to next module if available
    if (currentModuleIndex < modules.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
    }
  };

  const isCourseComplete = completedModules.length === modules.length && modules.length > 0;

  if (loading) {
    return (
      <div className="course-player-page">
        <div className="course-player-container" style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading course content...</p>
        </div>
      </div>
    );
  }

  // Get video URL for current module
  const getVideoUrl = (module) => {
    if (module?.videoPath) {
      // Use streaming endpoint for uploaded videos
      return moduleAPI.getVideoStreamUrl(module._id);
    }
    return null;
  };

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
              ) : modules.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center' }}>
                  <Video className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '8px' }}>
                    No modules available yet
                  </h3>
                  <p style={{ color: '#6b7280' }}>
                    The instructor is still creating content for this course.
                  </p>
                </div>
              ) : (
                <>
                  <div className="course-player-video-container">
                    {getVideoUrl(currentModule) ? (
                     <video
                      key={currentModule._id}
                      controls
                      src={videoUrl}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '12px',
                        background: '#000'
                      }}
                    >
                      Your browser does not support the video tag.
                    </video>
                    ) : (
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        height: '100%',
                        background: '#f3f4f6',
                        flexDirection: 'column',
                        gap: '12px'
                      }}>
                        <Video className="course-player-video-icon" />
                        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                          Video not available
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="course-player-content">
                    <h1 className="course-player-title">{currentModule?.title}</h1>
                    <p className="course-player-description">{currentModule?.description}</p>
                    
                    {currentModule?.videoFileName && (
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        color: '#6b7280',
                        fontSize: '0.875rem',
                        marginTop: '8px'
                      }}>
                        <Video className="w-4 h-4" />
                        <span>{currentModule.videoFileName}</span>
                        {currentModule.videoSize && (
                          <span className="text-gray-400">({currentModule.videoSize})</span>
                        )}
                      </div>
                    )}
                    
                    <div className="course-player-actions">
                      <Button onClick={markAsComplete}>
                        <CheckCircle className="w-5 h-5" /> Mark as Complete
                      </Button>
                      {currentModuleIndex > 0 && (
                        <Button variant="ghost" onClick={() => setCurrentModuleIndex(currentModuleIndex - 1)}>
                          Previous
                        </Button>
                      )}
                      {currentModuleIndex < modules.length - 1 && (
                        <Button variant="ghost" onClick={() => setCurrentModuleIndex(currentModuleIndex + 1)}>
                          Next
                        </Button>
                      )}
                    </div>

                    {currentModule?.resources && currentModule.resources.length > 0 && (
                      <div className="course-player-resources">
                        <h3 className="course-player-resources-title">Resources</h3>
                        <div className="course-player-resources-list">
                          {currentModule.resources.map((resource, i) => (
                            <div key={i} className="course-player-resource-item">
                              <FileText className="course-player-resource-icon" />
                              <span className="course-player-resource-text">{resource}</span>
                              <Download className="course-player-resource-download" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
                {completedModules.length} of {modules.length} modules completed
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
                {modules.length === 0 ? (
                  <p style={{ padding: '16px', textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>
                    No modules available
                  </p>
                ) : (
                  modules.map((module, i) => (
                    <div
                      key={module._id || i}
                      onClick={() => setCurrentModuleIndex(i)}
                      className={`course-player-lesson-item ${
                        i === currentModuleIndex 
                          ? 'course-player-lesson-item-active' 
                          : completedModules.includes(i)
                          ? 'course-player-lesson-item-completed'
                          : 'course-player-lesson-item-default'
                      }`}
                    >
                      <div className="course-player-lesson-content">
                        {completedModules.includes(i) ? (
                          <CheckCircle className="course-player-lesson-check" />
                        ) : (
                          <div className="course-player-lesson-circle"></div>
                        )}
                        <div className="course-player-lesson-info">
                          <div className="course-player-lesson-number">Module {i + 1}</div>
                          <div className="course-player-lesson-name">{module.title}</div>
                          {module.duration && (
                            <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '2px' }}>
                              {module.duration}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;