import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="footer-brand-section">
            <Link to="/" className="footer-brand-link">
              <div className="footer-brand-icon">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="footer-brand-text">UpSkillr</span>
            </Link>
            <p className="footer-brand-description">
              Empowering learners worldwide with quality education and expert-led courses.
            </p>
            <div className="footer-social-links">
              <a href="#" className="footer-social-link">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="footer-social-link">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="footer-social-link">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="footer-social-link">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="footer-section-title">Quick Links</h3>
            <ul className="footer-links-list">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/courses" className="footer-link">All Courses</Link></li>
              <li><Link to="/about" className="footer-link">About Us</Link></li>
              <li><Link to="/contact" className="footer-link">Contact</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="footer-section-title">Categories</h3>
            <ul className="footer-links-list">
              <li><a href="#" className="footer-link">Development</a></li>
              <li><a href="#" className="footer-link">Design</a></li>
              <li><a href="#" className="footer-link">Data Science</a></li>
              <li><a href="#" className="footer-link">Business</a></li>
              <li><a href="#" className="footer-link">Marketing</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="footer-section-title">Support</h3>
            <ul className="footer-links-list">
              <li><a href="#" className="footer-link">Help Center</a></li>
              <li><a href="#" className="footer-link">Terms of Service</a></li>
              <li><a href="#" className="footer-link">Privacy Policy</a></li>
              <li><a href="#" className="footer-link">FAQs</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2024 UpSkillr. All rights reserved.
          </p>
          <div className="footer-email">
            <Mail className="w-4 h-4" />
            <a href="mailto:support@upskillr.com" className="footer-email-link">
              support@upskillr.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;