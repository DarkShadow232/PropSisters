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
const finishRequestController = require('../controllers/finishRequestController');
const contactController = require('../controllers/contactController');

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

// Finish Requests
router.get('/finish-requests', async (req, res) => {
  try {
    const { status } = req.query;
    const FinishRequest = require('../models/FinishRequest');
    
    // Build query
    const query = status && status !== 'all' ? { status } : {};
    
    // Get finish requests
    const finishRequests = await FinishRequest.find(query)
      .populate('userId', 'displayName email')
      .sort({ createdAt: -1 })
      .lean();
    
    // Format requests for display
    const formattedRequests = finishRequests.map(request => ({
      id: request._id,
      userId: request.userId?._id,
      userName: request.userId?.displayName || request.userName || 'Unknown User',
      userEmail: request.userId?.email || request.userEmail || '',
      requestType: request.requestType,
      propertyType: request.propertyType,
      budget: request.budget,
      timeline: request.timeline,
      description: request.description,
      location: request.location,
      contactPhone: request.contactPhone,
      countryCode: request.countryCode || 'EG',
      status: request.status || 'pending',
      priority: request.priority || 'medium',
      createdAt: request.createdAt
    }));
    
    res.render('finish-requests/index', {
      title: 'Finish Requests',
      admin: req.admin,
      finishRequests: formattedRequests,
      currentFilter: status || 'all',
      search: req.query.search || '',
      status: req.query.status || 'all',
      priority: req.query.priority || 'all',
      sort: req.query.sort || 'createdAt',
      limit: req.query.limit || '10',
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Error loading finish requests:', error);
    req.flash('error', 'Error loading finish requests');
    res.render('finish-requests/index', {
      title: 'Finish Requests',
      admin: req.admin,
      finishRequests: [],
      currentFilter: 'all',
      search: req.query.search || '',
      status: req.query.status || 'all',
      priority: req.query.priority || 'all',
      sort: req.query.sort || 'createdAt',
      limit: req.query.limit || '10',
      success: req.flash('success'),
      error: req.flash('error')
    });
  }
});

router.get('/finish-requests/:id', async (req, res) => {
  try {
    const FinishRequest = require('../models/FinishRequest');
    const request = await FinishRequest.findById(req.params.id)
      .populate('userId', 'displayName email')
      .lean();
    
    if (!request) {
      req.flash('error', 'Finish request not found');
      return res.redirect('/finish-requests');
    }
    
    // Format request data for the view
    const formattedRequest = {
      id: request._id ? request._id.toString() : req.params.id,
      userId: request.userId?._id,
      userName: request.userId?.displayName || request.userName || 'Unknown User',
      userEmail: request.userId?.email || request.userEmail || '',
      requestType: request.requestType,
      propertyType: request.propertyType,
      budget: request.budget,
      timeline: request.timeline,
      description: request.description,
      location: request.location,
      contactPhone: request.contactPhone,
      countryCode: request.countryCode || 'EG',
      status: request.status || 'pending',
      priority: request.priority || 'medium',
      estimatedCost: request.estimatedCost,
      actualCost: request.actualCost,
      startDate: request.startDate,
      completionDate: request.completionDate,
      adminNotes: request.adminNotes,
      attachments: request.attachments || [],
      notes: request.notes || [],
      createdAt: request.createdAt,
      updatedAt: request.updatedAt
    };
    
    res.render('finish-requests/view', {
      title: 'Finish Request Details',
      request: formattedRequest,
      admin: req.admin,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Error fetching finish request:', error);
    req.flash('error', 'Error loading finish request');
    res.redirect('/finish-requests');
  }
});

// Update finish request
router.put('/finish-requests/:id', async (req, res) => {
  try {
    const FinishRequest = require('../models/FinishRequest');
    const { id } = req.params;
    const updates = req.body;

    const request = await FinishRequest.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Finish request not found'
      });
    }

    res.json({
      success: true,
      message: 'Finish request updated successfully',
      request
    });

  } catch (error) {
    console.error('Error updating finish request:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update finish request'
    });
  }
});

// Logs route
router.get('/logs', isAuthenticated, (req, res) => {
  res.render('logs/index', {
    title: 'Request Logs',
    user: req.user
  });
});

// Contact Messages
router.get('/contacts', async (req, res) => {
  try {
    const { status, page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc', priority } = req.query;
    const Contact = require('../models/Contact');
    
    // Build filter object
    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (priority && priority !== 'all') filter.priority = priority;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Build sort object
    const sort = {};
    if (sortBy === 'name') {
      sort.name = sortOrder === 'desc' ? -1 : 1;
    } else {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }
    
    const contacts = await Contact.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('repliedBy', 'name email')
      .exec();
    
    const total = await Contact.countDocuments(filter);
    
    // Get statistics
    const stats = await Contact.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const totalCount = await Contact.countDocuments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await Contact.countDocuments({ createdAt: { $gte: today } });
    
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    const weekCount = await Contact.countDocuments({ createdAt: { $gte: thisWeek } });
    
    res.render('contacts/index', {
      title: 'Contact Messages',
      admin: req.admin,
      contacts,
      stats: {
        total: totalCount,
        today: todayCount,
        thisWeek: weekCount,
        byStatus: stats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {})
      },
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      },
      currentFilter: status || 'all',
      search: search || '',
      status: status || 'all',
      priority: req.query.priority || 'all',
      sort: sortBy || 'createdAt',
      limit: limit || '10',
      sortBy,
      sortOrder,
      error: req.flash('error'),
      success: req.flash('success')
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    req.flash('error', 'Failed to load contact messages');
    res.redirect('/');
  }
});

router.get('/contacts/:id', async (req, res) => {
  try {
    const Contact = require('../models/Contact');
    const contact = await Contact.findById(req.params.id)
      .populate('repliedBy', 'name email');
    
    if (!contact) {
      req.flash('error', 'Contact message not found');
      return res.redirect('/contacts');
    }
    
    res.render('contacts/view', {
      title: 'Contact Message Details',
      admin: req.admin,
      contact,
      error: req.flash('error'),
      success: req.flash('success')
    });
  } catch (error) {
    console.error('Error fetching contact:', error);
    req.flash('error', 'Failed to load contact message');
    res.redirect('/contacts');
  }
});

module.exports = router;

