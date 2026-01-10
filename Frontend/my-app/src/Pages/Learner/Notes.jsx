import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileText, Download, Eye, Search, ArrowLeft, BookOpen } from 'lucide-react';
import Button from '../../components/Button';
import '../../styles/Notes.css';

const Notes = ({ enrolledCourses }) => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  
  const course = enrolledCourses.find(c => c.id === parseInt(courseId));
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [notes] = useState([
    {
      id: 1,
      title: 'Week 1 - Introduction to React',
      description: 'Overview of React, JSX, and component basics',
      category: 'Lecture Notes',
      fileName: 'week1-intro.pdf',
      fileSize: '2.4 MB',
      uploadDate: '2024-01-15',
      downloads: 234
    },
    {
      id: 2,
      title: 'React Hooks Cheat Sheet',
      description: 'Quick reference for useState, useEffect, and other hooks',
      category: 'Cheat Sheet',
      fileName: 'hooks-cheatsheet.pdf',
      fileSize: '856 KB',
      uploadDate: '2024-01-18',
      downloads: 456
    },
    {
      id: 3,
      title: 'Component Lifecycle Diagram',
      description: 'Visual guide to React component lifecycle methods',
      category: 'Reference Material',
      fileName: 'lifecycle-diagram.pdf',
      fileSize: '1.2 MB',
      uploadDate: '2024-01-20',
      downloads: 189
    },
    {
      id: 4,
      title: 'State Management Study Guide',
      description: 'Comprehensive guide covering Context API, Redux, and more',
      category: 'Study Guide',
      fileName: 'state-management.pdf',
      fileSize: '3.1 MB',
      uploadDate: '2024-01-25',
      downloads: 312
    },
    {
      id: 5,
      title: 'Practice Problems - Week 2',
      description: 'Coding exercises for hooks and state management',
      category: 'Practice Questions',
      fileName: 'week2-practice.pdf',
      fileSize: '1.8 MB',
      uploadDate: '2024-01-28',
      downloads: 278
    },
    {
      id: 6,
      title: 'Advanced Patterns Reference',
      description: 'Higher-order components, render props, and custom hooks',
      category: 'Reference Material',
      fileName: 'advanced-patterns.pdf',
      fileSize: '2.7 MB',
      uploadDate: '2024-02-01',
      downloads: 167
    }
  ]);

  if (!course) {
    return (
      <div className="notes-page">
        <div className="notes-container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'rgb(17, 24, 39)', marginBottom: '1rem' }}>Course not found</h1>
          <Button onClick={() => navigate('/learner/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const categories = ['All', 'Lecture Notes', 'Study Guide', 'Cheat Sheet', 'Reference Material', 'Practice Questions'];

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (note) => {
    alert(`Downloading: ${note.fileName}`);
  };

  const handlePreview = (note) => {
    alert(`Opening preview for: ${note.title}`);
  };

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
              {notes.reduce((sum, note) => sum + note.downloads, 0)}
            </div>
            <div className="notes-stat-label">Total Downloads</div>
          </div>
          <div className="notes-stat-card">
            <BookOpen className="notes-stat-icon notes-stat-icon-blue" />
            <div className="notes-stat-value">
              {categories.length - 1}
            </div>
            <div className="notes-stat-label">Categories</div>
          </div>
          <div className="notes-stat-card">
            <FileText className="notes-stat-icon notes-stat-icon-purple" />
            <div className="notes-stat-value">
              {(notes.reduce((sum, note) => sum + parseFloat(note.fileSize), 0)).toFixed(1)} MB
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
            <h3 className="notes-empty-title">No notes found</h3>
            <p className="notes-empty-description">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="notes-grid">
            {filteredNotes.map((note) => (
              <div key={note.id} className="notes-card">
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
                <p className="notes-card-description">{note.description}</p>

                <div className="notes-card-meta">
                  <div className="notes-card-meta-row">
                    <span>File: {note.fileName}</span>
                  </div>
                  <div className="notes-card-meta-row">
                    <span>{note.fileSize}</span>
                    <span>{note.uploadDate}</span>
                  </div>
                  <div className="notes-card-meta-row">
                    <div className="notes-card-meta-item">
                      <Download className="w-3 h-3" />
                      <span>{note.downloads} downloads</span>
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