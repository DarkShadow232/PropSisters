const LoggerService = require('../services/loggerService');

const loggerService = new LoggerService();

/**
 * Request logging middleware
 * Logs all HTTP requests to database and files
 */
const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Override res.end to capture response time
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const responseTime = Date.now() - startTime;
    
    // Log the request asynchronously
    loggerService.logRequest(req, res, responseTime).catch(error => {
      console.error('Error logging request:', error);
    });
    
    // Call original end method
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
};

module.exports = requestLogger;
