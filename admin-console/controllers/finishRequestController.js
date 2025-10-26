const FinishRequest = require('../models/FinishRequest');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../public/uploads/finish-requests');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and documents are allowed'));
    }
  }
});

/**
 * POST /api/finish-requests
 * Create a new finish request
 */
exports.createFinishRequest = async (req, res) => {
  try {
    const {
      requestType,
      propertyType,
      budget,
      timeline,
      description,
      location,
      contactPhone
    } = req.body;

    // Validate required fields
    if (!requestType || !propertyType || !budget || !timeline || !description || !location || !contactPhone) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    // Get user info from session
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    // Process uploaded files
    const attachments = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        attachments.push({
          filename: file.filename,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          path: file.path
        });
      });
    }

    // Create finish request
    const finishRequest = new FinishRequest({
      userId: userId,
      userEmail: req.session.userEmail || '',
      userName: req.session.userName || '',
      requestType,
      propertyType,
      budget,
      timeline,
      description,
      location,
      contactPhone,
      attachments
    });

    await finishRequest.save();

    res.status(201).json({
      success: true,
      message: 'Finish request submitted successfully',
      requestId: finishRequest._id
    });

  } catch (error) {
    console.error('Error creating finish request:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create finish request'
    });
  }
};

/**
 * GET /api/finish-requests/user/:userId
 * Get finish requests for a specific user
 */
exports.getUserFinishRequests = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const requests = await FinishRequest.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      requests
    });

  } catch (error) {
    console.error('Error fetching user finish requests:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch finish requests'
    });
  }
};

/**
 * GET /api/finish-requests/:id
 * Get a specific finish request
 */
exports.getFinishRequest = async (req, res) => {
  try {
    const { id } = req.params;
    
    const request = await FinishRequest.findById(id)
      .populate('userId', 'displayName email')
      .populate('assignedTo', 'displayName email')
      .lean();

    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Finish request not found'
      });
    }

    res.json({
      success: true,
      request
    });

  } catch (error) {
    console.error('Error fetching finish request:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch finish request'
    });
  }
};

/**
 * PUT /api/finish-requests/:id
 * Update a finish request (admin only)
 */
exports.updateFinishRequest = async (req, res) => {
  try {
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
};

/**
 * GET /api/finish-requests/admin/all
 * Get all finish requests (admin only)
 */
exports.getAllFinishRequests = async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    const [requests, total] = await Promise.all([
      FinishRequest.find(query)
        .populate('userId', 'displayName email')
        .populate('assignedTo', 'displayName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      FinishRequest.countDocuments(query)
    ]);

    res.json({
      success: true,
      requests,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Error fetching all finish requests:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch finish requests'
    });
  }
};

// Export multer middleware for file uploads
exports.uploadFiles = upload.array('attachments', 5); // Max 5 files
