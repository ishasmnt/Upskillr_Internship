import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Upload,
  FileText,
  Trash2,
  Save,
  ArrowLeft,
  Download,
  Eye
} from 'lucide-react';
import Button from '../../components/Button';
import { noteAPI } from '../../services/api';
import '../../styles/UploadNotes.css';

const UploadNotes = ({ instructorCourses, onRefresh }) => {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const course = instructorCourses.find(c => c._id === courseId);

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    description: '',
    fileName: '',
    fileSize: '',
    category: 'Lecture Notes',
    file: null
  });

  useEffect(() => {
    if (course) {
      fetchNotes();
    }
  }, [courseId]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const data = await noteAPI.getNotes(courseId);
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!course) {
    return (
      <div className="upload-notes-page">
        <div className="upload-notes-container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'rgb(17, 24, 39)', marginBottom: '1rem' }}>
            Course not found
          </h1>
          <Button onClick={() => navigate('/instructor/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const addNote = async () => {
    if (!newNote.title || !newNote.file) {
      alert('Please provide title and select a file');
      return;
    }

    setSaving(true);
    try {
      await noteAPI.createNote(courseId, newNote);
      await fetchNotes();
      setNewNote({
        title: '',
        description: '',
        fileName: '',
        fileSize: '',
        category: 'Lecture Notes',
        file: null
      });
      setShowUploadModal(false);
      alert('Note uploaded successfully!');
    } catch (error) {
      console.error('Error uploading note:', error);
      alert('Failed to upload note');
    } finally {
      setSaving(false);
    }
  };

  const deleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      await noteAPI.deleteNote(noteId);
      await fetchNotes();
      alert('Note deleted successfully!');
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note');
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewNote({
        ...newNote,
        file: file,
        fileName: file.name,
        fileSize: (file.size / 1024).toFixed(2) + ' KB'
      });
    }
  };

  if (loading) {
    return (
      <div className="upload-notes-page">
        <div className="upload-notes-container" style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="upload-notes-page">
      <div className="upload-notes-container">
        <button
          onClick={() => navigate(`/instructor/course/${courseId}/manage`)}
          className="upload-notes-back-button"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Course Management
        </button>

        <div className="upload-notes-card">
          <div className="upload-notes-header">
            <div className="upload-notes-header-content">
              <h1 className="upload-notes-title">
                Upload Course Notes
              </h1>
              <p className="upload-notes-subtitle">Course: {course.title}</p>
            </div>
            <div className="upload-notes-actions">
              <Button onClick={() => setShowUploadModal(true)}>
                <Upload className="w-5 h-5" /> Upload New Note
              </Button>
            </div>
          </div>

          {/* Notes List */}
          {notes.length === 0 ? (
            <div className="upload-notes-empty-state">
              <FileText className="upload-notes-empty-icon" />
              <h3 className="upload-notes-empty-title">
                No notes uploaded yet
              </h3>
              <p className="upload-notes-empty-description">
                Share study materials and resources with your students
              </p>
              <Button onClick={() => setShowUploadModal(true)}>
                <Upload className="w-5 h-5" /> Upload First Note
              </Button>
            </div>
          ) : (
            <div className="upload-notes-grid">
              {notes.map(note => (
                <div
                  key={note._id}
                  className="upload-notes-item"
                >
                  <div className="upload-notes-item-header">
                    <div className="upload-notes-item-icon-wrapper">
                      <div className="upload-notes-item-icon">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="upload-notes-item-title">
                          {note.title}
                        </h3>
                        <span className="upload-notes-item-category">
                          {note.category}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteNote(note._id)}
                      className="upload-notes-delete-button"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="upload-notes-item-description">
                    {note.description}
                  </p>

                  <div className="upload-notes-item-meta">
                    <div className="upload-notes-item-meta-row">
                      <div className="upload-notes-item-meta-item">
                        <FileText className="w-3 h-3" />
                        <span>{note.fileName}</span>
                      </div>
                    </div>
                    <div className="upload-notes-item-meta-row">
                      <span>{note.fileSize}</span>
                      <span>{note.uploadDate ? new Date(note.uploadDate).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div className="upload-notes-item-meta-row">
                      <div className="upload-notes-item-meta-item">
                        <Download className="w-3 h-3" />
                        <span>{note.downloads || 0} downloads</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="upload-notes-tips">
          <h3 className="upload-notes-tips-title">
            📚 Note Upload Guidelines
          </h3>
          <ul className="upload-notes-tips-list">
            <li>• Upload PDF files for best compatibility</li>
            <li>• Keep file sizes under 10MB</li>
            <li>• Use clear, descriptive titles</li>
            <li>• Organize notes by module or topic</li>
          </ul>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div
          className="upload-notes-modal-overlay"
          onClick={() => !saving && setShowUploadModal(false)}
        >
          <div
            className="upload-notes-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="upload-notes-modal-title">
              Upload New Note
            </h2>

            <div className="upload-notes-modal-form">
              <div>
                <label className="upload-notes-modal-label">Note Title *</label>
                <input
                  type="text"
                  placeholder="Note title"
                  value={newNote.title}
                  onChange={(e) =>
                    setNewNote({ ...newNote, title: e.target.value })
                  }
                  className="upload-notes-modal-input"
                  disabled={saving}
                />
              </div>

              <div>
                <label className="upload-notes-modal-label">Category</label>
                <select
                  value={newNote.category}
                  onChange={(e) =>
                    setNewNote({ ...newNote, category: e.target.value })
                  }
                  className="upload-notes-modal-input"
                  disabled={saving}
                >
                  <option>Lecture Notes</option>
                  <option>Study Guide</option>
                  <option>Cheat Sheet</option>
                  <option>Reference Material</option>
                  <option>Practice Questions</option>
                </select>
              </div>

              <div>
                <label className="upload-notes-modal-label">Description</label>
                <textarea
                  placeholder="Description"
                  rows="3"
                  value={newNote.description}
                  onChange={(e) =>
                    setNewNote({ ...newNote, description: e.target.value })
                  }
                  className="upload-notes-modal-textarea"
                  disabled={saving}
                />
              </div>

              <div>
                <label className="upload-notes-modal-label">Select File *</label>
                <input
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  style={{ width: '100%', padding: '8px' }}
                  disabled={saving}
                />
                {newNote.fileName && (
                  <p style={{ marginTop: '8px', fontSize: '0.875rem', color: '#059669' }}>
                    Selected: {newNote.fileName} ({newNote.fileSize})
                  </p>
                )}
              </div>

              <div className="upload-notes-modal-actions">
                <Button 
                  className="upload-notes-modal-button-flex" 
                  onClick={addNote}
                  disabled={saving}
                >
                  <Upload className="w-5 h-5" /> {saving ? 'Uploading...' : 'Upload Note'}
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowUploadModal(false)}
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
  );
};

export default UploadNotes;