import React, { useState } from 'react';
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
import '../../styles/UploadNotes.css';

const UploadNotes = ({ instructorCourses }) => {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const course = instructorCourses.find(c => c.id === parseInt(courseId));

  const [notes, setNotes] = useState(course?.notes || []);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    description: '',
    fileName: '',
    fileSize: '',
    category: 'Lecture Notes'
  });

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

  const addNote = () => {
    if (newNote.title && newNote.fileName) {
      setNotes([
        ...notes,
        {
          ...newNote,
          id: Date.now(),
          uploadDate: new Date().toLocaleDateString(),
          downloads: 0
        }
      ]);
      setNewNote({
        title: '',
        description: '',
        fileName: '',
        fileSize: '',
        category: 'Lecture Notes'
      });
      setShowUploadModal(false);
    }
  };

  const deleteNote = (noteId) => {
    setNotes(notes.filter(n => n.id !== noteId));
  };

  const handleSave = () => {
    alert('Notes saved successfully!');
    navigate(`/instructor/course/${courseId}/manage`);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewNote({
        ...newNote,
        fileName: file.name,
        fileSize: (file.size / 1024).toFixed(2) + ' KB'
      });
    }
  };

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
              <Button onClick={handleSave}>
                <Save className="w-5 h-5" /> Save All Notes
              </Button>
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
                  key={note.id}
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
                      onClick={() => deleteNote(note.id)}
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
                      <span>{note.uploadDate}</span>
                    </div>
                    <div className="upload-notes-item-meta-row">
                      <div className="upload-notes-item-meta-item">
                        <Download className="w-3 h-3" />
                        <span>{note.downloads} downloads</span>
                      </div>
                    </div>
                  </div>

                  <div className="upload-notes-item-actions">
                    <Button size="sm" variant="ghost" className="upload-notes-card-action-button">
                      <Eye className="w-3 h-3" /> Preview
                    </Button>
                    <Button size="sm" variant="ghost" className="upload-notes-card-action-button">
                      <Download className="w-3 h-3" /> Download
                    </Button>
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
          onClick={() => setShowUploadModal(false)}
        >
          <div
            className="upload-notes-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="upload-notes-modal-title">
              Upload New Note
            </h2>

            <div className="upload-notes-modal-form">
              <input
                type="text"
                placeholder="Note title"
                value={newNote.title}
                onChange={(e) =>
                  setNewNote({ ...newNote, title: e.target.value })
                }
                className="upload-notes-modal-input"
              />

              <textarea
                placeholder="Description"
                rows="3"
                value={newNote.description}
                onChange={(e) =>
                  setNewNote({ ...newNote, description: e.target.value })
                }
                className="upload-notes-modal-textarea"
              />

              <input
                type="file"
                onChange={handleFileSelect}
                style={{ width: '100%' }}
              />

              <div className="upload-notes-modal-actions">
                <Button className="upload-notes-modal-button-flex" onClick={addNote}>
                  Upload Note
                </Button>
                <Button variant="ghost" onClick={() => setShowUploadModal(false)}>
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
