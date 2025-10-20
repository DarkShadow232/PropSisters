const Booking = require('../models/Booking');
const Rental = require('../models/Rental');
const User = require('../models/User');

// GET /bookings - List all bookings
exports.listBookings = async (req, res) => {
  try {
    const { status } = req.query;

    // Build query
    const query = status && status !== 'all' ? { status } : {};

    // Get bookings with property and user details
    const bookings = await Booking.find(query)
      .populate('propertyId', 'title')
      .populate('userId', 'displayName email')
      .sort({ createdAt: -1 })
      .lean();

    // Format bookings for display
    const formattedBookings = bookings.map(booking => ({
      id: booking._id,
      propertyId: booking.propertyId?._id,
      userId: booking.userId?._id,
      propertyTitle: booking.propertyId?.title || 'Unknown Property',
      userName: booking.userId?.displayName || booking.userId?.email || 'Unknown User',
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guests: booking.guests || 1,
      status: booking.status,
      totalPrice: booking.totalPrice,
      createdAt: booking.createdAt
    }));

    res.render('bookings/index', {
      title: 'Bookings',
      admin: req.admin,
      bookings: formattedBookings,
      currentFilter: status || 'all',
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Error listing bookings:', error);
    req.flash('error', 'Error loading bookings');
    res.render('bookings/index', {
      title: 'Bookings',
      admin: req.admin,
      bookings: [],
      currentFilter: 'all',
      success: req.flash('success'),
      error: req.flash('error')
    });
  }
};

// GET /bookings/:id - View booking details
exports.viewBooking = async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = await Booking.findById(id)
      .populate('propertyId')
      .populate('userId')
      .lean();
    
    if (!booking) {
      req.flash('error', 'Booking not found');
      return res.redirect('/bookings');
    }

    const property = booking.propertyId ? {
      id: booking.propertyId._id,
      title: booking.propertyId.title,
      location: booking.propertyId.location,
      address: booking.propertyId.address,
      images: booking.propertyId.images || []
    } : null;

    const user = booking.userId ? {
      id: booking.userId._id,
      displayName: booking.userId.displayName || 'N/A',
      email: booking.userId.email,
      phoneNumber: booking.userId.phoneNumber || 'N/A'
    } : null;

    res.render('bookings/view', {
      title: 'Booking Details',
      admin: req.admin,
      booking: {
        id: booking._id,
        propertyId: booking.propertyId?._id,
        userId: booking.userId?._id,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.guests || 1,
        status: booking.status,
        totalPrice: booking.totalPrice,
        specialRequests: booking.specialRequests || '',
        cleaningService: booking.cleaningService || false,
        airportPickup: booking.airportPickup || false,
        earlyCheckIn: booking.earlyCheckIn || false,
        createdAt: booking.createdAt
      },
      property,
      user,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Error viewing booking:', error);
    req.flash('error', 'Error loading booking details');
    res.redirect('/bookings');
  }
};

// POST /bookings/:id/status - Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      req.flash('error', 'Invalid status');
      return res.redirect(`/bookings/${id}`);
    }

    await Booking.findByIdAndUpdate(id, { status });

    req.flash('success', `Booking status updated to ${status}!`);
    res.redirect(`/bookings/${id}`);
  } catch (error) {
    console.error('Error updating booking status:', error);
    req.flash('error', 'Error updating booking status');
    res.redirect(`/bookings/${req.params.id}`);
  }
};
