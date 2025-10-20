const Rental = require('../models/Rental');
const path = require('path');
const fs = require('fs').promises;

// GET /properties - List all properties
exports.listProperties = async (req, res) => {
  try {
    const properties = await Rental.find()
      .sort({ createdAt: -1 })
      .lean();

    res.render('properties/index', {
      title: 'Properties',
      admin: req.admin,
      properties,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Error listing properties:', error);
    req.flash('error', 'Error loading properties');
    res.render('properties/index', {
      title: 'Properties',
      admin: req.admin,
      properties: [],
      success: req.flash('success'),
      error: req.flash('error')
    });
  }
};

// GET /properties/create - Show create form
exports.getCreateProperty = (req, res) => {
  res.render('properties/create', {
    title: 'Create Property',
    admin: req.admin,
    error: req.flash('error')
  });
};

// POST /properties/create - Create new property
exports.postCreateProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      address,
      price,
      bedrooms,
      bathrooms,
      amenities,
      ownerName,
      ownerEmail,
      ownerPhone,
      availability
    } = req.body;

    // Validate required fields
    if (!title || !description || !location || !address || !price) {
      req.flash('error', 'Please fill in all required fields');
      return res.redirect('/properties/create');
    }

    // Handle image uploads
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        // Store relative path from public directory
        imageUrls.push(`/uploads/rentals/${file.filename}`);
      });
    }

    // Parse amenities (can be array or comma-separated string)
    let amenitiesArray = [];
    if (amenities) {
      if (Array.isArray(amenities)) {
        amenitiesArray = amenities;
      } else {
        amenitiesArray = amenities.split(',').map(a => a.trim()).filter(a => a);
      }
    }

    // Create property document
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
      availability: availability === 'true' || availability === true
    });

    await rental.save();

    req.flash('success', 'Property created successfully!');
    res.redirect('/properties');
  } catch (error) {
    console.error('Error creating property:', error);
    req.flash('error', 'Error creating property: ' + error.message);
    res.redirect('/properties/create');
  }
};

// GET /properties/:id/edit - Show edit form
exports.getEditProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Rental.findById(id).lean();

    if (!property) {
      req.flash('error', 'Property not found');
      return res.redirect('/properties');
    }

    res.render('properties/edit', {
      title: 'Edit Property',
      admin: req.admin,
      property,
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Error loading property:', error);
    req.flash('error', 'Error loading property');
    res.redirect('/properties');
  }
};

// POST /properties/:id/edit - Update property
exports.postEditProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      location,
      address,
      price,
      bedrooms,
      bathrooms,
      amenities,
      ownerName,
      ownerEmail,
      ownerPhone,
      availability,
      existingImages
    } = req.body;

    // Get current property
    const property = await Rental.findById(id);
    if (!property) {
      req.flash('error', 'Property not found');
      return res.redirect('/properties');
    }

    // Handle existing images (keep the ones not deleted)
    let imageUrls = [];
    if (existingImages) {
      imageUrls = Array.isArray(existingImages) ? existingImages : [existingImages];
    }

    // Delete removed images from disk
    const removedImages = property.images.filter(img => !imageUrls.includes(img));
    for (const imgPath of removedImages) {
      try {
        const fullPath = path.join(__dirname, '..', 'public', imgPath);
        await fs.unlink(fullPath);
      } catch (err) {
        console.error('Error deleting image:', err);
      }
    }

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        imageUrls.push(`/uploads/rentals/${file.filename}`);
      });
    }

    // Parse amenities
    let amenitiesArray = [];
    if (amenities) {
      if (Array.isArray(amenities)) {
        amenitiesArray = amenities;
      } else {
        amenitiesArray = amenities.split(',').map(a => a.trim()).filter(a => a);
      }
    }

    // Update property
    property.title = title;
    property.description = description;
    property.location = location;
    property.address = address;
    property.price = parseFloat(price);
    property.bedrooms = parseInt(bedrooms) || 0;
    property.bathrooms = parseInt(bathrooms) || 0;
    property.amenities = amenitiesArray;
    property.images = imageUrls;
    property.ownerName = ownerName || property.ownerName;
    property.ownerEmail = ownerEmail || property.ownerEmail;
    property.ownerPhone = ownerPhone || property.ownerPhone;
    property.availability = availability === 'true' || availability === true;

    await property.save();

    req.flash('success', 'Property updated successfully!');
    res.redirect('/properties');
  } catch (error) {
    console.error('Error updating property:', error);
    req.flash('error', 'Error updating property: ' + error.message);
    res.redirect(`/properties/${req.params.id}/edit`);
  }
};

// POST /properties/:id/delete - Delete property
exports.deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    // Get property to delete associated images
    const property = await Rental.findById(id);
    
    if (!property) {
      req.flash('error', 'Property not found');
      return res.redirect('/properties');
    }

    // Delete images from disk
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

    // Delete property document
    await Rental.findByIdAndDelete(id);

    req.flash('success', 'Property deleted successfully!');
    res.redirect('/properties');
  } catch (error) {
    console.error('Error deleting property:', error);
    req.flash('error', 'Error deleting property');
    res.redirect('/properties');
  }
};
