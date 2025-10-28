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

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET ,
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
const logRoutes = require('./routes/logRoutes');
const paymobRoutes = require('./routes/paymobRoutes');
const finishRequestRoutes = require('./routes/finishRequestRoutes');

// Public API routes (accessible from frontend)
app.use('/api', apiRoutes);
app.use('/api/paymob', paymobRoutes);
app.use('/api/finish-requests', finishRequestRoutes);

// Admin routes
app.use('/auth', authRoutes);
app.use('/api/logs', logRoutes);
app.use('/', adminRoutes);

// Handle Paymob webhook redirects (before 404 handler)
app.use('/paymob/callback', (req, res) => {
  console.log('🔔 Paymob webhook redirected to /paymob/callback');
  console.log('🔔 Redirecting to correct URL: /api/paymob/callback');
  res.redirect('/api/paymob/callback');
});

// 404 handler
app.use((req, res) => {
  console.log('❌ 404 - Route not found:', req.originalUrl);
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

