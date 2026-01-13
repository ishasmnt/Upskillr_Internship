import React, { useState, useEffect } from 'react';
import { Award, BookOpen, Clock, TrendingUp, Star, Calendar, Edit, Camera, Users, Target } from 'lucide-react';
import Button from './Button';
import { authAPI } from '../services/api';
import '../styles/MyProfile.css';

const MyProfile = ({ userRole, user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    location: '',
    website: '',
    joinDate: '',
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      // Try to get from API
      const userData = await authAPI.getCurrentUser();
      setCurrentUser(userData);
      setProfile({
        name: userData.name || 'User',
        bio: userData.bio || (userRole === 'learner' 
          ? 'Passionate learner exploring new skills and technologies.'
          : 'Experienced educator helping students achieve their goals.'),
        location: userData.location || 'Location',
        website: userData.website || 'www.example.com',
        joinDate: userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'Recently',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Fallback to localStorage user
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      setCurrentUser(storedUser);
      setProfile({
        name: storedUser.name || user?.name || 'User',
        bio: userRole === 'learner' 
          ? 'Passionate learner exploring the world of web development and design.'
          : 'Experienced educator and software engineer with years of teaching experience.',
        location: 'Your Location',
        website: 'www.yourwebsite.com',
        joinDate: 'Recently',
      });
    } finally {
      setLoading(false);
    }
  };

  // You can later add stats from backend
  const stats = userRole === 'learner' ? {
    coursesCompleted: 0, // Will be calculated from enrollments
    hoursLearned: 0,
    certificates: 0,
    currentStreak: 0,
  } : {
    coursesCreated: 0, // Will come from backend
    totalStudents: 0,
    averageRating: 0,
    totalRevenue: '$0',
  };

  const recentActivity = []; // Will come from backend

  const certificates = []; // Will come from backend

  const skills = userRole === 'learner' 
    ? ['React.js', 'JavaScript', 'CSS3', 'HTML5', 'Node.js']
    : ['Web Development', 'Teaching', 'Curriculum Design', 'JavaScript', 'React.js'];

  const handleInputChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleSave = async () => {
    try {
      // TODO: Add API call to update profile
      // await userAPI.updateProfile(profile);
      setIsEditing(false);
      alert('Profile update feature coming soon!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="my-profile-page">
        <div className="my-profile-container" style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-profile-page">
      <div className="my-profile-container">
        {/* Profile Header */}
        <div className="my-profile-header-card">
          <div className="my-profile-header-row">
            <div className="my-profile-avatar-wrapper">
              <div className="my-profile-avatar">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <button className="my-profile-avatar-button">
                <Camera className="my-profile-avatar-button-icon" />
              </button>
            </div>

            <div className="my-profile-main">
              {isEditing ? (
                <div className="my-profile-edit-grid">
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="my-profile-name-input"
                  />
                  <textarea
                    value={profile.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className="my-profile-bio-input"
                    rows="3"
                  />
                  <div className="my-profile-edit-fields">
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Location"
                      className="my-profile-field-input"
                    />
                    <input
                      type="text"
                      value={profile.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="Website"
                      className="my-profile-field-input"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="my-profile-name">{profile.name}</h1>
                  <p className="my-profile-bio">{profile.bio}</p>
                  <div className="my-profile-meta">
                    <span>📍 {profile.location}</span>
                    <span>🌐 {profile.website}</span>
                    <span className="my-profile-meta-item">
                      <Calendar className="my-profile-meta-icon" />
                      Joined {profile.joinDate}
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className="my-profile-actions">
              {isEditing ? (
                <div className="my-profile-actions-row">
                  <Button onClick={handleSave} size="sm">Save</Button>
                  <Button onClick={() => setIsEditing(false)} variant="ghost" size="sm">Cancel</Button>
                </div>
              ) : (
                <Button onClick={() => setIsEditing(true)} variant="ghost" size="sm">
                  <Edit className="my-profile-edit-icon" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="my-profile-stats-grid">
            {userRole === 'learner' ? (
              <>
                <div className="my-profile-stat-card my-profile-stat-card-indigo">
                  <div className="my-profile-stat-icon-wrapper">
                    <Award className="my-profile-stat-icon" />
                  </div>
                  <div className="my-profile-stat-value">{stats.coursesCompleted}</div>
                  <div className="my-profile-stat-label">Courses Completed</div>
                </div>
                <div className="my-profile-stat-card my-profile-stat-card-green">
                  <div className="my-profile-stat-icon-wrapper">
                    <Star className="my-profile-stat-icon" />
                  </div>
                  <div className="my-profile-stat-value">{stats.certificates}</div>
                  <div className="my-profile-stat-label">Certificates</div>
                </div>
              </>
            ) : (
              <>
                <div className="my-profile-stat-card my-profile-stat-card-indigo">
                  <div className="my-profile-stat-icon-wrapper">
                    <BookOpen className="my-profile-stat-icon" />
                  </div>
                  <div className="my-profile-stat-value">{stats.coursesCreated}</div>
                  <div className="my-profile-stat-label">Courses Created</div>
                </div>
                <div className="my-profile-stat-card my-profile-stat-card-blue">
                  <div className="my-profile-stat-icon-wrapper">
                    <Users className="my-profile-stat-icon" />
                  </div>
                  <div className="my-profile-stat-value">{stats.totalStudents.toLocaleString()}</div>
                  <div className="my-profile-stat-label">Total Students</div>
                </div>
                <div className="my-profile-stat-card my-profile-stat-card-green">
                  <div className="my-profile-stat-icon-wrapper">
                    <Star className="my-profile-stat-icon" />
                  </div>
                  <div className="my-profile-stat-value">{stats.averageRating || 'N/A'}</div>
                  <div className="my-profile-stat-label">Average Rating</div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="my-profile-content-grid">
          {/* Recent Activity */}
          <div className="my-profile-activity-column">
            <div className="my-profile-card">
              <h2 className="my-profile-section-title">Recent Activity</h2>
              {recentActivity.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                  <p>No recent activity yet</p>
                  <p style={{ fontSize: '0.875rem', marginTop: '8px' }}>
                    {userRole === 'learner' ? 'Start learning to see your activity' : 'Create courses to track your activity'}
                  </p>
                </div>
              ) : (
                <div className="my-profile-activity-list">
                  {recentActivity.map((activity, i) => (
                    <div
                      key={i}
                      className={`my-profile-activity-item my-profile-activity-item-${activity.type}`}
                    >
                      <div className="my-profile-activity-icon-wrapper">
                        {(activity.type === 'completed' || activity.type === 'published') ? <Award className="my-profile-activity-icon" /> :
                         (activity.type === 'started' || activity.type === 'updated') ? <BookOpen className="my-profile-activity-icon" /> :
                         activity.type === 'milestone' ? <Target className="my-profile-activity-icon" /> :
                         <Star className="my-profile-activity-icon" />}
                      </div>
                      <div className="my-profile-activity-content">
                        <p className="my-profile-activity-title">
                          {activity.type === 'completed' ? 'Completed' :
                           activity.type === 'started' ? 'Started' :
                           activity.type === 'published' ? 'Published' :
                           activity.type === 'updated' ? 'Updated' :
                           activity.type === 'milestone' ? '' :
                           'Earned certificate for'} {activity.course}
                        </p>
                        <p className="my-profile-activity-meta">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Certificates / Achievements */}
          <div className="my-profile-side-column">
            <div className="my-profile-card">
              <h2 className="my-profile-section-title">
                {userRole === 'learner' ? 'Certificates' : 'Achievements'}
              </h2>
              {certificates.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                  <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p style={{ fontSize: '0.875rem' }}>
                    {userRole === 'learner' ? 'Complete courses to earn certificates' : 'Achievements will appear here'}
                  </p>
                </div>
              ) : (
                <div className="my-profile-cert-list">
                  {certificates.map((cert, i) => (
                    <div key={i} className="my-profile-cert-item">
                      <div className="my-profile-cert-header">
                        <div className="my-profile-cert-icon-wrapper">
                          <Award className="my-profile-cert-icon" />
                        </div>
                        <div className="my-profile-cert-text">
                          <h3 className="my-profile-cert-title">{cert.title}</h3>
                          <p className="my-profile-cert-meta">Issued {cert.issueDate}</p>
                          <p className="my-profile-cert-id">ID: {cert.id}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="my-profile-card my-profile-skills-card">
          <h2 className="my-profile-section-title">
            {userRole === 'learner' ? 'Skills & Expertise' : 'Teaching Specialties'}
          </h2>
          <div className="my-profile-skills-list">
            {skills.map((skill, i) => (
              <span key={i} className="my-profile-skill-pill">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;