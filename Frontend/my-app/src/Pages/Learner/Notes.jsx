import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileText, Download, Eye, Search, ArrowLeft, BookOpen } from 'lucide-react';
import Button from '../../components/Button';
import { noteAPI } from '../../services/api';
import '../../styles/Notes.css';

const Notes = ({ enrolledCourses }) => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  
  const enrollment = enrolledCourses.find(e => e.course?._id === courseId);
  const course = enrollment?.course;
  
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

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

  if (!enrollment || !course) {
    return (
      <div className="notes-page">
        <div className="notes-container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'rgb(17, 24, 39)', marginBottom: '1rem' }}>
            Course not found
          </h1>
          <Button onClick={() => navigate('/learner/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const categories = ['All', 'Lecture Notes', 'Study Guide', 'Cheat Sheet', 'Reference Material', 'Practice Questions'];

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (note.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // FIXED: Direct download from Cloudinary
  const handleDownload = async (note) => {
    try {
      // Direct download from Cloudinary URL
      const link = document.createElement('a');
      link.href = note.filePath; // Direct Cloudinary URL
      link.download = note.fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Update download count in background (optional)
      try {
        await fetch(`http://localhost:5000/api/notes/${note._id}/increment-download`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      } catch (e) {
        console.log('Download count update failed, but file downloaded successfully');
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file. Opening in new tab instead...');
      window.open(note.filePath, '_blank');
    }
  };

  // FIXED: Direct preview from Cloudinary
  const handlePreview = async (note) => {
    try {
      // Direct preview from Cloudinary URL
      window.open(note.filePath, '_blank');

      // Update download count in background (optional)
      try {
        await fetch(`http://localhost:5000/api/notes/${note._id}/increment-download`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      } catch (e) {
        console.log('Preview count update failed, but file opened successfully');
      }
    } catch (error) {
      console.error('Preview error:', error);
      alert('Failed to preview file.');
    }
  };

  if (loading) {
    return (
      <div className="notes-page">
        <div className="notes-container" style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notes-page">
      <div className="notes-container">
        <button 
          onClick={() => navigate('/learner/dashboard')}
          className="notes-back-button"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </button>

        <div className="notes-header">
          <h1 className="notes-title">Course Notes</h1>
          <p className="notes-subtitle">Course: {course.title}</p>
        </div>

        {/* Stats */}
        <div className="notes-stats-grid">
          <div className="notes-stat-card">
            <FileText className="notes-stat-icon notes-stat-icon-indigo" />
            <div className="notes-stat-value">{notes.length}</div>
            <div className="notes-stat-label">Total Notes</div>
          </div>
          <div className="notes-stat-card">
            <Download className="notes-stat-icon notes-stat-icon-green" />
            <div className="notes-stat-value">
              {notes.reduce((sum, note) => sum + (note.downloads || 0), 0)}
            </div>
            <div className="notes-stat-label">Total Downloads</div>
          </div>
          <div className="notes-stat-card">
            <BookOpen className="notes-stat-icon notes-stat-icon-blue" />
            <div className="notes-stat-value">
              {[...new Set(notes.map(n => n.category))].length}
            </div>
            <div className="notes-stat-label">Categories</div>
          </div>
          <div className="notes-stat-card">
            <FileText className="notes-stat-icon notes-stat-icon-purple" />
            <div className="notes-stat-value">
              {(notes.reduce((sum, note) => {
                const size = parseFloat(note.fileSize);
                return sum + (isNaN(size) ? 0 : size);
              }, 0) / 1024).toFixed(1)} MB
            </div>
            <div className="notes-stat-label">Total Size</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="notes-filters">
          <div className="notes-filters-grid">
            <div className="notes-search-wrapper">
              <Search className="notes-search-icon" />
              <input 
                type="text" 
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="notes-search-input"
              />
            </div>
            <div className="notes-categories">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`notes-category-button ${
                    selectedCategory === cat 
                      ? 'notes-category-button-active' 
                      : 'notes-category-button-inactive'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        {filteredNotes.length === 0 ? (
          <div className="notes-empty-state">
            <FileText className="notes-empty-icon" />
            <h3 className="notes-empty-title">
              {notes.length === 0 ? 'No notes available yet' : 'No notes found'}
            </h3>
            <p className="notes-empty-description">
              {notes.length === 0 
                ? 'The instructor hasn\'t uploaded any notes yet' 
                : 'Try adjusting your search or filters'}
            </p>
          </div>
        ) : (
          <div className="notes-grid">
            {filteredNotes.map((note) => (
              <div key={note._id} className="notes-card">
                <div className="notes-card-header">
                  <div className="notes-card-icon-wrapper">
                    <FileText className="notes-card-icon" />
                  </div>
                  <span className="notes-card-category">
                    {note.category}
                  </span>
                </div>

                <h3 className="notes-card-title">
                  {note.title}
                </h3>
                <p className="notes-card-description">{note.description || 'No description'}</p>

                <div className="notes-card-meta">
                  <div className="notes-card-meta-row">
                    <span>File: {note.fileName}</span>
                  </div>
                  <div className="notes-card-meta-row">
                    <span>{note.fileSize}</span>
                    <span>{note.uploadDate ? new Date(note.uploadDate).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="notes-card-meta-row">
                    <div className="notes-card-meta-item">
                      <Download className="w-3 h-3" />
                      <span>{note.downloads || 0} downloads</span>
                    </div>
                  </div>
                </div>

                <div className="notes-card-actions">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="notes-card-action-button"
                    onClick={() => handlePreview(note)}
                  >
                    <Eye className="w-4 h-4" /> Preview
                  </Button>
                  <Button 
                    size="sm" 
                    className="notes-card-action-button"
                    onClick={() => handleDownload(note)}
                  >
                    <Download className="w-4 h-4" /> Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;