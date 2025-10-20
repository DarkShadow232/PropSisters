const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('express-flash');
const methodOverride = require('method-override');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Initialize database connection
const connectDB = require('./config/database');

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// CORS Configuration (Enable if React app is on different port)
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:8081',
    process.env.FRONTEND_URL
  ].filter(Boolean), // Support multiple ports
  credentials: true
}));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log('\n' + '='.repeat(80));
  console.log(`📥 [${timestamp}] ${req.method} ${req.url}`);
  console.log(`📍 IP: ${req.ip}`);
  console.log(`🔗 Origin: ${req.headers.origin || 'N/A'}`);
  
  if (Object.keys(req.query).length > 0) {
    console.log(`🔍 Query:`, req.query);
  }
  
  if (req.body && Object.keys(req.body).length > 0) {
    // Don't log passwords
    const sanitizedBody = { ...req.body };
    if (sanitizedBody.password) sanitizedBody.password = '***HIDDEN***';
    if (sanitizedBody.currentPassword) sanitizedBody.currentPassword = '***HIDDEN***';
    if (sanitizedBody.newPassword) sanitizedBody.newPassword = '***HIDDEN***';
    console.log(`📦 Body:`, sanitizedBody);
  }
  
  if (req.session && req.session.userId) {
    console.log(`👤 User: ${req.session.userName} (${req.session.userEmail})`);
  }
  
  // Log response
  const originalSend = res.send;
  res.send = function(data) {
    console.log(`📤 Response: ${res.statusCode} ${res.statusMessage || ''}`);
    console.log('='.repeat(80));
    return originalSend.apply(res, arguments);
  };
  
  next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/rental-admin',
    touchAfter: 24 * 3600 // lazy session update
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' // true in production
  }
}));

// Flash messages
app.use(flash());

// Make flash messages available to all views
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const apiRoutes = require('./routes/apiRoutes');

// Public API routes (accessible from frontend)
app.use('/api', apiRoutes);

// Admin routes
app.use('/auth', authRoutes);
app.use('/', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).render('auth/login', {
    title: '404 Not Found',
    error: ['Page not found'],
    success: []
  });
});

// Error handler
app.use((err, req, res, next) => {
  const timestamp = new Date().toISOString();
  
  console.log('\n' + '🔴'.repeat(40));
  console.error(`❌ [${timestamp}] ERROR CAUGHT`);
  console.error(`📍 Route: ${req.method} ${req.url}`);
  console.error(`🔴 Error Name: ${err.name}`);
  console.error(`🔴 Error Message: ${err.message}`);
  console.error(`🔴 Error Code: ${err.code || 'N/A'}`);
  console.error(`🔴 Stack Trace:`);
  console.error(err.stack);
  
  if (req.body && Object.keys(req.body).length > 0) {
    const sanitizedBody = { ...req.body };
    if (sanitizedBody.password) sanitizedBody.password = '***HIDDEN***';
    console.error(`📦 Request Body:`, sanitizedBody);
  }
  
  console.log('🔴'.repeat(40) + '\n');
  
  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    req.flash('error', 'File size too large. Maximum size is 10MB.');
    return res.redirect('back');
  }
  
  // Multer file type error
  if (err.message === 'Only image files are allowed!') {
    req.flash('error', err.message);
    return res.redirect('back');
  }
  
  // API error response
  if (req.path.startsWith('/api/')) {
    return res.status(err.status || 500).json({
      success: false,
      error: err.message || 'Internal server error',
      code: err.code,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }
  
  // Generic error
  req.flash('error', 'An error occurred: ' + err.message);
  res.redirect('back');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🏠  Admin Console is running!                      ║
║                                                       ║
║   📍 URL: http://localhost:${PORT}                    ║
║   🌍 Environment: ${process.env.NODE_ENV || 'development'}                    ║
║   💾 Database: MongoDB (All Data)                    ║
║   📊 Logging: ENABLED (All requests & errors)        ║
║                                                       ║
║   To get started:                                     ║
║   1. Create an admin account: npm run seed           ║
║   2. Open http://localhost:${PORT}/auth/login         ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
  
  console.log('✅ Request logging is ACTIVE');
  console.log('✅ Error logging is ACTIVE');
  console.log('ℹ️  All HTTP requests will be logged below...\n');
});

module.exports = app;

