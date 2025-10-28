// Middleware to check if admin is authenticated
const isAuthenticated = (req, res, next) => {
  console.log('🔴 isAuthenticated middleware - Session:', req.session);
  console.log('🔴 isAuthenticated middleware - adminId:', req.session?.adminId);
  
  if (req.session && req.session.adminId) {
    // Attach admin info to request
    req.admin = {
      id: req.session.adminId,
      email: req.session.adminEmail,
      name: req.session.adminName
    };
    console.log('🔴 isAuthenticated - Admin attached:', req.admin);
    return next();
  }
  
  console.log('🔴 isAuthenticated - No session, redirecting to login');
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

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.session && req.session.adminId) {
    // Attach admin info to request
    req.admin = {
      id: req.session.adminId,
      email: req.session.adminEmail,
      name: req.session.adminName
    };
    return next();
  }
  
  req.flash('error', 'Admin access required');
  res.redirect('/auth/login');
};

// Middleware to check if frontend user is authenticated
const isUserAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    // Attach user info to request
    req.user = {
      id: req.session.userId,
      email: req.session.userEmail,
      name: req.session.userName
    };
    return next();
  }
  
  // For API routes, return JSON error
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }
  
  // For web routes, redirect to login
  req.session.returnTo = req.originalUrl;
  res.redirect('/sign-in');
};

module.exports = {
  isAuthenticated,
  isNotAuthenticated,
  isAdmin,
  isUserAuthenticated
};

