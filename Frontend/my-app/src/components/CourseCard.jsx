import React from 'react';
import { Star, Clock, Users, BookOpen, Play } from 'lucide-react';
import Button from './Button';
import '../styles/CourseCard.css';

const CourseCard = ({ course, enrolled = false, onEnroll, onResume, className = '' }) => {
  return (
    <div className={`course-card ${className}`}>
      <div className="course-card-image-container">
        <div className="course-card-image-inner">
          <img src={course.image} alt={course.title} className="course-card-image" />
        </div>
        {enrolled && (
          <div className="course-card-enrolled-badge">
            Enrolled
          </div>
        )}
        <div className="course-card-category-badge">
          {course.category}
        </div>
      </div>
      <div className="course-card-content">
        <h3 className="course-card-title">
          {course.title}
        </h3>
        <p className="course-card-description">{course.description}</p>
        
        <div className="course-card-instructor">
          <Users className="w-4 h-4" />
          <span>by {course.instructor}</span>
        </div>

        <div className="course-card-meta">
          <div className="course-card-meta-left">
            <div className="course-card-meta-item">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className='text-blue-400'>{course.duration}</span>
            </div>
            <div className="course-card-meta-item">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-yellow-400">{course.rating}</span>
            </div>
          </div>
          {!enrolled && course.price && (
            <div className="course-card-price">
              <span className="course-card-price-value">Free</span>
            </div>
          )}
        </div>

        {enrolled ? (
          <Button className="course-card-full-width" onClick={onResume}>
            <Play className="w-4 h-4" /> Resume Learning
          </Button>
        ) : (
          <Button className="course-card-full-width" onClick={onEnroll}>
            Enroll Now
          </Button>
        )}
      </div>
    </div>
  );
};

export default CourseCard;