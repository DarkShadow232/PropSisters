const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('express-flash');
const methodOverride = require('method-override');
const cors = require('cors');
const path = require('path');
const cron = require('node-cron');
require('dotenv').config();

// Initialize database connection
const connectDB = require('./config/database');

// Initialize services
const LoggerService = require('./services/loggerService');

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// Initialize services
const loggerService = new LoggerService();

// Initialize booking automation
const BookingAutomation = require('./services/bookingAutomation');
const bookingAutomation = new BookingAutomation();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// CORS Configuration (Enable if React app is on different port)
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:8081',
    'https://propsiss.com',
    'https://www.propsiss.com',
    process.env.FRONTEND_URL
  ].filter(Boolean), // Support multiple ports
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Request logging middleware
const requestLogger = require('./middleware/requestLogger');
app.use(requestLogger);


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
// Explicit mounts for static assets - must be before auth middleware
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
// Serve uploaded property images from admin's public folder
app.use('/image', express.static(path.join(__dirname, 'public', 'image')));
// Prevent noisy favicon 404s
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Session configuration
const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/rental-admin',
  touchAfter: 0, // Save session immediately on every touch
  ttl: 7 * 24 * 60 * 60 // 7 days in seconds
});

// Add session store event listeners for debugging
sessionStore.on('create', (sessionId) => {
  console.log('🔴 Session created in store:', sessionId);
});

sessionStore.on('update', (sessionId) => {
  console.log('🔴 Session updated in store:', sessionId);
});

sessionStore.on('destroy', (sessionId) => {
  console.log('🔴 Session destroyed in store:', sessionId);
});

sessionStore.on('error', (error) => {
  console.log('🔴 Session store error:', error);
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true, // Force session save on every request
  saveUninitialized: false,
  // Temporarily disable store to test if MongoDB is the issue
  // store: sessionStore,
  name: 'admin.sid', // Custom session name
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    httpOnly: true,
    secure: false, // Temporarily disable secure for testing
    sameSite: 'lax', // Add sameSite for better compatibility
    domain: undefined, // Let browser determine domain
    path: '/' // Ensure cookie is available for all paths
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
const logRoutes = require('./routes/logRoutes');
const paymobRoutes = require('./routes/paymobRoutes');
const finishRequestRoutes = require('./routes/finishRequestRoutes');

// Public API routes (accessible from frontend)
app.use('/api', apiRoutes);
app.use('/api/paymob', paymobRoutes);
app.use('/api/finish-requests', finishRequestRoutes);

// Debug middleware to log all POST requests
app.use((req, res, next) => {
  if (req.method === 'POST') {
    console.log('📮 POST request received:', {
      url: req.originalUrl,
      path: req.path,
      body: req.body,
      params: req.params,
      headers: req.headers['content-type']
    });
  }
  next();
});

// Admin routes
app.use('/auth', authRoutes);
app.use('/api/logs', logRoutes);

// Ensure static image paths are never caught by admin routes
// This is a safety net in case express.static doesn't match
app.use('/image/*', (req, res, next) => {
  // If we reach here, the file wasn't found by express.static
  // Return 404 instead of redirecting to login
  res.status(404).send('Image not found');
});

app.use('/', adminRoutes);

// Handle Paymob webhook redirects (before 404 handler)
app.use('/paymob/callback', (req, res) => {
  console.log('🔔 Paymob webhook redirected to /paymob/callback');
  console.log('🔔 Redirecting to correct URL: /api/paymob/callback');
  res.redirect('/api/paymob/callback');
});

// Paymob test page
app.get('/paymob-test', (req, res) => {
  res.render('paymob-test', {
    title: 'Paymob Payment Test'
  });
});

// Handle Paymob payment success/failure redirects
app.get('/payment/success', (req, res) => {
  console.log('✅ Payment success redirect received');
  const frontendUrl = process.env.FRONTEND_URL || 'https://propsiss.com';
  res.redirect(`${frontendUrl}/booking-success`);
});

app.get('/payment/failure', (req, res) => {
  console.log('❌ Payment failure redirect received');
  const frontendUrl = process.env.FRONTEND_URL || 'https://propsiss.com';
  res.redirect(`${frontendUrl}/booking-failure`);
});

// 404 handler
app.use((req, res) => {
  console.log('❌ 404 - Route not found:', req.originalUrl);
  console.log('❌ Method:', req.method);
  console.log('❌ Headers:', req.headers);
  
  // If it's an API route, return JSON error
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      error: 'API endpoint not found',
      path: req.originalUrl
    });
  }
  
  // For admin console routes, show 404 page instead of redirecting
  if (req.originalUrl.startsWith('/properties') || 
      req.originalUrl.startsWith('/bookings') || 
      req.originalUrl.startsWith('/users') || 
      req.originalUrl.startsWith('/contacts') ||
      req.originalUrl.startsWith('/finish-requests')) {
    return res.status(404).render('404', {
      title: 'Page Not Found',
      message: 'The requested page was not found in the admin console.'
    });
  }
  
  // For other web routes, redirect to frontend
  let frontendUrl = process.env.FRONTEND_URL || 'https://propsiss.com';
  
  // Fix incorrect localhost URL in production
  if (process.env.NODE_ENV === 'production' && frontendUrl.includes('localhost')) {
    frontendUrl = 'https://propsiss.com';
    console.log('🔧 Fixed incorrect FRONTEND_URL for production');
  }
  
  console.log('🔄 Redirecting to frontend:', frontendUrl);
  console.log('🔄 Current environment:', process.env.NODE_ENV);
  console.log('🔄 FRONTEND_URL env var:', process.env.FRONTEND_URL);
  res.redirect(frontendUrl);
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
  
  // Setup booking automation cron jobs
  setupBookingAutomation();
});

// Setup booking automation cron jobs
function setupBookingAutomation() {
  console.log('🤖 Setting up booking automation cron jobs...');
  
  // Run every hour for general booking tasks
  cron.schedule('0 * * * *', async () => {
    console.log('🔄 Running hourly booking automation...');
    try {
      await bookingAutomation.runAllTasks();
    } catch (error) {
      console.error('❌ Error in hourly booking automation:', error);
    }
  });

  // Run daily at 9 AM for daily tasks
  cron.schedule('0 9 * * *', async () => {
    console.log('🌅 Running daily booking automation...');
    try {
      await bookingAutomation.updateActiveBookings();
      await bookingAutomation.completeBookings();
      await bookingAutomation.sendReminders();
    } catch (error) {
      console.error('❌ Error in daily booking automation:', error);
    }
  });

  // Run weekly on Sunday at 2 AM for cleanup tasks
  cron.schedule('0 2 * * 0', async () => {
    console.log('🧹 Running weekly booking automation...');
    try {
      await bookingAutomation.runWeeklyTasks();
    } catch (error) {
      console.error('❌ Error in weekly booking automation:', error);
    }
  });

  // Run every 30 minutes for pending payment reminders
  cron.schedule('*/30 * * * *', async () => {
    console.log('💳 Checking pending payments...');
    try {
      await bookingAutomation.processPendingPayments();
    } catch (error) {
      console.error('❌ Error in pending payment automation:', error);
    }
  });

  console.log('✅ Booking automation cron jobs configured:');
  console.log('   - Hourly: General booking tasks');
  console.log('   - Daily (9 AM): Active/completed bookings, reminders');
  console.log('   - Weekly (Sunday 2 AM): Calendar cleanup');
  console.log('   - Every 30 minutes: Pending payment reminders');
}

module.exports = app;

