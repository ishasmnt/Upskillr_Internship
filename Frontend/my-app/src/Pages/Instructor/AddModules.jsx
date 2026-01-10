import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Video, FileText, Trash2, Upload, Save, ArrowLeft } from 'lucide-react';
import Button from '../../components/Button';
import '../../styles/AddModules.css';

const AddModules = ({ instructorCourses }) => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  
  const course = instructorCourses.find(c => c.id === parseInt(courseId));
  
  const [modules, setModules] = useState(course?.modules || []);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [newModule, setNewModule] = useState({
    title: '',
    description: '',
    videoUrl: '',
    duration: '',
    resources: []
  });

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

  const addModule = () => {
    if (newModule.title && newModule.description) {
      setModules([...modules, { ...newModule, id: Date.now() }]);
      setNewModule({ title: '', description: '', videoUrl: '', duration: '', resources: [] });
      setShowModuleModal(false);
    }
  };

  const deleteModule = (moduleId) => {
    setModules(modules.filter(m => m.id !== moduleId));
  };

  const handleSave = () => {
    alert('Modules saved successfully!');
    navigate(`/instructor/course/${courseId}/manage`);
  };

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
              <Button onClick={handleSave}>
                <Save className="w-5 h-5" /> Save All Modules
              </Button>
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
              <p className="add-modules-empty-description">Start building your course by adding video lessons</p>
              <Button onClick={() => setShowModuleModal(true)}>
                <Plus className="w-5 h-5" /> Add Your First Module
              </Button>
            </div>
          ) : (
            <div className="add-modules-list">
              {modules.map((module, index) => (
                <div key={module.id} className="add-modules-item">
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
                      
                      {module.videoUrl && (
                        <div className="add-modules-item-video">
                          <Video className="w-4 h-4" />
                          <span>Video URL: {module.videoUrl}</span>
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
                      onClick={() => deleteModule(module.id)}
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
              <span>Keep modules focused on one specific topic or concept</span>
            </li>
            <li className="add-modules-tips-item">
              <span className="add-modules-tips-bullet">•</span>
              <span>Ideal video length is 5-15 minutes for better engagement</span>
            </li>
            <li className="add-modules-tips-item">
              <span className="add-modules-tips-bullet">•</span>
              <span>Provide downloadable resources to supplement video content</span>
            </li>
            <li className="add-modules-tips-item">
              <span className="add-modules-tips-bullet">•</span>
              <span>Use clear and descriptive titles that indicate what students will learn</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Add Module Modal */}
      {showModuleModal && (
        <div className="add-modules-modal-overlay" onClick={() => setShowModuleModal(false)}>
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
                ></textarea>
              </div>

              <div>
                <label className="add-modules-modal-label">Video URL</label>
                <input 
                  type="url" 
                  placeholder="https://youtube.com/watch?v=..."
                  value={newModule.videoUrl}
                  onChange={(e) => setNewModule({...newModule, videoUrl: e.target.value})}
                  className="add-modules-modal-input"
                />
                <p className="add-modules-modal-help-text">YouTube, Vimeo, or direct video link</p>
              </div>

              <div>
                <label className="add-modules-modal-label">Duration</label>
                <input 
                  type="text" 
                  placeholder="e.g., 12 minutes"
                  value={newModule.duration}
                  onChange={(e) => setNewModule({...newModule, duration: e.target.value})}
                  className="add-modules-modal-input"
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
                  />
                  <Button 
                    variant="ghost"
                    onClick={() => {
                      const input = document.getElementById('resourceInput');
                      if (input.value) {
                        setNewModule({
                          ...newModule, 
                          resources: [...(newModule.resources || []), input.value]
                        });
                        input.value = '';
                      }
                    }}
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
                          onClick={() => setNewModule({
                            ...newModule,
                            resources: newModule.resources.filter((_, idx) => idx !== i)
                          })}
                          className="add-modules-modal-resource-remove"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="add-modules-modal-actions">
                <Button className="add-modules-modal-button-flex" onClick={addModule}>
                  <Plus className="w-5 h-5" /> Add Module
                </Button>
                <Button variant="ghost" onClick={() => setShowModuleModal(false)}>
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