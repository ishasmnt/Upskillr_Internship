import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileText, User, Calendar, Award, CheckCircle, ArrowLeft, Send } from 'lucide-react';
import Button from '../../components/Button';
import { assignmentAPI } from '../../services/api';
import '../../styles/ViewSubmissions.css';

const ViewSubmissions = ({ instructorCourses }) => {
  const navigate = useNavigate();
  const { courseId, assignmentId } = useParams();
  
  const course = instructorCourses.find(c => c._id === courseId);
  
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [grading, setGrading] = useState(false);

  useEffect(() => {
    if (assignmentId) {
      fetchSubmissions();
    }
  }, [assignmentId]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      // Fetch assignment details
      const assignments = await assignmentAPI.getAssignments(courseId);
      const currentAssignment = assignments.find(a => a._id === assignmentId);
      setAssignment(currentAssignment);
      
      // Fetch submissions
      const submissionsData = await assignmentAPI.getAssignmentSubmissions(assignmentId);
      setSubmissions(submissionsData);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGradeSubmission = async () => {
    if (!grade) {
      alert('Please enter a grade');
      return;
    }

    if (parseFloat(grade) > assignment.totalMarks) {
      alert(`Grade cannot exceed ${assignment.totalMarks}`);
      return;
    }

    setGrading(true);
    try {
      await assignmentAPI.gradeSubmission(selectedSubmission._id, {
        grade: parseFloat(grade),
        feedback: feedback
      });
      
      alert('Submission graded successfully!');
      setSelectedSubmission(null);
      setGrade('');
      setFeedback('');
      await fetchSubmissions();
    } catch (error) {
      console.error('Error grading submission:', error);
      alert('Failed to grade submission');
    } finally {
      setGrading(false);
    }
  };

  if (!course) {
    return (
      <div className="view-submissions-page">
        <div className="view-submissions-container" style={{ textAlign: 'center' }}>
          <h1>Course not found</h1>
          <Button onClick={() => navigate('/instructor/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="view-submissions-page">
        <div className="view-submissions-container" style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading submissions...</p>
        </div>
      </div>
    );
  }

  if (selectedSubmission) {
    return (
      <div className="view-submissions-page">
        <div className="view-submissions-container">
          <button 
            onClick={() => setSelectedSubmission(null)}
            className="view-submissions-back-button"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Submissions
          </button>

          <div className="view-submissions-detail-card">
            <div className="view-submissions-detail-header">
              <div>
                <h1 className="view-submissions-detail-title">Review Submission</h1>
                <p className="view-submissions-detail-meta">
                  Student: {selectedSubmission.user.name} ({selectedSubmission.user.email})
                </p>
                <p className="view-submissions-detail-meta">
                  Submitted: {new Date(selectedSubmission.submittedAt).toLocaleString()}
                </p>
              </div>
              {selectedSubmission.grade !== null && (
                <div style={{ 
                  padding: '12px 24px', 
                  borderRadius: '12px', 
                  background: '#dcfce7', 
                  border: '1px solid #86efac' 
                }}>
                  <div style={{ fontSize: '0.875rem', color: '#166534', marginBottom: '4px' }}>Grade</div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#166534' }}>
                    {selectedSubmission.grade}/{assignment.totalMarks}
                  </div>
                </div>
              )}
            </div>

            <div className="view-submissions-content-section">
              <h3 className="view-submissions-section-title">Student's Submission</h3>
              <div className="view-submissions-submission-text">
                {selectedSubmission.text}
              </div>
              {selectedSubmission.file && (
                <div className="view-submissions-file-attachment">
                  <FileText className="w-5 h-5" />
                  <span>{selectedSubmission.file.originalName}</span>
                  <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    ({(selectedSubmission.file.size / 1024).toFixed(2)} KB)
                  </span>
                </div>
              )}
            </div>

            {selectedSubmission.grade === null ? (
              <div className="view-submissions-grading-section">
                <h3 className="view-submissions-section-title">Grade Submission</h3>
                <div className="view-submissions-grading-grid">
                  <div>
                    <label className="view-submissions-label">Grade (out of {assignment.totalMarks})</label>
                    <input 
                      type="number" 
                      min="0"
                      max={assignment.totalMarks}
                      step="0.5"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="view-submissions-input"
                      disabled={grading}
                    />
                  </div>
                </div>
                <div>
                  <label className="view-submissions-label">Feedback</label>
                  <textarea 
                    rows="4"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="view-submissions-textarea"
                    placeholder="Provide feedback to the student..."
                    disabled={grading}
                  />
                </div>
                <Button onClick={handleGradeSubmission} disabled={grading}>
                  <Send className="w-5 h-5" /> {grading ? 'Submitting...' : 'Submit Grade'}
                </Button>
              </div>
            ) : (
              <div className="view-submissions-graded-section">
                <h3 className="view-submissions-section-title">
                  <CheckCircle className="w-5 h-5 text-green-600 inline" /> Already Graded
                </h3>
                {selectedSubmission.feedback && (
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '8px' }}>Your Feedback:</p>
                    <p className="view-submissions-feedback-text">{selectedSubmission.feedback}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="view-submissions-page">
      <div className="view-submissions-container">
        <button 
          onClick={() => navigate(`/instructor/course/${courseId}/manage`)}
          className="view-submissions-back-button"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Course Management
        </button>

        <div className="view-submissions-header">
          <div>
            <h1 className="view-submissions-title">Assignment Submissions</h1>
            <p className="view-submissions-subtitle">
              {assignment?.title} - {course.title}
            </p>
          </div>
          <div className="view-submissions-stats">
            <div className="view-submissions-stat-item">
              <span className="view-submissions-stat-value">{submissions.length}</span>
              <span className="view-submissions-stat-label">Total Submissions</span>
            </div>
            <div className="view-submissions-stat-item">
              <span className="view-submissions-stat-value">
                {submissions.filter(s => s.grade !== null).length}
              </span>
              <span className="view-submissions-stat-label">Graded</span>
            </div>
            <div className="view-submissions-stat-item">
              <span className="view-submissions-stat-value">
                {submissions.filter(s => s.grade === null).length}
              </span>
              <span className="view-submissions-stat-label">Pending</span>
            </div>
          </div>
        </div>

        {submissions.length === 0 ? (
          <div className="view-submissions-empty-state">
            <FileText className="view-submissions-empty-icon" />
            <h3 className="view-submissions-empty-title">No submissions yet</h3>
            <p className="view-submissions-empty-description">
              Students haven't submitted this assignment yet
            </p>
          </div>
        ) : (
          <div className="view-submissions-list">
            {submissions.map((submission) => (
              <div key={submission._id} className="view-submissions-card">
                <div className="view-submissions-card-header">
                  <div className="view-submissions-card-student">
                    <div className="view-submissions-card-avatar">
                      {submission.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="view-submissions-card-name">{submission.user.name}</h3>
                      <p className="view-submissions-card-email">{submission.user.email}</p>
                    </div>
                  </div>
                  <div className="view-submissions-card-actions">
                    {submission.grade !== null ? (
                      <div className="view-submissions-card-grade-badge">
                        <Award className="w-4 h-4" />
                        {submission.grade}/{assignment.totalMarks}
                      </div>
                    ) : (
                      <span className="view-submissions-card-pending-badge">
                        Pending Review
                      </span>
                    )}
                    <Button 
                      variant="ghost" 
                      onClick={() => setSelectedSubmission(submission)}
                    >
                      {submission.grade !== null ? 'View' : 'Review & Grade'}
                    </Button>
                  </div>
                </div>
                <div className="view-submissions-card-meta">
                  <div className="view-submissions-card-meta-item">
                    <Calendar className="w-4 h-4" />
                    Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                  </div>
                  {submission.file && (
                    <div className="view-submissions-card-meta-item">
                      <FileText className="w-4 h-4" />
                      File attached
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewSubmissions;