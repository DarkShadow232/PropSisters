const express = require('express');
const router = express.Router();
const Rental = require('../models/Rental');
const User = require('../models/User');
const Booking = require('../models/Booking');

/**
 * GET /api/admin/dashboard/stats
 * Get dashboard statistics
 */
router.get('/stats', async (req, res) => {
  try {
    const [totalProperties, totalUsers, totalBookings] = await Promise.all([
      Rental.countDocuments(),
      User.countDocuments(),
      Booking.countDocuments()
    ]);

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

    res.json({
      success: true,
      data: {
        totalProperties,
        totalUsers,
        totalBookings,
        pendingBookings,
        confirmedBookings,
        cancelledBookings,
        totalRevenue
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard statistics'
    });
  }
});

/**
 * GET /api/admin/dashboard/recent-bookings
 * Get recent bookings for dashboard
 */
router.get('/recent-bookings', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    const bookings = await Booking.find()
      .populate('propertyId', 'title')
      .populate('userId', 'displayName email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Recent bookings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recent bookings'
    });
  }
});

module.exports = router;

