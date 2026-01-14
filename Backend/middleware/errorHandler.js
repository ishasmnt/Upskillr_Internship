const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Extract status and message
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Custom error response
  res.status(status).json({
    success: false,
    message,
    // Include stack trace only in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    timestamp: new Date().toISOString()
  });
};

module.exports = errorHandler;