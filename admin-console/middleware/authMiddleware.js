// Middleware to check if admin is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.adminId) {
    // Attach admin info to request
    req.admin = {
      id: req.session.adminId,
      email: req.session.adminEmail,
      name: req.session.adminName
    };
    return next();
  }
  
  // Store the original URL to redirect back after login
  req.session.returnTo = req.originalUrl;
  req.flash('error', 'Please log in to access this page');
  res.redirect('/auth/login');
};

// Middleware to redirect authenticated users away from login
const isNotAuthenticated = (req, res, next) => {
  if (req.session && req.session.adminId) {
    return res.redirect('/');
  }
  next();
};

module.exports = {
  isAuthenticated,
  isNotAuthenticated
};

