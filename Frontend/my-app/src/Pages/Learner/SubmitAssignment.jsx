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
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Course not found</h1>
        <button onClick={() => navigate('/learner/dashboard')} style={{ marginTop: '20px', padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
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
      <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
        <button
          onClick={() => setSelectedAssignment(null)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '20px', color: '#2563eb' }}
        >
          <ArrowLeft className="w-5 h-5" /> Back to Assignments
        </button>

        <div style={{ background: 'white', borderRadius: '16px', padding: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{selectedAssignment.title}</h1>
              {submission ? (
                <span style={{ padding: '6px 16px', borderRadius: '20px', background: '#dcfce7', color: '#166534', fontSize: '0.875rem', fontWeight: '600' }}>
                  Submitted
                </span>
              ) : (
                <span style={{ padding: '6px 16px', borderRadius: '20px', background: '#fef3c7', color: '#92400e', fontSize: '0.875rem', fontWeight: '600' }}>
                  Pending
                </span>
              )}
            </div>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>{selectedAssignment.description}</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '20px' }}>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '4px' }}>Due Date</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                  <Calendar className="w-4 h-4" />
                  {new Date(selectedAssignment.dueDate).toLocaleDateString()}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '4px' }}>Total Marks</div>
                <div style={{ fontWeight: '600' }}>{selectedAssignment.totalMarks} points</div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '4px' }}>Type</div>
                <div style={{ fontWeight: '600' }}>{selectedAssignment.type}</div>
              </div>
            </div>
          </div>

          {selectedAssignment.instructions && (
            <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '12px', marginBottom: '30px' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '12px' }}>Instructions</h3>
              <p style={{ color: '#4b5563', lineHeight: '1.6' }}>{selectedAssignment.instructions}</p>
            </div>
          )}

          {submission ? (
            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#166534' }}>Your Submission</h3>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '8px' }}>Submitted on: {new Date(submission.submittedAt).toLocaleString()}</p>
                <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #d1fae5' }}>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{submission.text}</p>
                  {submission.file && (
                    <div style={{ marginTop: '12px', padding: '12px', background: '#f9fafb', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText className="w-4 h-4" />
                      <span>{submission.file.originalName}</span>
                    </div>
                  )}
                </div>
              </div>
              {submission.grade !== null && (
                <div style={{ marginTop: '16px', padding: '16px', background: 'white', borderRadius: '8px', border: '1px solid #d1fae5' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Award className="w-5 h-5 text-green-600" />
                    <span style={{ fontWeight: '600', fontSize: '1.125rem' }}>Grade: {submission.grade}/{selectedAssignment.totalMarks}</span>
                  </div>
                  {submission.feedback && (
                    <div>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '4px' }}>Feedback:</p>
                      <p style={{ color: '#374151' }}>{submission.feedback}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Your Submission</label>
                <textarea
                  rows="8"
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '1rem' }}
                  placeholder="Enter your submission text here..."
                  disabled={submitting}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Upload File (Optional)</label>
                <div style={{ border: '2px dashed #d1d5db', borderRadius: '12px', padding: '40px', textAlign: 'center', cursor: 'pointer', background: '#f9fafb' }}>
                  <input
                    type="file"
                    id="assignmentFile"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    disabled={submitting}
                  />
                  <label htmlFor="assignmentFile" style={{ cursor: 'pointer' }}>
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    {uploadedFile ? (
                      <>
                        <p style={{ fontWeight: '600', marginBottom: '4px' }}>{uploadedFile.name}</p>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{(uploadedFile.size / 1024).toFixed(2)} KB</p>
                      </>
                    ) : (
                      <>
                        <p style={{ fontWeight: '600', marginBottom: '4px' }}>Click to upload</p>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>PDF, DOC, ZIP (max 25MB)</p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: submitting ? '#9ca3af' : '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Send className="w-5 h-5" /> {submitting ? 'Submitting...' : 'Submit Assignment'}
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Loading assignments...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <button
        onClick={() => navigate('/learner/dashboard')}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '20px', color: '#2563eb' }}
      >
        <ArrowLeft className="w-5 h-5" /> Back to Dashboard
      </button>

      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '8px' }}>Course Assignments</h1>
      <p style={{ color: '#6b7280', marginBottom: '30px' }}>Course: {course.title}</p>

      {assignments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>No assignments available for this course yet</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {assignments.map((assignment) => {
            const submission = submissions[assignment._id];
            const isSubmitted = !!submission;
            
            return (
              <div
                key={assignment._id}
                style={{
                  background: 'white',
                  padding: '24px',
                  borderRadius: '16px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  border: isSubmitted ? '2px solid #86efac' : '1px solid #e5e7eb'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '8px' }}>{assignment.title}</h3>
                    <p style={{ color: '#6b7280', marginBottom: '12px' }}>{assignment.description}</p>
                    <div style={{ display: 'flex', gap: '20px', fontSize: '0.875rem', color: '#6b7280' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar className="w-4 h-4" />
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Award className="w-4 h-4" />
                        {assignment.totalMarks} points
                      </div>
                      {isSubmitted && submission.grade !== null && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontWeight: '600' }}>
                          <CheckCircle className="w-4 h-4" />
                          Grade: {submission.grade}/{assignment.totalMarks}
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {isSubmitted ? (
                      <span style={{ padding: '6px 16px', borderRadius: '20px', background: '#dcfce7', color: '#166534', fontSize: '0.875rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle className="w-4 h-4" /> Submitted
                      </span>
                    ) : (
                      <span style={{ padding: '6px 16px', borderRadius: '20px', background: '#fef3c7', color: '#92400e', fontSize: '0.875rem', fontWeight: '600' }}>
                        Pending
                      </span>
                    )}
                    <button
                      onClick={() => setSelectedAssignment(assignment)}
                      style={{
                        padding: '10px 20px',
                        background: isSubmitted ? '#f3f4f6' : '#2563eb',
                        color: isSubmitted ? '#374151' : 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
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
  );
};

export default SubmitAssignment;