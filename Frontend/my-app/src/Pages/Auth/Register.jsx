import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../../components/Button';
import { authAPI } from '../../services/api';
import '../../styles/Register.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('learner');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      // Call the API
      const data = await authAPI.register({
        name,
        email,
        password,
        role,
      });

      // Show success message
      alert('Registration successful! Please login.');
      
      // Redirect to login
      navigate('/login');
    } catch (err) {
      setError(
        err.response?.data?.message || 
        err.response?.data?.errors?.[0]?.msg ||
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="register-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="register-container"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <motion.div 
          className="register-header"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.div 
            className="register-brand"
            whileHover={{ scale: 1.05 }}
          >
            <div className="register-brand-icon">
              <BookOpen className="w-7 h-7 text-orange-950" />
            </div>
            <span className="register-brand-text">
              UpSkillr
            </span>
          </motion.div>
          <motion.h1 
            className="register-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Create Account
          </motion.h1>
          <motion.p 
            className="register-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Join thousands of learners worldwide
          </motion.p>
        </motion.div>

        <motion.div 
          className="register-form-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: '#fee2e2',
                border: '1px solid #ef4444',
                borderRadius: '12px',
                padding: '12px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#991b1b'
              }}
            >
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </motion.div>
          )}

          <motion.form 
            onSubmit={handleSubmit} 
            className="register-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <motion.div 
              className="register-form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              <label className="register-label">I want to</label>
              <div className="register-role-buttons">
                <motion.button
                  type="button"
                  onClick={() => setRole('learner')}
                  className={`register-role-button ${
                    role === 'learner' 
                      ? 'register-role-button-active' 
                      : 'register-role-button-inactive'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => setRole('instructor')}
                  className={`register-role-button ${
                    role === 'instructor' 
                      ? 'register-role-button-active' 
                      : 'register-role-button-inactive'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Teach
                </motion.button>
              </div>
            </motion.div>

            <motion.div 
              className="register-form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.4 }}
            >
              <label className="register-label">Full Name</label>
              <motion.div 
                className="register-input-wrapper"
                whileFocus={{ scale: 1.02 }}
              >
                <User className="register-input-icon" />
                <input 
                  type="text" 
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="register-input"
                  disabled={loading}
                />
              </motion.div>
            </motion.div>

            <motion.div 
              className="register-form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0, duration: 0.4 }}
            >
              <label className="register-label">Email</label>
              <motion.div 
                className="register-input-wrapper"
                whileFocus={{ scale: 1.02 }}
              >
                <Mail className="register-input-icon" />
                <input 
                  type="email" 
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="register-input"
                  disabled={loading}
                />
              </motion.div>
            </motion.div>

            <motion.div 
              className="register-form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1, duration: 0.4 }}
            >
              <label className="register-label">Password</label>
              <motion.div 
                className="register-input-wrapper"
                whileFocus={{ scale: 1.02 }}
              >
                <Lock className="register-input-icon" />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="register-input"
                  disabled={loading}
                />
              </motion.div>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>
                Must be at least 6 characters
              </p>
            </motion.div>

            <motion.div 
              className="register-form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.4 }}
            >
              <label className="register-label">Confirm Password</label>
              <motion.div 
                className="register-input-wrapper"
                whileFocus={{ scale: 1.02 }}
              >
                <Lock className="register-input-icon" />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="register-input"
                  disabled={loading}
                />
              </motion.div>
              {confirmPassword && password === confirmPassword && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#059669', fontSize: '0.75rem', marginTop: '4px' }}>
                  <CheckCircle className="w-4 h-4" />
                  <span>Passwords match</span>
                </div>
              )}
            </motion.div>

            <motion.label 
              className="register-checkbox-label"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.4 }}
            >
              <input type="checkbox" required className="register-checkbox" />
              <span className="register-checkbox-text">
                I agree to the <a href="#" className="register-link">Terms of Service</a> and <a href="#" className="register-link">Privacy Policy</a>
              </span>
            </motion.label>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                type="submit" 
                className="register-full-width" 
                size="lg"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </motion.div>
          </motion.form>

          <motion.div 
            className="register-signin-link"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.4 }}
          >
            <p className="register-signin-text">
              Already have an account?{' '}
              <Link to="/login" className="register-signin-link">
                Sign in
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Register;