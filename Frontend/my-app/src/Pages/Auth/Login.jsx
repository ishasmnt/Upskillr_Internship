import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, BookOpen, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../../components/Button';
import { authAPI } from '../../services/api';
import '../../styles/Login.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call the API
      const data = await authAPI.login({ email, password });
      
      // Store user data and token
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('token', data.token);
      
      // FIX: Pass both role and full user data to parent component
      onLogin(data.role, data);
      
      // Navigate based on role
      if (data.role === 'learner') {
        navigate('/learner/dashboard');
      } else if (data.role === 'instructor') {
        navigate('/instructor/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="login-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="login-container"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <motion.div 
          className="login-header"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.div 
            className="login-brand"
            whileHover={{ scale: 1.05 }}
          >
            <div className="login-brand-icon">
              <BookOpen className="w-7 h-7 text-orange-950" />
            </div>
            <span className="login-brand-text">
              UpSkillr
            </span>
          </motion.div>
          <motion.h1 
            className="login-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Welcome Back
          </motion.h1>
          <motion.p 
            className="login-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Sign in to continue your learning journey
          </motion.p>
        </motion.div>

        <motion.div 
          className="login-form-container"
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
            className="login-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <motion.div 
              className="login-form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.4 }}
            >
              <label className="login-label">Email</label>
              <motion.div 
                className="login-input-wrapper"
                whileFocus={{ scale: 1.02 }}
              >
                <Mail className="login-input-icon" />
                <input 
                  type="email" 
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="login-input"
                  disabled={loading}
                />
              </motion.div>
            </motion.div>

            <motion.div 
              className="login-form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0, duration: 0.4 }}
            >
              <label className="login-label">Password</label>
              <motion.div 
                className="login-input-wrapper"
                whileFocus={{ scale: 1.02 }}
              >
                <Lock className="login-input-icon" />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="login-input"
                  disabled={loading}
                />
              </motion.div>
            </motion.div>

            <motion.div 
              className="login-checkbox-wrapper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.4 }}
            >
              <label className="login-checkbox-label">
                <input type="checkbox" className="login-checkbox" />
                <span className="login-checkbox-text">Remember me</span>
              </label>
              <motion.a 
                href="#" 
                className="login-forgot-link"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Forgot Password?
              </motion.a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                type="submit" 
                className="login-full-width" 
                size="lg"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </motion.div>
          </motion.form>

          <motion.div 
            className="login-signup-link"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.4 }}
          >
            <p className="login-signup-text">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="login-signup-link"
              >
                Sign up
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Login;