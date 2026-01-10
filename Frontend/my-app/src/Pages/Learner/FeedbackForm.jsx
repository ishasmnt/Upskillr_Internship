import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, CheckCircle, PartyPopper } from 'lucide-react';
import Button from '../../components/Button';

const FeedbackForm = ({ courseName }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [comment, setComment] = useState("");

  // const handleSubmit = (e) => {


    
  //   e.preventDefault();
  //   // Simulate API call
  //   if (rating === 0) {
  //     alert("Please select a rating before submitting!");
  //     return;
  //   }
  //   setSubmitted(true);
  // };
const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      alert("Please select a rating before submitting!");
      return;
    }

    try {
      // 1. Send the data to your Node.js server
      const response = await fetch('http://localhost:5000/api/feedback/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseName: courseName,
          rating: rating,
          comment: comment,
        }),
      });

      // 2. Check if the server responded successfully
      if (response.ok) {
        const data = await response.json();
        console.log("Server Response:", data);
        setSubmitted(true); // Only show success UI if the server got the data
      } else {
        alert("Failed to send feedback to server.");
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("Could not connect to the backend. Is your server running?");
    }
  };
  return (
    <div className="feedback-container" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div 
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{ width: '100%', maxWidth: '500px' }}
          >
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ background: '#ecfdf5', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fbfbfbff' }}>
                Course Completed! 🎉
              </h2>
              <p style={{ color: '#f6e9e9' }}>Kasa vatla tumhala <b>{courseName}</b>?</p>
            </div>

            <div style={{ background: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
              {/* Star Rating */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <Star 
                      className={`w-10 h-10 transition-colors ${star <= (hover || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} 
                    />
                  </motion.button>
                ))}
              </div>

              <textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience here... (e.g. Content khup chan hota!)"
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  marginBottom: '1.5rem',
                  minHeight: '120px',
                  outline: 'none',
                  fontSize: '0.95rem',
                  resize: 'none'
                }}
              />

              <Button size="lg" className="w-full" onClick={handleSubmit}>
                Submit Feedback <Send className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        ) : (
          /* Success Message after submission */
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', background: 'white', padding: '3rem', borderRadius: '24px', border: '1px solid #e2e8f0' }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <PartyPopper className="w-20 h-20 text-indigo-600 mx-auto mb-4" />
            </motion.div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1e293b' }}>Dhanyavad!</h2>
            <p style={{ color: '#64748b', marginTop: '1rem', marginBottom: '2rem' }}>
              Your feedback is extremely valuable to us and helps us improve.
            </p>
            <Button variant="secondary" onClick={() => window.location.href='/learner/dashboard'}>
              Go to Dashboard
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeedbackForm;