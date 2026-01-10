import React, { useState } from 'react';
import { Award, BookOpen, Clock, TrendingUp, Star, Calendar, Edit, Camera, Users, DollarSign, Target } from 'lucide-react';
import Button from './Button';
import '../styles/MyProfile.css';

const MyProfile = ({ userRole }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: userRole === 'learner' ? 'Alex Johnson' : 'Dr. Sarah Mitchell',
    bio: userRole === 'learner' 
      ? 'Passionate learner exploring the world of web development and design. Always eager to learn new skills and take on challenging projects.'
      : 'Experienced educator and software engineer with 10+ years of teaching experience. Passionate about making complex topics accessible and engaging for students worldwide.',
    location: userRole === 'learner' ? 'San Francisco, CA' : 'New York, NY',
    website: userRole === 'learner' ? 'www.alexjohnson.dev' : 'www.sarahmitchell.edu',
    joinDate: userRole === 'learner' ? 'January 2024' : 'March 2023',
  });

  const stats = userRole === 'learner' ? {
    coursesCompleted: 12,
    hoursLearned: 156,
    certificates: 8,
    currentStreak: 15,
  } : {
    coursesCreated: 8,
    totalStudents: 24850,
    averageRating: 4.9,
    totalRevenue: '$87,450',
  };

  const recentActivity = userRole === 'learner' ? [
    { type: 'completed', course: 'Advanced React Patterns', date: '2 days ago' },
    { type: 'started', course: 'UI/UX Design Mastery', date: '1 week ago' },
    { type: 'certificate', course: 'JavaScript Fundamentals', date: '2 weeks ago' },
    { type: 'completed', course: 'CSS Grid & Flexbox', date: '3 weeks ago' },
  ] : [
    { type: 'published', course: 'Machine Learning Basics', date: '3 days ago' },
    { type: 'updated', course: 'Advanced React Patterns', date: '1 week ago' },
    { type: 'milestone', course: 'Reached 25K students!', date: '2 weeks ago' },
    { type: 'published', course: 'Python for Data Science', date: '1 month ago' },
  ];

  const certificates = userRole === 'learner' ? [
    { title: 'Advanced React Patterns', issueDate: 'Dec 2024', id: 'CERT-001' },
    { title: 'JavaScript Fundamentals', issueDate: 'Nov 2024', id: 'CERT-002' },
    { title: 'CSS Grid & Flexbox', issueDate: 'Oct 2024', id: 'CERT-003' },
  ] : [
    { title: 'Certified Online Educator', issueDate: 'Jan 2023', id: 'INST-001' },
    { title: 'Advanced Teaching Methods', issueDate: 'Mar 2023', id: 'INST-002' },
    { title: 'Curriculum Design Expert', issueDate: 'Jun 2023', id: 'INST-003' },
  ];

  const skills = userRole === 'learner' 
    ? ['React.js', 'JavaScript', 'CSS3', 'HTML5', 'Node.js', 'UI/UX Design', 'Python', 'Git', 'Responsive Design', 'REST APIs']
    : ['Web Development', 'Machine Learning', 'Python', 'JavaScript', 'Data Science', 'Curriculum Design', 'Video Production', 'React.js', 'Node.js', 'Cloud Computing'];

  const handleInputChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
  };

  return (
    <div className="my-profile-page">
      <div className="my-profile-container">
        {/* Profile Header */}
        <div className="my-profile-header-card">
          <div className="my-profile-header-row">
            <div className="my-profile-avatar-wrapper">
              <div className="my-profile-avatar">
                {profile.name.charAt(0)}
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
                  <div className="my-profile-stat-value">{stats.averageRating}</div>
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
            </div>
          </div>

          {/* Certificates / Achievements */}
          <div className="my-profile-side-column">
            <div className="my-profile-card">
              <h2 className="my-profile-section-title">
                {userRole === 'learner' ? 'Certificates' : 'Achievements'}
              </h2>
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

                <button className="my-profile-cert-view-all">
                  View All {userRole === 'learner' ? 'Certificates' : 'Achievements'} →
                </button>
              </div>
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

        {/* Additional Section for Instructors */}
        {userRole === 'instructor' && (
          <div className="my-profile-card my-profile-feedback-card">
            <h2 className="my-profile-section-title">Student Feedback</h2>
            <div className="my-profile-feedback-list">
              <div className="my-profile-feedback-item">
                <div className="my-profile-feedback-avatar-wrapper">
                  <div className="my-profile-feedback-avatar my-profile-feedback-avatar-blue">
                    JD
                  </div>
                </div>
                <div className="my-profile-feedback-content">
                  <div className="my-profile-feedback-header">
                    <p className="my-profile-feedback-name">John Doe</p>
                    <div className="my-profile-feedback-stars">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="my-profile-feedback-star" />
                      ))}
                    </div>
                  </div>
                  <p className="my-profile-feedback-text">
                    "Amazing instructor! The course content was well-structured and easy to follow. Highly recommended!"
                  </p>
                  <p className="my-profile-feedback-meta">2 days ago</p>
                </div>
              </div>
              
              <div className="my-profile-feedback-item">
                <div className="my-profile-feedback-avatar-wrapper">
                  <div className="my-profile-feedback-avatar my-profile-feedback-avatar-green">
                    ML
                  </div>
                </div>
                <div className="my-profile-feedback-content">
                  <div className="my-profile-feedback-header">
                    <p className="my-profile-feedback-name">Maria Lopez</p>
                    <div className="my-profile-feedback-stars">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="my-profile-feedback-star" />
                      ))}
                    </div>
                  </div>
                  <p className="my-profile-feedback-text">
                    "Clear explanations and practical examples. This course helped me land my dream job!"
                  </p>
                  <p className="my-profile-feedback-meta">1 week ago</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;