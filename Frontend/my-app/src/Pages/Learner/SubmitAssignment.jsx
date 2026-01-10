import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Upload,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Send
} from 'lucide-react';
import Button from '../../components/Button';
import '../../styles/SubmitAssignment.css';

const SubmitAssignment = ({ enrolledCourses }) => {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const course = enrolledCourses.find(c => c.id === parseInt(courseId));

  const [assignments] = useState([
    {
      id: 1,
      title: 'Build a React Todo App',
      description:
        'Create a fully functional todo application using React hooks and local storage',
      dueDate: '2024-02-15',
      totalMarks: 100,
      type: 'Project',
      status: 'pending',
      instructions:
        'Your todo app should include: Add tasks, Mark as complete, Delete tasks, Persist data in localStorage'
    },
    {
      id: 2,
      title: 'Component Lifecycle Quiz',
      description:
        'Answer questions about React component lifecycle methods',
      dueDate: '2024-02-10',
      totalMarks: 50,
      type: 'Quiz',
      status: 'submitted',
      submittedDate: '2024-02-08',
      grade: 45
    },
    {
      id: 3,
      title: 'State Management Essay',
      description:
        'Write a detailed essay comparing different state management solutions in React',
      dueDate: '2024-02-20',
      totalMarks: 75,
      type: 'Written',
      status: 'graded',
      submittedDate: '2024-02-18',
      grade: 68,
      feedback:
        'Good analysis of Redux and Context API. Could use more detail on MobX.'
    }
  ]);

  const [selectedAssignment, setSelectedAssignment] = useState(null);

  // ✅ FIXED SYNTAX ERROR (nothing removed)
  const [submissionText, setSubmissionText] = useState('');

  const [uploadedFile, setUploadedFile] = useState(null);

  if (!course) {
    return (
      <div className="submit-assignment-page">
        <div className="submit-assignment-container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'rgb(17, 24, 39)', marginBottom: '1rem' }}>
            Course not found
          </h1>
          <Button onClick={() => navigate('/learner/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile({
        name: file.name,
        size: (file.size / 1024).toFixed(2) + ' KB'
      });
    }
  };

  const handleSubmit = () => {
    alert('Assignment submitted successfully!');
    setSelectedAssignment(null);
    setSubmissionText('');
    setUploadedFile(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'submit-assignment-status-pending';
      case 'submitted':
        return 'submit-assignment-status-submitted';
      case 'graded':
        return 'submit-assignment-status-graded';
      default:
        return 'submit-assignment-status-pending';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'submitted':
        return <CheckCircle className="w-4 h-4" />;
      case 'graded':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const isOverdue = (dueDate, status) => {
    if (status !== 'pending') return false;
    return new Date(dueDate) < new Date();
  };

  /* =======================
      ASSIGNMENT DETAIL VIEW
     ======================= */
  if (selectedAssignment) {
    return (
      <div className="submit-assignment-page">
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
                <div>
                  <h1 className="submit-assignment-detail-title">
                    {selectedAssignment.title}
                  </h1>
                  <p className="submit-assignment-detail-description">
                    {selectedAssignment.description}
                  </p>
                </div>
                <span
                  className={`submit-assignment-status-badge ${getStatusColor(
                    selectedAssignment.status
                  )}`}
                >
                  {selectedAssignment.status}
                </span>
              </div>

              <div className="submit-assignment-detail-meta-grid">
                <div className="submit-assignment-detail-meta-item">
                  <div className="submit-assignment-detail-meta-label">Due Date</div>
                  <div className="submit-assignment-detail-meta-value">
                    <Calendar className="w-4 h-4" />
                    {selectedAssignment.dueDate}
                  </div>
                </div>
                <div className="submit-assignment-detail-meta-item">
                  <div className="submit-assignment-detail-meta-label">Total Marks</div>
                  <div className="submit-assignment-detail-meta-value">
                    {selectedAssignment.totalMarks} points
                  </div>
                </div>
                <div className="submit-assignment-detail-meta-item">
                  <div className="submit-assignment-detail-meta-label">Type</div>
                  <div className="submit-assignment-detail-meta-value">
                    {selectedAssignment.type}
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="submit-assignment-instructions">
              <h3 className="submit-assignment-instructions-title">
                Instructions
              </h3>
              <p className="submit-assignment-instructions-text">
                {selectedAssignment.instructions}
              </p>
            </div>

            {selectedAssignment.status === 'pending' ? (
              <>
                {/* Submission Form */}
                <div className="submit-assignment-form">
                  <div>
                    <label className="submit-assignment-form-label">
                      Your Submission
                    </label>
                    <textarea
                      rows="8"
                      value={submissionText}
                      onChange={(e) => setSubmissionText(e.target.value)}
                      className="submit-assignment-form-textarea"
                    />
                  </div>

                  <div>
                    <label className="submit-assignment-form-label">
                      Upload File (Optional)
                    </label>
                    <div className="submit-assignment-upload-area">
                      <input
                        type="file"
                        id="assignmentFile"
                        onChange={handleFileUpload}
                        className="submit-assignment-upload-input"
                      />
                      <label htmlFor="assignmentFile" className="submit-assignment-upload-label">
                        <Upload className="submit-assignment-upload-icon" />
                        {uploadedFile ? (
                          <>
                            <p className="submit-assignment-upload-text">{uploadedFile.name}</p>
                            <p className="submit-assignment-upload-help">
                              {uploadedFile.size}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="submit-assignment-upload-text">Click to upload</p>
                            <p className="submit-assignment-upload-help">
                              PDF, DOC, ZIP (max 25MB)
                            </p>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                <Button className="submit-assignment-submit-button" size="lg" onClick={handleSubmit}>
                  <Send className="w-5 h-5" /> Submit Assignment
                </Button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  /* =======================
      ASSIGNMENT LIST VIEW
     ======================= */
  return (
    <div className="submit-assignment-page">
      <div className="submit-assignment-container">
        <button
          onClick={() => navigate('/learner/dashboard')}
          className="submit-assignment-back-button"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </button>

        <h1 className="submit-assignment-title">
          Course Assignments
        </h1>
        <p className="submit-assignment-subtitle">
          Course: {course.title}
        </p>

        <div className="submit-assignment-list">
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="submit-assignment-item"
            >
              <div className="submit-assignment-item-header">
                <h3 className="submit-assignment-item-title">{assignment.title}</h3>
                <Button onClick={() => setSelectedAssignment(assignment)}>
                  {assignment.status === 'pending' ? 'Submit' : 'View'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubmitAssignment;
