const Contact = require('../models/Contact');

// GET /api/contacts - Get all contact messages (admin only)
exports.getAllContacts = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const contacts = await Contact.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('repliedBy', 'name email')
      .exec();
    
    const total = await Contact.countDocuments(filter);
    
    res.json({
      success: true,
      data: {
        contacts,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact messages'
    });
  }
};

// GET /api/contacts/:id - Get single contact message
exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('repliedBy', 'name email');
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }
    
    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact message'
    });
  }
};

// POST /api/contacts - Create new contact message (public)
exports.createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }
    
    const contact = new Contact({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      subject: subject.trim(),
      message: message.trim()
    });
    
    await contact.save();
    
    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully!',
      data: {
        id: contact._id
      }
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again.'
    });
  }
};

// PUT /api/contacts/:id - Update contact message (admin only)
exports.updateContact = async (req, res) => {
  try {
    const { status, priority, adminNotes } = req.body;
    
    const updateData = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    
    // If status is being changed to 'replied', set repliedAt and repliedBy
    if (status === 'replied') {
      updateData.repliedAt = new Date();
      updateData.repliedBy = req.session.adminId;
    }
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('repliedBy', 'name email');
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Contact message updated successfully',
      data: contact
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact message'
    });
  }
};

// DELETE /api/contacts/:id - Delete contact message (admin only)
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Contact message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete contact message'
    });
  }
};

// GET /api/contacts/stats - Get contact statistics (admin only)
exports.getContactStats = async (req, res) => {
  try {
    const stats = await Contact.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const total = await Contact.countDocuments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayCount = await Contact.countDocuments({
      createdAt: { $gte: today }
    });
    
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    
    const weekCount = await Contact.countDocuments({
      createdAt: { $gte: thisWeek }
    });
    
    res.json({
      success: true,
      data: {
        total,
        today: todayCount,
        thisWeek: weekCount,
        byStatus: stats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('Error fetching contact stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact statistics'
    });
  }
};
