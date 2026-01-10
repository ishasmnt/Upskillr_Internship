import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Users, BookOpen, Star, BarChart3, MessageSquare, Edit, Upload, FileText, ArrowLeft } from 'lucide-react';
import Button from '../../components/Button';
import '../../styles/ManageCourse.css';

const ManageCourse = ({ instructorCourses }) => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  
  const course = instructorCourses.find(c => c.id === parseInt(courseId));

  if (!course) {
    return (
      <div className="manage-course-page">
        <div className="manage-course-container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'rgb(17, 24, 39)', marginBottom: '1rem' }}>Course not found</h1>
          <Button onClick={() => navigate('/instructor/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-course-page">
      <div className="manage-course-container">
        <button 
          onClick={() => navigate('/instructor/dashboard')}
          className="manage-course-back-button"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </button>

        <div className="manage-course-grid">
          <div className="manage-course-main">
            <div className="manage-course-main-card">
              <h1 className="manage-course-title">{course.title}</h1>
              <p className="manage-course-description">{course.description}</p>
              
              <div className="manage-course-badges">
                <span className={`manage-course-status-badge ${
                  course.status === 'Published' 
                    ? 'manage-course-status-published' 
                    : 'manage-course-status-draft'
                }`}>
                  {course.status}
                </span>
                <span className="manage-course-category-badge">
                  {course.category}
                </span>
              </div>

              <div className="manage-course-stats-grid">
                <div className="manage-course-stat-card">
                  <Users className="manage-course-stat-icon" />
                  <div className="manage-course-stat-value">{course.students}</div>
                  <div className="manage-course-stat-label">Students</div>
                </div>
                <div className="manage-course-stat-card">
                  <BookOpen className="manage-course-stat-icon" />
                  <div className="manage-course-stat-value">{course.lessons?.length || 0}</div>
                  <div className="manage-course-stat-label">Lessons</div>
                </div>
                <div className="manage-course-stat-card">
                  <Star className="manage-course-stat-icon" style={{ color: 'rgb(234, 179, 8)' }} />
                  <div className="manage-course-stat-value">{course.rating || 'N/A'}</div>
                  <div className="manage-course-stat-label">Rating</div>
                </div>
              </div>

              <div className="manage-course-section">
                <h3 className="manage-course-section-title">Course Management</h3>
                <div className="manage-course-actions-grid">
                  <Button 
                    className="manage-course-sidebar-action"
                    onClick={() => navigate(`/instructor/course/${course.id}/modules`)}
                  >
                    <Plus className="w-5 h-5" /> Add Modules
                  </Button>
                  <Button 
                    className="manage-course-sidebar-action"
                    onClick={() => navigate(`/instructor/course/${course.id}/assignments`)}
                  >
                    <FileText className="w-5 h-5" /> Add Assignments
                  </Button>
                  <Button 
                    className="manage-course-action-full"
                    onClick={() => navigate(`/instructor/course/${course.id}/notes`)}
                  >
                    <Upload className="w-5 h-5" /> Upload Notes
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="manage-course-sidebar">
            <div className="manage-course-sidebar-card">
              <h3 className="manage-course-sidebar-title">Quick Actions</h3>
              <div className="manage-course-sidebar-actions">
                <Button className="manage-course-sidebar-action" variant="ghost">
                  <BarChart3 className="w-5 h-5" /> View Analytics
                </Button>
                <Button className="manage-course-sidebar-action" variant="ghost">
                  <MessageSquare className="w-5 h-5" /> Student Reviews
                </Button>
                <Button className="manage-course-sidebar-action" variant="ghost">
                  <Edit className="w-5 h-5" /> Edit Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCourse;