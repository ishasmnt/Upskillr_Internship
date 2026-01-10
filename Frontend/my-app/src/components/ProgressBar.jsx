import React from 'react';
import '../styles/ProgressBar.css';

const ProgressBar = ({ progress, label, showLabel = true }) => {
  return (
    <div className="progress-container">
      {showLabel && label && (
        <div className="progress-label-container">
          <span className="progress-label-text">{label}</span>
          <span className="progress-label-value">{progress}%</span>
        </div>
      )}
      <div className="progress-bar-wrapper">
        <div 
          className="progress-bar-fill"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;