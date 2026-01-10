import React, { useState } from 'react';
import { Star, Clock, Users, BookOpen, Play, CheckCircle, MessageSquare, Award, ArrowLeft } from 'lucide-react';
import '../../styles/CourseDetail.css';

const CourseDetail = ({ course, onBack, onStartLearning }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="course-detail-page">
      <div className="course-detail-container">
        <button 
          onClick={onBack}
          className="course-detail-back-button"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Courses
        </button>

        {/* Course Header */}
        <div className="course-detail-header">
          <div className="course-detail-category-wrapper">
            <span className="course-detail-category-badge">
              {course.category}
            </span>
          </div>
          <h1 className="course-detail-title">
            {course.title}
          </h1>
          <p className="course-detail-subtitle">
            {course.description}
          </p>

          {/* Stats Bar */}
          <div className="course-detail-stats">
            <div className="course-detail-stat">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="course-detail-stat-value">{course.rating}</span>
              <span className="course-detail-stat-muted">({course.students?.toLocaleString()} reviews)</span>
            </div>
            <div className="course-detail-stat">
              <Users className="w-5 h-5" />
              <span>{course.students?.toLocaleString()} students</span>
            </div>
            <div className="course-detail-stat">
              <Clock className="w-5 h-5" />
              <span>{course.duration}</span>
            </div>
            <div className="course-detail-stat">
              <BookOpen className="w-5 h-5" />
              <span>{course.lessons?.length || 156} lessons</span>
            </div>
          </div>

          {/* Instructor */}
          <div className="course-detail-instructor-row">
            <div className="course-detail-instructor-avatar">
              <span className="course-detail-instructor-initial">
                {course.instructor.charAt(0)}
              </span>
            </div>
            <div>
              <div className="course-detail-instructor-name">{course.instructor}</div>
              <div className="course-detail-instructor-role">Senior Web Developer & Tech Lead</div>
            </div>
          </div>
        </div>

        {/* Video Preview & Enrollment Card */}
        <div className="course-detail-main-grid">
          <div className="course-detail-video-column">
            <div className="course-detail-video-card">
              <div className="course-detail-video-frame">
                <img 
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=450&fit=crop" 
                  alt="Course preview"
                  className="course-detail-video-image"
                />
                <div className="course-detail-video-overlay">
                  <div className="course-detail-play-button">
                    <Play className="w-10 h-10 text-white ml-1" fill="white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="course-detail-sidebar-column">
            <div className="course-detail-enroll-card">
              <div className="course-detail-price-block">
                <div className="course-detail-price">FREE</div>
                <div className="course-detail-price-note">Full lifetime access</div>
              </div>

              <button 
                onClick={onStartLearning}
                className="course-detail-enroll-button"
              >
                Enroll Now - It's Free!
              </button>

              <div className="course-detail-feature-list">
                <div className="course-detail-feature-item">
                  <CheckCircle className="course-detail-feature-icon" />
                  <span>Lifetime access</span>
                </div>
                <div className="course-detail-feature-item">
                  <CheckCircle className="course-detail-feature-icon" />
                  <span>Certificate of completion</span>
                </div>
                <div className="course-detail-feature-item">
                  <CheckCircle className="course-detail-feature-icon" />
                  <span>Download resources</span>
                </div>
                <div className="course-detail-feature-item">
                  <CheckCircle className="course-detail-feature-icon" />
                  <span>Mobile & TV access</span>
                </div>
              </div>

              <div className="course-detail-cta-grid">
                <button className="course-detail-cta-button">
                  <MessageSquare className="w-5 h-5" />
                  <span className="course-detail-cta-label">Share</span>
                </button>
                <button className="course-detail-cta-button">
                  <Award className="w-5 h-5" />
                  <span className="course-detail-cta-label">Gift</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="course-detail-tabs">
          <div className="course-detail-tabs-list">
            {['overview', 'curriculum', 'instructor'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`course-detail-tab ${activeTab === tab ? 'course-detail-tab-active' : ''}`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="course-detail-tab-indicator"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="course-detail-overview">
            {/* What You'll Learn */}
            <div className="course-detail-section-card">
              <h2 className="course-detail-section-title">What You'll Learn</h2>
              <div className="course-detail-learn-grid">
                {[
                  'Build 15+ real-world projects for your portfolio',
                  'Master HTML5, CSS3, and modern JavaScript (ES6+)',
                  'Learn React.js and build dynamic web applications',
                  'Understand backend development with Node.js and Express',
                  'Work with databases - MongoDB and SQL',
                  'Deploy your applications to production',
                  'Get job-ready with interview preparation',
                  'Earn a performance-based certificate'
                ].map((item, i) => (
                  <div key={i} className="course-detail-learn-item">
                    <CheckCircle className="course-detail-learn-icon" />
                    <span className="course-detail-learn-text">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div>
              <h2 className="course-detail-section-title">Requirements</h2>
              <div className="course-detail-requirements">
                {[
                  'No prior programming experience needed',
                  'A computer with internet connection',
                  'Willingness to learn and practice'
                ].map((item, i) => (
                  <div key={i} className="course-detail-requirement-item">
                    <div className="course-detail-requirement-bullet"></div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="course-detail-section-title">Description</h2>
              <div className="course-detail-description-text">
                <p>
                  Welcome to the most comprehensive web development course available online! Whether you're a complete beginner or looking to enhance your existing skills, this course will take you from zero to hero.
                </p>
                <p>
                  You'll learn by building real projects that you can add to your portfolio. Each section builds upon the previous one, ensuring you develop a solid foundation in web development.
                </p>
                <p>
                  By the end of this course, you'll be confident in your ability to build full-stack web applications and you'll be ready to start your career as a professional web developer.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'curriculum' && (
          <div className="course-detail-curriculum">
            <h2 className="course-detail-section-title">Course Curriculum</h2>
            {(course.lessons?.length > 0 ? course.lessons : [
              { title: 'Introduction to Web Development', description: 'Get started with the fundamentals', duration: '15 min' },
              { title: 'HTML & CSS Basics', description: 'Learn the building blocks of the web', duration: '45 min' },
              { title: 'JavaScript Fundamentals', description: 'Master the language of the web', duration: '60 min' },
              { title: 'Advanced React Concepts', description: 'Build modern web applications', duration: '75 min' },
              { title: 'Backend with Node.js', description: 'Create server-side applications', duration: '90 min' },
              { title: 'Database Integration', description: 'Work with MongoDB and SQL', duration: '60 min' },
              { title: 'Deployment & DevOps', description: 'Launch your applications', duration: '45 min' },
              { title: 'Final Project', description: 'Build a complete full-stack application', duration: '120 min' }
            ]).map((lesson, i) => (
              <div key={i} className="course-detail-lesson-card">
                <div className="course-detail-lesson-header">
                  <div className="course-detail-lesson-main">
                    <div className="course-detail-lesson-number">
                      <span className="course-detail-lesson-number-text">{i + 1}</span>
                    </div>
                    <div>
                      <h3 className="course-detail-lesson-title">{lesson.title}</h3>
                      <p className="course-detail-lesson-description">{lesson.description}</p>
                    </div>
                  </div>
                  <div className="course-detail-lesson-meta">
                    <Clock className="w-4 h-4" />
                    <span className="course-detail-lesson-duration">{lesson.duration || '15 min'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'instructor' && (
          <div className="course-detail-instructor-card">
            <div className="course-detail-instructor-header">
              <div className="course-detail-instructor-avatar-large">
                {course.instructor.charAt(0)}
              </div>
              <div>
                <h2 className="course-detail-instructor-title">{course.instructor}</h2>
                <p className="course-detail-instructor-subtitle">Senior Web Developer & Tech Lead</p>
                <div className="course-detail-instructor-stats">
                  <div className="course-detail-instructor-stat">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span>{course.rating} Instructor Rating</span>
                  </div>
                  <div className="course-detail-instructor-stat">
                    <Users className="w-5 h-5" />
                    <span>{course.students?.toLocaleString()} Students</span>
                  </div>
                  <div className="course-detail-instructor-stat">
                    <BookOpen className="w-5 h-5" />
                    <span>5 Courses</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="course-detail-instructor-bio">
              With over 10 years of experience in web development and teaching, I'm passionate about making 
              complex concepts accessible to everyone. I've worked with startups and Fortune 500 companies, 
              and now I'm dedicated to helping students achieve their career goals through practical, 
              project-based learning. My teaching philosophy focuses on hands-on experience and real-world 
              applications, ensuring that every student gains the confidence and skills needed to succeed 
              in the tech industry.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;