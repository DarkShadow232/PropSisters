const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const Rental = require('../models/Rental');

// Configure multer for property images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/rentals/');
  },
  filename: function (req, file, cb) {
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
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// ==================== PUBLIC PROPERTY ROUTES ====================

/**
 * GET /api/properties (Simple, direct endpoint)
 * Get all properties - Simple version for frontend
 */
router.get('/', async (req, res) => {
  try {
    const properties = await Rental.find({})
      .sort({ priority: -1, createdAt: -1 })
      .lean();
    
    res.json(properties);
  } catch (error) {
    console.error('Properties error:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

/**
 * GET /api/public/properties
 * Get all available properties for public viewing
 */
router.get('/public', async (req, res) => {
  try {
    const { location, minPrice, maxPrice, bedrooms, page = 1, limit = 50 } = req.query;
    
    // Only show available properties to public
    const query = { availability: true };
    
    if (location) {
      query.location = new RegExp(location, 'i');
    }
    
    if (bedrooms) {
      query.bedrooms = parseInt(bedrooms);
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [properties, total] = await Promise.all([
      Rental.find(query)
        .select('-__v')
        .sort({ priority: -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean()
        .then(props => props.map(p => ({ ...p, id: p._id.toString() }))),
      Rental.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: properties,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Public properties error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch properties'
    });
  }
});

/**
 * GET /api/public/properties/:id
 * Get single property by ID for public viewing
 */
router.get('/public/:id', async (req, res) => {
  try {
    const property = await Rental.findById(req.params.id)
      .select('-__v')
      .lean()
      .then(p => p ? { ...p, id: p._id.toString() } : null);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found'
      });
    }

    // Only show available properties to public
    if (!property.availability) {
      return res.status(404).json({
        success: false,
        error: 'Property not available'
      });
    }

    res.json({
      success: true,
      data: property
    });
  } catch (error) {
    console.error('Get public property error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch property'
    });
  }
});

// ==================== ADMIN PROPERTY ROUTES ====================

/**
 * GET /api/admin/properties
 * Get all properties with optional filters
 */
router.get('/admin', async (req, res) => {
  try {
    const { availability, location, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
    
    const query = {};
    if (availability !== undefined) query.availability = availability === 'true';
    if (location) query.location = new RegExp(location, 'i');
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [properties, total] = await Promise.all([
      Rental.find(query)
        .sort({ priority: -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Rental.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: properties,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('List properties error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch properties'
    });
  }
});

/**
 * GET /api/admin/properties/:id
 * Get single property by ID
 */
router.get('/admin/:id', async (req, res) => {
  try {
    const property = await Rental.findById(req.params.id).lean();
    
    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found'
      });
    }

    res.json({
      success: true,
      data: property
    });
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch property'
    });
  }
});

/**
 * POST /api/admin/properties
 * Create new property
 */
router.post('/admin', upload.array('images', 10), async (req, res) => {
  try {
    const {
      title, description, location, address, price,
      bedrooms, bathrooms, amenities,
      ownerName, ownerEmail, ownerPhone, availability,
      priority, status
    } = req.body;

    if (!title || !description || !location || !address || !price) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: title, description, location, address, price'
      });
    }

    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        imageUrls.push(`/uploads/rentals/${file.filename}`);
      });
    }

    let amenitiesArray = [];
    if (amenities) {
      amenitiesArray = Array.isArray(amenities) 
        ? amenities 
        : amenities.split(',').map(a => a.trim()).filter(a => a);
    }

    const rental = new Rental({
      title,
      description,
      location,
      address,
      price: parseFloat(price),
      bedrooms: parseInt(bedrooms) || 0,
      bathrooms: parseInt(bathrooms) || 0,
      amenities: amenitiesArray,
      images: imageUrls,
      ownerName: ownerName || 'Admin',
      ownerEmail: ownerEmail || req.admin.email,
      ownerPhone: ownerPhone || '',
      availability: availability === 'true' || availability === true,
      priority: parseInt(priority) || 0,
      status: status || 'active'
    });

    await rental.save();

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: rental
    });
  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create property: ' + error.message
    });
  }
});

/**
 * PUT /api/admin/properties/:id
 * Update existing property
 */
router.put('/admin/:id', upload.array('images', 10), async (req, res) => {
  try {
    const property = await Rental.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found'
      });
    }

    const {
      title, description, location, address, price,
      bedrooms, bathrooms, amenities,
      ownerName, ownerEmail, ownerPhone, availability,
      priority, status, existingImages
    } = req.body;

    // Handle images
    let imageUrls = [];
    if (existingImages) {
      imageUrls = Array.isArray(existingImages) ? existingImages : [existingImages];
    }

    // Delete removed images
    const removedImages = property.images.filter(img => !imageUrls.includes(img));
    for (const imgPath of removedImages) {
      try {
        const fullPath = path.join(__dirname, '..', 'public', imgPath);
        await fs.unlink(fullPath);
      } catch (err) {
        console.error('Error deleting image:', err);
      }
    }

    // Add new images
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        imageUrls.push(`/uploads/rentals/${file.filename}`);
      });
    }

    // Parse amenities
    let amenitiesArray = [];
    if (amenities) {
      amenitiesArray = Array.isArray(amenities) 
        ? amenities 
        : amenities.split(',').map(a => a.trim()).filter(a => a);
    }

    // Update property
    property.title = title || property.title;
    property.description = description || property.description;
    property.location = location || property.location;
    property.address = address || property.address;
    property.price = price ? parseFloat(price) : property.price;
    property.bedrooms = bedrooms ? parseInt(bedrooms) : property.bedrooms;
    property.bathrooms = bathrooms ? parseInt(bathrooms) : property.bathrooms;
    property.amenities = amenitiesArray.length > 0 ? amenitiesArray : property.amenities;
    property.images = imageUrls;
    property.ownerName = ownerName || property.ownerName;
    property.ownerEmail = ownerEmail || property.ownerEmail;
    property.ownerPhone = ownerPhone || property.ownerPhone;
    property.availability = availability !== undefined 
      ? (availability === 'true' || availability === true) 
      : property.availability;
    property.priority = priority !== undefined ? parseInt(priority) : property.priority;
    property.status = status || property.status;

    await property.save();

    res.json({
      success: true,
      message: 'Property updated successfully',
      data: property
    });
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update property: ' + error.message
    });
  }
});

/**
 * DELETE /api/admin/properties/:id
 * Delete property
 */
router.delete('/admin/:id', async (req, res) => {
  try {
    const property = await Rental.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found'
      });
    }

    // Delete images
    if (property.images && property.images.length > 0) {
      for (const imgPath of property.images) {
        try {
          const fullPath = path.join(__dirname, '..', 'public', imgPath);
          await fs.unlink(fullPath);
        } catch (err) {
          console.error('Error deleting image:', err);
        }
      }
    }

    await Rental.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete property'
    });
  }
});

module.exports = router;

