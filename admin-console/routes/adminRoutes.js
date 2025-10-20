const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { isAuthenticated } = require('../middleware/authMiddleware');

// Configure multer for local disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/rentals/');
  },
  filename: function (req, file, cb) {
    // Generate unique filename: timestamp + random string + extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'property-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Controllers
const dashboardController = require('../controllers/dashboardController');
const propertyController = require('../controllers/propertyController');
const userController = require('../controllers/userController');
const bookingController = require('../controllers/bookingController');

// All routes require authentication
router.use(isAuthenticated);

// Dashboard
router.get('/', dashboardController.getDashboard);

// Properties
router.get('/properties', propertyController.listProperties);
router.get('/properties/create', propertyController.getCreateProperty);
router.post('/properties/create', upload.array('images', 10), propertyController.postCreateProperty);
router.get('/properties/:id/edit', propertyController.getEditProperty);
router.post('/properties/:id/edit', upload.array('images', 10), propertyController.postEditProperty);
router.post('/properties/:id/delete', propertyController.deleteProperty);

// Users
router.get('/users', userController.listUsers);
router.get('/users/:id', userController.viewUser);
router.post('/users/:id/delete', userController.deleteUser);

// Bookings
router.get('/bookings', bookingController.listBookings);
router.get('/bookings/:id', bookingController.viewBooking);
router.post('/bookings/:id/status', bookingController.updateBookingStatus);

module.exports = router;

