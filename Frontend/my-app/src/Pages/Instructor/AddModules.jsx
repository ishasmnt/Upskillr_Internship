import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Video, FileText, Trash2, Upload, ArrowLeft } from 'lucide-react';
import Button from '../../components/Button';
import { moduleAPI } from '../../services/api';
import '../../styles/AddModules.css';

const AddModules = ({ instructorCourses, onRefresh }) => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  
  const course = instructorCourses.find(c => c._id === courseId);
  
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [newModule, setNewModule] = useState({
    title: '',
    description: '',
    videoFile: null,
    duration: '',
    resources: []
  });

  useEffect(() => {
    if (course) {
      fetchModules();
    }
  }, [courseId]);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const data = await moduleAPI.getModules(courseId);
      setModules(data);
    } catch (error) {
      console.error('Error fetching modules:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!course) {
    return (
      <div className="add-modules-page">
        <div className="add-modules-container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'rgb(17, 24, 39)', marginBottom: '1rem' }}>Course not found</h1>
          <Button onClick={() => navigate('/instructor/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      const validTypes = ['video/mp4', 'video/avi', 'video/mkv', 'video/mov', 'video/wmv', 'video/webm'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid video file (MP4, AVI, MKV, MOV, WMV, WEBM)');
        return;
      }
      
      // Check file size (max 500MB)
      if (file.size > 500 * 1024 * 1024) {
        alert('Video file size must be less than 500MB');
        return;
      }

      setNewModule({
        ...newModule,
        videoFile: file
      });
    }
  };

  const addModule = async () => {
    if (!newModule.title || !newModule.description || !newModule.videoFile) {
      alert('Please fill in required fields and upload a video');
      return;
    }

    setSaving(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('title', newModule.title);
      formData.append('description', newModule.description);
      formData.append('duration', newModule.duration);
      formData.append('video', newModule.videoFile);
      formData.append('resources', JSON.stringify(newModule.resources));

      await moduleAPI.createModuleWithVideo(courseId, formData, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      });

      await fetchModules();
      setNewModule({ title: '', description: '', videoFile: null, duration: '', resources: [] });
      setShowModuleModal(false);
      setUploadProgress(0);
      alert('Module added successfully!');
    } catch (error) {
      console.error('Error creating module:', error);
      alert(error.response?.data?.message || 'Failed to create module');
    } finally {
      setSaving(false);
    }
  };

  const deleteModule = async (moduleId) => {
    if (!window.confirm('Are you sure you want to delete this module?')) return;

    try {
      await moduleAPI.deleteModule(moduleId);
      await fetchModules();
      alert('Module deleted successfully!');
    } catch (error) {
      console.error('Error deleting module:', error);
      alert('Failed to delete module');
    }
  };

  const addResource = () => {
    const input = document.getElementById('resourceInput');
    if (input.value.trim()) {
      setNewModule({
        ...newModule,
        resources: [...(newModule.resources || []), input.value.trim()]
      });
      input.value = '';
    }
  };

  const removeResource = (index) => {
    setNewModule({
      ...newModule,
      resources: newModule.resources.filter((_, i) => i !== index)
    });
  };

  if (loading) {
    return (
      <div className="add-modules-page">
        <div className="add-modules-container" style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading modules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="add-modules-page">
      <div className="add-modules-container">
        <button 
          onClick={() => navigate(`/instructor/course/${courseId}/manage`)}
          className="add-modules-back-button"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Course Management
        </button>

        <div className="add-modules-card">
          <div className="add-modules-header">
            <div className="add-modules-header-content">
              <h1 className="add-modules-title">Add Course Modules</h1>
              <p className="add-modules-subtitle">Course: {course.title}</p>
            </div>
            <div className="add-modules-actions">
              <Button onClick={() => setShowModuleModal(true)}>
                <Plus className="w-5 h-5" /> Add New Module
              </Button>
            </div>
          </div>

          {/* Module List */}
          {modules.length === 0 ? (
            <div className="add-modules-empty-state">
              <Video className="add-modules-empty-icon" />
              <h3 className="add-modules-empty-title">No modules added yet</h3>
              <p className="add-modules-empty-description">Start building your course by uploading video lessons</p>
              <Button onClick={() => setShowModuleModal(true)}>
                <Plus className="w-5 h-5" /> Add Your First Module
              </Button>
            </div>
          ) : (
            <div className="add-modules-list">
              {modules.map((module, index) => (
                <div key={module._id} className="add-modules-item">
                  <div className="add-modules-item-header">
                    <div className="add-modules-item-content">
                      <div className="add-modules-item-title-row">
                        <div className="add-modules-item-number">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="add-modules-item-title">{module.title}</h3>
                          <p className="add-modules-item-duration">{module.duration}</p>
                        </div>
                      </div>
                      <p className="add-modules-item-description">{module.description}</p>
                      
                      {module.videoFileName && (
                        <div className="add-modules-item-video">
                          <Video className="w-4 h-4" />
                          <span>Video: {module.videoFileName}</span>
                          {module.videoSize && <span className="text-gray-500 ml-2">({module.videoSize})</span>}
                        </div>
                      )}

                      {module.resources && module.resources.length > 0 && (
                        <div className="add-modules-item-resources">
                          <p className="add-modules-item-resources-title">Resources:</p>
                          <div className="add-modules-item-resources-list">
                            {module.resources.map((resource, i) => (
                              <span key={i} className="add-modules-item-resource">
                                <FileText className="w-3 h-3 inline mr-1" />
                                {resource}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => deleteModule(module._id)}
                      className="add-modules-delete-button"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="add-modules-tips">
          <h3 className="add-modules-tips-title">💡 Module Creation Tips</h3>
          <ul className="add-modules-tips-list">
            <li className="add-modules-tips-item">
              <span className="add-modules-tips-bullet">•</span>
              <span>Upload video files in MP4, AVI, MKV, MOV, WMV, or WEBM format</span>
            </li>
            <li className="add-modules-tips-item">
              <span className="add-modules-tips-bullet">•</span>
              <span>Keep video files under 500MB for optimal performance</span>
            </li>
            <li className="add-modules-tips-item">
              <span className="add-modules-tips-bullet">•</span>
              <span>Ideal video length is 5-15 minutes for better engagement</span>
            </li>
            <li className="add-modules-tips-item">
              <span className="add-modules-tips-bullet">•</span>
              <span>Provide downloadable resources to supplement video content</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Add Module Modal */}
      {showModuleModal && (
        <div className="add-modules-modal-overlay" onClick={() => !saving && setShowModuleModal(false)}>
          <div className="add-modules-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="add-modules-modal-title">Add New Module</h2>
            <div className="add-modules-modal-form">
              <div>
                <label className="add-modules-modal-label">Module Title *</label>
                <input 
                  type="text" 
                  placeholder="e.g., Introduction to React Hooks"
                  value={newModule.title}
                  onChange={(e) => setNewModule({...newModule, title: e.target.value})}
                  className="add-modules-modal-input"
                  disabled={saving}
                />
              </div>
              
              <div>
                <label className="add-modules-modal-label">Description *</label>
                <textarea 
                  placeholder="Describe what students will learn in this module"
                  rows="3"
                  value={newModule.description}
                  onChange={(e) => setNewModule({...newModule, description: e.target.value})}
                  className="add-modules-modal-textarea"
                  disabled={saving}
                ></textarea>
              </div>

              <div>
                <label className="add-modules-modal-label">Upload Video File *</label>
                <div style={{ marginBottom: '8px' }}>
                  <input 
                    type="file" 
                    accept="video/*"
                    onChange={handleVideoSelect}
                    style={{ 
                      width: '100%', 
                      padding: '8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px'
                    }}
                    disabled={saving}
                  />
                </div>
                {newModule.videoFile && (
                  <p style={{ fontSize: '0.875rem', color: '#059669', marginTop: '4px' }}>
                    ✓ {newModule.videoFile.name} ({(newModule.videoFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </p>
                )}
                <p className="add-modules-modal-help-text">
                  Supported: MP4, AVI, MKV, MOV, WMV, WEBM (Max 500MB)
                </p>
              </div>

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Uploading...</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#2563eb' }}>{uploadProgress}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${uploadProgress}%`, 
                      height: '100%', 
                      background: '#2563eb',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                </div>
              )}

              <div>
                <label className="add-modules-modal-label">Duration</label>
                <input 
                  type="text" 
                  placeholder="e.g., 12 minutes"
                  value={newModule.duration}
                  onChange={(e) => setNewModule({...newModule, duration: e.target.value})}
                  className="add-modules-modal-input"
                  disabled={saving}
                />
              </div>

              <div>
                <label className="add-modules-modal-label">Resources (Optional)</label>
                <div className="add-modules-modal-resource-input-wrapper">
                  <input 
                    type="text" 
                    placeholder="Add resource name"
                    id="resourceInput"
                    className="add-modules-modal-resource-input"
                    disabled={saving}
                  />
                  <Button 
                    variant="ghost"
                    onClick={addResource}
                    disabled={saving}
                  >
                    <Plus className="w-4 h-4" /> Add
                  </Button>
                </div>
                {newModule.resources && newModule.resources.length > 0 && (
                  <div className="add-modules-modal-resources-list">
                    {newModule.resources.map((resource, i) => (
                      <span key={i} className="add-modules-modal-resource-tag">
                        {resource}
                        <button
                          onClick={() => removeResource(i)}
                          className="add-modules-modal-resource-remove"
                          disabled={saving}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="add-modules-modal-actions">
                <Button 
                  className="add-modules-modal-button-flex" 
                  onClick={addModule}
                  disabled={saving || !newModule.videoFile}
                >
                  <Upload className="w-5 h-5" /> {saving ? `Uploading... ${uploadProgress}%` : 'Upload Module'}
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowModuleModal(false)}
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

export default AddModules;