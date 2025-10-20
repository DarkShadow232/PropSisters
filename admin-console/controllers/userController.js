const User = require('../models/User');
const Booking = require('../models/Booking');

// GET /users - List all users
exports.listUsers = async (req, res) => {
  try {
    const users = await User.find()
      .sort({ createdAt: -1 })
      .lean();

    res.render('users/index', {
      title: 'Users',
      admin: req.admin,
      users,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Error listing users:', error);
    req.flash('error', 'Error loading users');
    res.render('users/index', {
      title: 'Users',
      admin: req.admin,
      users: [],
      success: req.flash('success'),
      error: req.flash('error')
    });
  }
};

// GET /users/:id - View user details
exports.viewUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get user document
    const user = await User.findById(id).lean();
    
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/users');
    }

    // Get user's bookings with property details
    const bookings = await Booking.find({ userId: id })
      .populate('propertyId', 'title')
      .sort({ createdAt: -1 })
      .lean();

    // Format bookings
    const formattedBookings = bookings.map(booking => ({
      id: booking._id,
      propertyId: booking.propertyId?._id,
      propertyTitle: booking.propertyId?.title || 'Unknown Property',
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      status: booking.status,
      totalPrice: booking.totalPrice,
      createdAt: booking.createdAt
    }));

    res.render('users/view', {
      title: 'User Details',
      admin: req.admin,
      user,
      bookings: formattedBookings,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Error viewing user:', error);
    req.flash('error', 'Error loading user details');
    res.redirect('/users');
  }
};

// POST /users/:id/delete - Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Get user document
    const user = await User.findById(id);
    
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/users');
    }

    // Delete user document from MongoDB
    await User.findByIdAndDelete(id);

    req.flash('success', 'User deleted successfully!');
    res.redirect('/users');
  } catch (error) {
    console.error('Error deleting user:', error);
    req.flash('error', 'Error deleting user');
    res.redirect('/users');
  }
};
