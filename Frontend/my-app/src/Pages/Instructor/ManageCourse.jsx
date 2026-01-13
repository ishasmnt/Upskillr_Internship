import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Users, BookOpen, Star, BarChart3, MessageSquare, Edit, Upload, FileText, ArrowLeft } from 'lucide-react';
import Button from '../../components/Button';
import { courseAPI } from '../../services/api';
import '../../styles/ManageCourse.css';

const ManageCourse = ({ instructorCourses, onRefresh }) => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    category: '',
    duration: '',
    status: 'Draft'
  });

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const data = await courseAPI.getCourseById(courseId);
      setCourse(data);
      setEditData({
        title: data.title,
        description: data.description,
        category: data.category,
        duration: data.duration,
        status: data.status
      });
    } catch (error) {
      console.error('Error fetching course:', error);
      // Fallback to local data
      const localCourse = instructorCourses.find(c => c._id === courseId);
      if (localCourse) {
        setCourse(localCourse);
        setEditData({
          title: localCourse.title,
          description: localCourse.description,
          category: localCourse.category,
          duration: localCourse.duration,
          status: localCourse.status
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCourse = async () => {
    try {
      await courseAPI.updateCourse(courseId, editData);
      await fetchCourseDetails();
      if (onRefresh) await onRefresh();
      setEditing(false);
      alert('Course updated successfully!');
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Failed to update course');
    }
  };

  if (loading) {
    return (
      <div className="manage-course-page">
        <div className="manage-course-container" style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading course details...</p>
        </div>
      </div>
    );
  }

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
              {editing ? (
                <div style={{ marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '20px' }}>Edit Course Details</h2>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Title</label>
                    <input
                      type="text"
                      value={editData.title}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Description</label>
                    <textarea
                      value={editData.description}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      rows="4"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Category</label>
                      <select
                        value={editData.category}
                        onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '1rem'
                        }}
                      >
                        <option>Development</option>
                        <option>Design</option>
                        <option>Data Science</option>
                        <option>Business</option>
                        <option>Marketing</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Duration</label>
                      <input
                        type="text"
                        value={editData.duration}
                        onChange={(e) => setEditData({ ...editData, duration: e.target.value })}
                        placeholder="e.g., 10h"
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Status</label>
                    <select
                      value={editData.status}
                      onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    >
                      <option>Draft</option>
                      <option>Published</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <Button onClick={handleUpdateCourse}>Save Changes</Button>
                    <Button variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                    <div>
                      <h1 className="manage-course-title">{course.title}</h1>
                      <p className="manage-course-description">{course.description}</p>
                    </div>
                    <Button variant="ghost" onClick={() => setEditing(true)}>
                      <Edit className="w-4 h-4" /> Edit
                    </Button>
                  </div>

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
                      <div className="manage-course-stat-value">{course.students || 0}</div>
                      <div className="manage-course-stat-label">Students</div>
                    </div>
                    <div className="manage-course-stat-card">
                      <BookOpen className="manage-course-stat-icon" />
                      <div className="manage-course-stat-value">
                        {course.modules?.length || 0}
                      </div>
                      <div className="manage-course-stat-label">Modules</div>
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
                        onClick={() => navigate(`/instructor/course/${course._id}/modules`)}
                      >
                        <Plus className="w-5 h-5" /> Manage Modules ({course.modules?.length || 0})
                      </Button>
                      <Button 
                        className="manage-course-sidebar-action"
                        onClick={() => navigate(`/instructor/course/${course._id}/assignments`)}
                      >
                        <FileText className="w-5 h-5" /> Manage Assignments ({course.assignments?.length || 0})
                      </Button>
                      <Button 
                        className="manage-course-action-full"
                        onClick={() => navigate(`/instructor/course/${course._id}/notes`)}
                      >
                        <Upload className="w-5 h-5" /> Manage Notes ({course.notes?.length || 0})
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="manage-course-sidebar">
            <div className="manage-course-sidebar-card">
              <h3 className="manage-course-sidebar-title">Quick Info</h3>
              <div style={{ padding: '16px 0' }}>
                <div style={{ marginBottom: '12px' }}>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '4px' }}>Duration</p>
                  <p style={{ fontWeight: '600' }}>{course.duration || 'Not set'}</p>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '4px' }}>Category</p>
                  <p style={{ fontWeight: '600' }}>{course.category}</p>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '4px' }}>Status</p>
                  <p style={{ fontWeight: '600' }}>{course.status}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '4px' }}>Created</p>
                  <p style={{ fontWeight: '600' }}>
                    {course.createdAt ? new Date(course.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCourse;