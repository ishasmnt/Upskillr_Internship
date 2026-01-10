import React from 'react';
import '../styles/Button.css';

const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseStyles = 'button';
  const variants = {
    primary: 'button-primary',
    secondary: 'button-secondary',
    ghost: 'button-ghost'
  };
  const sizes = {
    sm: 'button-sm',
    md: 'button-md',
    lg: 'button-lg'
  };
  
  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;