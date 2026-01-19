import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Upload,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Send,
  Award
} from 'lucide-react';
import Button from '../../components/Button';
import { assignmentAPI } from '../../services/api';
import ScrollToTop from '../../components/ScrollToTop';
import '../../styles/SubmitAssignment.css';

const SubmitAssignment = ({ enrolledCourses }) => {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const enrollment = enrolledCourses.find(e => e.course?._id === courseId);
  const course = enrollment?.course;

  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (courseId) {
      fetchAssignmentsAndSubmissions();
    }
  }, [courseId]);

  const fetchAssignmentsAndSubmissions = async () => {
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');
      
      // Fetch assignments
      const assignmentsRes = await fetch(`${API_URL}/assignments/${courseId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const assignmentsData = await assignmentsRes.json();
      setAssignments(assignmentsData);

      // Fetch submissions for each assignment
      const submissionsMap = {};
      for (const assignment of assignmentsData) {
        try {
          const submissionRes = await fetch(`${API_URL}/assignments/${assignment._id}/my-submission`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const submissionData = await submissionRes.json();
          if (submissionData && submissionData._id) {
            submissionsMap[assignment._id] = submissionData;
          }
        } catch (err) {
          // No submission yet
        }
      }
      setSubmissions(submissionsMap);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!course) {
    return (
      <div className="submit-assignment-page no-course-found">
        <h1>Course not found</h1>
        <button 
          onClick={() => navigate('/learner/dashboard')} 
          className="submit-assignment-list-item-button"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!submissionText && !uploadedFile) {
      alert('Please provide submission text or upload a file');
      return;
    }

    setSubmitting(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');
      
      const formData = new FormData();
      formData.append('text', submissionText);
      if (uploadedFile) {
        formData.append('file', uploadedFile);
      }

      const response = await fetch(`${API_URL}/assignments/${selectedAssignment._id}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Submission failed');
      }

      alert('Assignment submitted successfully!');
      setSelectedAssignment(null);
      setSubmissionText('');
      setUploadedFile(null);
      await fetchAssignmentsAndSubmissions();
    } catch (error) {
      console.error('Submission error:', error);
      alert(error.message || 'Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
  };

  if (selectedAssignment) {
    const submission = submissions[selectedAssignment._id];
    
    return (
      <>
        <ScrollToTop />
        <div className="submit-assignment-detail-container">
          <button
            onClick={() => setSelectedAssignment(null)}
            className="submit-assignment-back-button"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Assignments
          </button>

          <div className="submit-assignment-detail-card">
            <div className="submit-assignment-detail-header">
              <div className="submit-assignment-detail-title-row">
                <h1 className="submit-assignment-detail-title">{selectedAssignment.title}</h1>
                {submission ? (
                  <span className="submit-assignment-status-badge submit-assignment-status-submitted">
                    Submitted
                  </span>
                ) : (
                  <span className="submit-assignment-status-badge submit-assignment-status-pending">
                    Pending
                  </span>
                )}
              </div>
              <p className="submit-assignment-detail-description">{selectedAssignment.description}</p>
              
              <div className="submit-assignment-detail-meta-grid">
                <div className="submit-assignment-detail-meta-item">
                  <div className="submit-assignment-detail-meta-label">Due Date</div>
                  <div className="submit-assignment-detail-meta-value">
                    <Calendar className="w-4 h-4" />
                    {new Date(selectedAssignment.dueDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="submit-assignment-detail-meta-item">
                  <div className="submit-assignment-detail-meta-label">Total Marks</div>
                  <div className="submit-assignment-detail-meta-value">{selectedAssignment.totalMarks} points</div>
                </div>
                <div className="submit-assignment-detail-meta-item">
                  <div className="submit-assignment-detail-meta-label">Type</div>
                  <div className="submit-assignment-detail-meta-value">{selectedAssignment.type}</div>
                </div>
              </div>
            </div>

            {selectedAssignment.instructions && (
              <div className="submit-assignment-instructions">
                <h3 className="submit-assignment-instructions-title">Instructions</h3>
                <p className="submit-assignment-instructions-text">{selectedAssignment.instructions}</p>
              </div>
            )}

            {submission ? (
              <div className="submit-assignment-submission-display">
                <div className="submit-assignment-submission-header">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h3 className="submit-assignment-submission-title">Your Submission</h3>
                </div>
                <div className="submit-assignment-submission-content">
                  <p className="submit-assignment-submission-text">{submission.text}</p>
                  {submission.file && (
                    <div className="submit-assignment-submission-file">
                      <FileText className="w-4 h-4" />
                      <span>{submission.file.originalName}</span>
                    </div>
                  )}
                </div>
                {submission.grade !== null && (
                  <div className="submit-assignment-grade-display">
                    <div className="submit-assignment-grade-header">
                      <Award className="w-5 h-5 text-green-600" />
                      <span>Grade: {submission.grade}/{selectedAssignment.totalMarks}</span>
                    </div>
                    {submission.feedback && (
                      <div>
                        <p className="submit-assignment-feedback-label">Feedback:</p>
                        <p className="submit-assignment-feedback-text">{submission.feedback}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="submit-assignment-form">
                <div>
                  <label className="submit-assignment-form-label">Your Submission</label>
                  <textarea
                    rows="8"
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    className="submit-assignment-form-textarea"
                    placeholder="Enter your submission text here..."
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="submit-assignment-form-label">Upload File (Optional)</label>
                  <div className="submit-assignment-upload-area">
                    <input
                      type="file"
                      id="assignmentFile"
                      onChange={handleFileUpload}
                      className="submit-assignment-upload-input"
                      disabled={submitting}
                    />
                    <label htmlFor="assignmentFile" className="submit-assignment-upload-label">
                      <Upload className="submit-assignment-upload-icon" />
                      {uploadedFile ? (
                        <>
                          <p className="submit-assignment-upload-text">{uploadedFile.name}</p>
                          <p className="submit-assignment-upload-help">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
                        </>
                      ) : (
                        <>
                          <p className="submit-assignment-upload-text">Click to upload</p>
                          <p className="submit-assignment-upload-help">PDF, DOC, ZIP (max 25MB)</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="submit-assignment-submit-button"
                >
                  <Send className="w-5 h-5" /> {submitting ? 'Submitting...' : 'Submit Assignment'}
                </button>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <div className="submit-assignment-page">
        <div className="submit-assignment-container">
          <p>Loading assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />
      <div className="submit-assignment-page">
        <div className="submit-assignment-container">
          <button
            onClick={() => navigate('/learner/dashboard')}
            className="submit-assignment-back-button"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Dashboard
          </button>

          <h1 className="submit-assignment-title">Course Assignments</h1>
          <p className="submit-assignment-subtitle">Course: {course.title}</p>

          {assignments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>No assignments available for this course yet</p>
            </div>
          ) : (
            <div className="submit-assignment-list">
              {assignments.map((assignment) => {
                const submission = submissions[assignment._id];
                const isSubmitted = !!submission;
                
                return (
                  <div key={assignment._id} className="submit-assignment-list-item">
                    <div className="submit-assignment-list-item-header">
                      <div className="submit-assignment-list-item-content">
                        <h3 className="submit-assignment-list-item-title">{assignment.title}</h3>
                        <p className="submit-assignment-list-item-description">{assignment.description}</p>
                        <div className="submit-assignment-list-item-meta">
                          <div className="submit-assignment-list-item-meta-item">
                            <Calendar className="w-4 h-4" />
                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          </div>
                          <div className="submit-assignment-list-item-meta-item">
                            <Award className="w-4 h-4" />
                            {assignment.totalMarks} points
                          </div>
                          {isSubmitted && submission.grade !== null && (
                            <div className="submit-assignment-list-item-meta-item" style={{ color: '#059669', fontWeight: '600' }}>
                              <CheckCircle className="w-4 h-4" />
                              Grade: {submission.grade}/{assignment.totalMarks}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="submit-assignment-list-item-actions">
                        {isSubmitted ? (
                          <span className="submit-assignment-status-badge submit-assignment-status-submitted">
                            <CheckCircle className="w-4 h-4" /> Submitted
                          </span>
                        ) : (
                          <span className="submit-assignment-status-badge submit-assignment-status-pending">
                            Pending
                          </span>
                        )}
                        <button
                          onClick={() => setSelectedAssignment(assignment)}
                          className={`submit-assignment-list-item-button ${isSubmitted ? 'view' : ''}`}
                        >
                          {isSubmitted ? 'View' : 'Submit'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SubmitAssignment;
