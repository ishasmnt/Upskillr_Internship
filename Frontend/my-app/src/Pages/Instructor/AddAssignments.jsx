import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, FileText, Trash2, Calendar, Save, ArrowLeft, Users } from 'lucide-react';
import Button from '../../components/Button';
import { assignmentAPI } from '../../services/api';
import ScrollToTop from '../../components/ScrollToTop';
import '../../styles/AddAssignments.css';

const AddAssignments = ({ instructorCourses, onRefresh }) => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  
  const course = instructorCourses.find(c => c._id === courseId);
  
  const [assignments, setAssignments] = useState([]);
  const [submissionCounts, setSubmissionCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: '',
    totalMarks: '',
    instructions: '',
    type: 'Written'
  });

  useEffect(() => {
    if (course) {
      fetchAssignments();
    }
  }, [courseId]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const data = await assignmentAPI.getAssignments(courseId);
      setAssignments(data);
      
      // Fetch submission counts for each assignment
      const counts = {};
      for (const assignment of data) {
        try {
          const submissions = await assignmentAPI.getAssignmentSubmissions(assignment._id);
          counts[assignment._id] = submissions.length;
        } catch (err) {
          counts[assignment._id] = 0;
        }
      }
      setSubmissionCounts(counts);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!course) {
    return (
      <div className="add-assignments-page">
        <div className="add-assignments-container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'rgb(17, 24, 39)', marginBottom: '1rem' }}>Course not found</h1>
          <Button onClick={() => navigate('/instructor/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const addAssignment = async () => {
    if (!newAssignment.title || !newAssignment.description) {
      alert('Please fill in required fields');
      return;
    }

    setSaving(true);
    try {
      await assignmentAPI.createAssignment(courseId, newAssignment);
      await fetchAssignments();
      setNewAssignment({ 
        title: '', 
        description: '', 
        dueDate: '', 
        totalMarks: '', 
        instructions: '', 
        type: 'Written' 
      });
      setShowAssignmentModal(false);
      alert('Assignment added successfully!');
    } catch (error) {
      console.error('Error creating assignment:', error);
      alert('Failed to create assignment');
    } finally {
      setSaving(false);
    }
  };

  const deleteAssignment = async (assignmentId) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;

    try {
      await assignmentAPI.deleteAssignment(assignmentId);
      await fetchAssignments();
      alert('Assignment deleted successfully!');
    } catch (error) {
      console.error('Error deleting assignment:', error);
      alert('Failed to delete assignment');
    }
  };

  if (loading) {
    return (
      <div className="add-assignments-page">
        <div className="add-assignments-container" style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />
      <div className="add-assignments-page">
        <div className="add-assignments-container">
          <button 
            onClick={() => navigate(`/instructor/course/${courseId}/manage`)}
            className="add-assignments-back-button"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Course Management
          </button>

          <div className="add-assignments-card">
            <div className="add-assignments-header">
              <div className="add-assignments-header-content">
                <h1 className="add-assignments-title">Add Course Assignments</h1>
                <p className="add-assignments-subtitle">Course: {course.title}</p>
              </div>
              <div className="add-assignments-actions">
                <Button onClick={() => setShowAssignmentModal(true)}>
                  <Plus className="w-5 h-5" /> Add New Assignment
                </Button>
              </div>
            </div>

            {/* Assignment List */}
            {assignments.length === 0 ? (
              <div className="add-assignments-empty-state">
                <FileText className="add-assignments-empty-icon" />
                <h3 className="add-assignments-empty-title">No assignments created yet</h3>
                <p className="add-assignments-empty-description">Add assignments to assess your students' learning</p>
                <Button onClick={() => setShowAssignmentModal(true)}>
                  <Plus className="w-5 h-5" /> Create First Assignment
                </Button>
              </div>
            ) : (
              <div className="add-assignments-list">
                {assignments.map((assignment, index) => (
                  <div key={assignment._id} className="add-assignments-item">
                    <div className="add-assignments-item-header">
                      <div className="add-assignments-item-content">
                        <div className="add-assignments-item-title-row">
                          <div className="add-assignments-item-number">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="add-assignments-item-title">{assignment.title}</h3>
                            <div className="add-assignments-item-meta">
                              <span className="add-assignments-item-badge">
                                {assignment.type}
                              </span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <FileText className="w-3 h-3" />
                                {assignment.totalMarks} marks
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="add-assignments-item-description">{assignment.description}</p>
                        
                        <div className="add-assignments-item-details">
                          <div className="add-assignments-item-detail">
                            <Calendar className="w-4 h-4 text-purple-600" />
                            <span>Due: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No deadline'}</span>
                          </div>
                        </div>

                        {assignment.instructions && (
                          <div className="add-assignments-item-instructions">
                            <p className="add-assignments-item-instructions-title">Instructions:</p>
                            <p className="add-assignments-item-instructions-text">{assignment.instructions}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="add-assignments-item-actions">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/instructor/course/${courseId}/assignments/${assignment._id}/submissions`)}
                        >
                          <Users className="w-4 h-4" /> View Submissions ({submissionCounts[assignment._id] || 0})
                        </Button>
                        <button
                          onClick={() => deleteAssignment(assignment._id)}
                          className="add-assignments-delete-button"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tips Section */}
          <div className="add-assignments-tips">
            <h3 className="add-assignments-tips-title">📝 Assignment Best Practices</h3>
            <ul className="add-assignments-tips-list">
              <li className="add-assignments-tips-item">
                <span className="add-assignments-tips-bullet">•</span>
                <span>Clearly define learning objectives for each assignment</span>
              </li>
              <li className="add-assignments-tips-item">
                <span className="add-assignments-tips-bullet">•</span>
                <span>Provide detailed instructions and grading criteria</span>
              </li>
              <li className="add-assignments-tips-item">
                <span className="add-assignments-tips-bullet">•</span>
                <span>Set reasonable deadlines that give students enough time</span>
              </li>
              <li className="add-assignments-tips-item">
                <span className="add-assignments-tips-bullet">•</span>
                <span>Include examples or templates to guide students</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Add Assignment Modal */}
        {showAssignmentModal && (
          <div className="add-assignments-modal-overlay" onClick={() => !saving && setShowAssignmentModal(false)}>
            <div className="add-assignments-modal-content" onClick={(e) => e.stopPropagation()}>
              <h2 className="add-assignments-modal-title">Create New Assignment</h2>
              <div className="add-assignments-modal-form">
                <div>
                  <label className="add-assignments-modal-label">Assignment Title *</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Build a React Todo App"
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                    className="add-assignments-modal-input"
                    disabled={saving}
                  />
                </div>

                <div>
                  <label className="add-assignments-modal-label">Assignment Type</label>
                  <select 
                    value={newAssignment.type}
                    onChange={(e) => setNewAssignment({...newAssignment, type: e.target.value})}
                    className="add-assignments-modal-input"
                    disabled={saving}
                  >
                    <option>Written</option>
                    <option>Project</option>
                    <option>Quiz</option>
                    <option>Coding Challenge</option>
                    <option>Presentation</option>
                  </select>
                </div>
                
                <div>
                  <label className="add-assignments-modal-label">Description *</label>
                  <textarea 
                    placeholder="What should students accomplish in this assignment?"
                    rows="3"
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                    className="add-assignments-modal-textarea"
                    disabled={saving}
                  ></textarea>
                </div>

                <div>
                  <label className="add-assignments-modal-label">Detailed Instructions</label>
                  <textarea 
                    placeholder="Step-by-step instructions for students..."
                    rows="4"
                    value={newAssignment.instructions}
                    onChange={(e) => setNewAssignment({...newAssignment, instructions: e.target.value})}
                    className="add-assignments-modal-textarea"
                    disabled={saving}
                  ></textarea>
                </div>

                <div className="add-assignments-modal-grid">
                  <div>
                    <label className="add-assignments-modal-label">Due Date</label>
                    <input 
                      type="date" 
                      value={newAssignment.dueDate}
                      onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                      className="add-assignments-modal-input"
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className="add-assignments-modal-label">Total Marks</label>
                    <input 
                      type="number" 
                      placeholder="100"
                      value={newAssignment.totalMarks}
                      onChange={(e) => setNewAssignment({...newAssignment, totalMarks: e.target.value})}
                      className="add-assignments-modal-input"
                      disabled={saving}
                    />
                  </div>
                </div>

                <div className="add-assignments-modal-actions">
                  <Button 
                    className="add-assignments-modal-button-flex" 
                    onClick={addAssignment}
                    disabled={saving}
                  >
                    <Plus className="w-5 h-5" /> {saving ? 'Creating...' : 'Create Assignment'}
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowAssignmentModal(false)}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AddAssignments;