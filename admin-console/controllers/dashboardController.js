const Rental = require('../models/Rental');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Contact = require('../models/Contact');

// GET / - Dashboard
exports.getDashboard = async (req, res) => {
  try {
    // Fetch statistics from MongoDB
    const [totalProperties, totalUsers, totalBookings, totalContacts] = await Promise.all([
      Rental.countDocuments(),
      User.countDocuments(),
      Booking.countDocuments(),
      Contact.countDocuments()
    ]);

    // Calculate booking stats
    const bookingStats = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      }
    ]);

    let pendingBookings = 0;
    let confirmedBookings = 0;
    let cancelledBookings = 0;
    let totalRevenue = 0;

    bookingStats.forEach(stat => {
      if (stat._id === 'pending') pendingBookings = stat.count;
      if (stat._id === 'confirmed') {
        confirmedBookings = stat.count;
        totalRevenue = stat.revenue;
      }
      if (stat._id === 'cancelled') cancelledBookings = stat.count;
    });

    // Get recent bookings with property and user details
    const recentBookings = await Booking.find()
      .populate('propertyId', 'title')
      .populate('userId', 'displayName email')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Format bookings for display
    const latestBookings = recentBookings.map(booking => ({
      id: booking._id,
      propertyTitle: booking.propertyId?.title || 'Unknown Property',
      userName: booking.userId?.displayName || booking.userId?.email || 'Unknown User',
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      status: booking.status,
      totalPrice: booking.totalPrice,
      createdAt: booking.createdAt
    }));

    res.render('dashboard', {
      title: 'Dashboard',
      admin: req.admin,
      stats: {
        totalProperties,
        totalUsers,
        totalBookings,
        totalContacts,
        pendingBookings,
        confirmedBookings,
        cancelledBookings,
        totalRevenue
      },
      recentBookings: latestBookings
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    req.flash('error', 'Error loading dashboard data');
    res.render('dashboard', {
      title: 'Dashboard',
      admin: req.admin,
      stats: {
        totalProperties: 0,
        totalUsers: 0,
        totalBookings: 0,
        totalContacts: 0,
        pendingBookings: 0,
        confirmedBookings: 0,
        cancelledBookings: 0,
        totalRevenue: 0
      },
      recentBookings: []
    });
  }
};
