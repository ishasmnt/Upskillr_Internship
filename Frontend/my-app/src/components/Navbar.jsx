import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Menu, X, User } from 'lucide-react';
import Button from './Button';
import '../styles/Navbar.css';

const Navbar = ({ isAuthenticated, userRole, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-inner">
          <div className="navbar-content">
            <Link to="/" className="navbar-logo-link">
              <div className="navbar-logo-icon">
                <BookOpen className="w-6 h-6 text-orange-950" />
              </div>
              <span className="navbar-logo-text">
                UpSkillr
              </span>
            </Link>
            
            <div className="navbar-menu">
              <Link 
                to="/"
                className={`navbar-link ${isActive('/') ? 'navbar-link-active' : 'navbar-link-inactive'}`}
              >
                Home
              </Link>
              <Link 
                to="/courses"
                className={`navbar-link ${isActive('/courses') ? 'navbar-link-active' : 'navbar-link-inactive'}`}
              >
                Browse Courses
              </Link>
              
              {isAuthenticated ? (
                <>
                  {userRole === 'learner' && (
                    <>
                      <Link 
                        to="/learner/dashboard"
                        className={`navbar-link ${isActive('/learner/dashboard') ? 'navbar-link-active' : 'navbar-link-inactive'}`}
                      >
                        My Learning
                      </Link>
                      <Link 
                        to="/learner/my-courses"
                        className={`navbar-link ${isActive('/learner/my-courses') ? 'navbar-link-active' : 'navbar-link-inactive'}`}
                      >
                        My Courses
                      </Link>
                      <Link 
                        to="/learner/profile"
                        className={`navbar-link ${isActive('/learner/profile') ? 'navbar-link-active' : 'navbar-link-inactive'}`}
                      >
                        <User className="w-4 h-4 inline-block mr-1" />
                        My Profile
                      </Link>
                    </>
                  )}
                  
                  {userRole === 'instructor' && (
                    <>
                      <Link 
                        to="/instructor/dashboard"
                        className={`navbar-link ${isActive('/instructor/dashboard') ? 'navbar-link-active' : 'navbar-link-inactive'}`}
                      >
                        Teach
                      </Link>
                      <Link 
                        to="/instructor/profile"
                        className={`navbar-link ${isActive('/instructor/profile') ? 'navbar-link-active' : 'navbar-link-inactive'}`}
                      >
                        <User className="w-4 h-4 inline-block mr-1" />
                        My Profile
                      </Link>
                    </>
                  )}
                  
                  <Button size="sm" onClick={handleLogout}>Logout</Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm">Login</Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>

            <button className="navbar-mobile-button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;