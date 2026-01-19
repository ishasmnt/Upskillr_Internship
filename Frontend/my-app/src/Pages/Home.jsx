import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, Users, BookOpen, Award, TrendingUp, Play, Quote, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import CourseCard from '../components/CourseCard';
import ShinyText from '../components/ui/ShinyText';
import { courseAPI } from '../services/api';
import '../styles/Home.css';

const HomePage = ({ allCourses: propCourses }) => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState(propCourses || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If no courses passed as props, fetch from API
    if (!propCourses || propCourses.length === 0) {
      fetchCourses();
    } else {
      setCourses(propCourses);
    }
  }, [propCourses]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await courseAPI.getAllCourses();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Static Success Stories Data
  const successStories = [
    {
      name: "Rohan Deshmukh",
      role: "Frontend Developer",
      company: "TCS",
      text: "UpSkillr mule maze React concepts clear zale. Highly recommended!",
      // image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan"
   image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&fit=crop"
    },
    {
      name: "Snehal Patil",
      role: "Software Engineer",
      company: "Accenture",
      text: "The practical assignments helped me crack my technical interview with ease.",
      // image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Snehal"
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&fit=crop"
    },
    {
      name: "Arjun Mehta",
      role: "Full Stack Dev",
      company: "Infosys",
      text: "Instructor-led sessions are top-notch. I transitioned from civil to IT!",
      // image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun"
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&fit=crop"
    }
  ];

  // Calculate stats from real data
  const stats = {
    activeLearners: '50K+',
    expertCourses: courses.length > 0 ? `${courses.length}+` : '500+',
    topInstructors: '200+',
    successRate: '95%'
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <motion.section 
        className="hero-section"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-container">
          <motion.div 
            className="hero-badge-wrapper"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="hero-badge">
              🎓 Welcome to UpSkillr
            </span>
          </motion.div>
          
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <ShinyText
              text="LEARN & GROW"
              speed={2.5}
              color="#e8d46d"
              shineColor="#c77e00"
              className="hero-title-part1"
            />
            <br />
            <span className="hero-title-part2">
              Master New Skills
            </span>
          </motion.h1>
          
          <motion.p 
            className="hero-description "
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Discover expert-led courses designed to help you achieve your learning goals and advance your career
          </motion.p>
          
          <motion.div 
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Button size="lg" onClick={() => navigate('/courses')}>
              Browse Courses <ChevronRight className="w-5 h-5" />
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate('/register')}>
              Become an Instructor
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Trust Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stats-grid">
            {[
              { value: stats.activeLearners, label: 'Active Learners', icon: Users },
              { value: stats.expertCourses, label: 'Expert Courses', icon: BookOpen },
              { value: stats.topInstructors, label: 'Top Instructors', icon: Award },
              { value: stats.successRate, label: 'Success Rate', icon: TrendingUp }
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                className="stat-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="stat-icon">
                  <stat.icon className="w-7 h-7 text-orange-950" />
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="featured-section">
        <div className="featured-container">
          <div className="featured-header">
            <h2 className="featured-title">Featured Courses</h2>
            <p className="featured-subtitle">
              Handpicked courses to accelerate your learning journey
            </p>
          </div>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>Loading courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p style={{ color: '#6b7280' }}>No courses available yet</p>
            </div>
          ) : (
            <div className="featured-grid">
              {courses.slice(0, 4).map((course, i) => (
                <motion.div
                  key={course._id || i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <CourseCard 
                    course={course}
                    onEnroll={() => navigate('/courses')}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works-section">
        <div className="how-it-works-container">
          <div className="how-it-works-header">
            <h2 className="how-it-works-title">How It Works</h2>
            <p className="how-it-works-subtitle">Three simple steps to start your learning journey</p>
          </div>
          
          <div className="how-it-works-grid">
            {[
              { step: '01', title: 'Sign Up', description: 'Create your free account in seconds and explore our extensive course library', icon: Users },
              { step: '02', title: 'Enroll & Learn', description: 'Choose courses that match your goals and start learning at your own pace', icon: Play },
              { step: '03', title: 'Achieve & Grow', description: 'Complete courses, earn certificates, and showcase your new skills', icon: Award }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                className="how-it-works-card"
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="how-it-works-step-number">
                  {item.step}
                </div>
                <div className="how-it-works-card-content">
                  <div className="how-it-works-card-icon">
                    <item.icon className="w-7 h-7 text-orange-950" />
                  </div>
                  <h3 className="how-it-works-card-title">{item.title}</h3>
                  <p className="how-it-works-card-description">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <motion.section 
        className="cta-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="cta-container">
          <motion.h2 
            className="cta-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Ready to Start Learning?
          </motion.h2>
          <motion.p 
            className="cta-description"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Join thousands of learners transforming their careers with UpSkillr
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button size="lg" onClick={() => navigate('/courses')}>
              Explore All Courses <ChevronRight className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Success Stories Section */}
      <section className="success-stories-section" style={{ padding: '80px 0', background: '#272121' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div className="section-header text-center" style={{ marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#ffffffff' }}>Real Success Stories 🚀</h2>
            <p style={{ color: '#e6e6e6ff', marginTop: '10px' }}>Join 50k+ learners who have already transformed their careers</p>
          </div>

          <div className="stories-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {successStories.map((story, i) => (
              <motion.div
                key={i}
                className="story-card"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -10 }}
                transition={{ delay: i * 0.1 }}
                style={{ background: '#483535ff', padding: '30px', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', position: 'relative' }}
              >
                <Quote className="absolute top-4 right-4 text-indigo-100 w-12 h-12" />
                <div className="user-info" style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                  <img src={story.image} alt="" style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '15px', background: '#e2e8f0' }} />
                  <div>
                    <h4 style={{ fontWeight: 'bold', color: '#f8f9fbff' }}>{story.name}</h4>
                    <p style={{ fontSize: '0.8rem', color: '#6366f1', fontWeight: '600' }}>{story.role} @ {story.company}</p>
                  </div>
                </div>
                <p style={{ color: '#f6e9e9', fontStyle: 'italic', lineHeight: '1.6' }}>"{story.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;