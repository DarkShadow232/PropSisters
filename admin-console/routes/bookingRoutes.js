const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

// Public booking routes
router.post('/create', isAuthenticated, bookingController.createBooking);
router.post('/payment/callback', bookingController.handlePaymentCallback);
router.get('/user/:userId', isAuthenticated, bookingController.getUserBookings);
router.get('/property/:propertyId', bookingController.getBookingsByProperty);
router.get('/:id', isAuthenticated, bookingController.getBookingDetails);
router.post('/:id/cancel', isAuthenticated, bookingController.cancelBooking);

// Admin booking routes
router.get('/admin/all', isAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (status && status !== 'all') {
      query.bookingStatus = status;
    }

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate('propertyId', 'title location')
        .populate('userId', 'displayName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Booking.countDocuments(query)
    ]);

    res.json({
      success: true,
      bookings: bookings.map(booking => ({
        id: booking._id,
        property: {
          id: booking.propertyId._id,
          title: booking.propertyId.title,
          location: booking.propertyId.location
        },
        user: {
          id: booking.userId._id,
          name: booking.userId.displayName || booking.userId.email,
          email: booking.userId.email
        },
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.guests,
        totalAmount: booking.totalAmount,
        currency: booking.currency,
        bookingStatus: booking.bookingStatus,
        paymentStatus: booking.paymentStatus,
        confirmationCode: booking.confirmationCode,
        createdAt: booking.createdAt
      })),
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error getting all bookings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get bookings'
    });
  }
});

router.patch('/admin/:id/status', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'active', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { bookingStatus: status },
      { new: true }
    ).populate('propertyId').populate('userId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Send notification email if status changed to confirmed
    if (status === 'confirmed' && booking.emailSent === false) {
      const emailService = require('../services/emailService');
      await emailService.sendBookingConfirmation(booking, booking.userId, booking.propertyId);
    }

    res.json({
      success: true,
      booking: {
        id: booking._id,
        bookingStatus: booking.bookingStatus,
        paymentStatus: booking.paymentStatus,
        confirmationCode: booking.confirmationCode
      }
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update booking status'
    });
  }
});

// Get booking statistics for admin dashboard
router.get('/admin/stats', isAdmin, async (req, res) => {
  try {
    const Booking = require('../models/Booking');
    
    const [
      totalBookings,
      pendingBookings,
      confirmedBookings,
      activeBookings,
      completedBookings,
      cancelledBookings,
      totalRevenue
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ bookingStatus: 'pending' }),
      Booking.countDocuments({ bookingStatus: 'confirmed' }),
      Booking.countDocuments({ bookingStatus: 'active' }),
      Booking.countDocuments({ bookingStatus: 'completed' }),
      Booking.countDocuments({ bookingStatus: 'cancelled' }),
      Booking.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ])
    ]);

    res.json({
      success: true,
      stats: {
        totalBookings,
        pendingBookings,
        confirmedBookings,
        activeBookings,
        completedBookings,
        cancelledBookings,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Error getting booking stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get booking statistics'
    });
  }
});

// Resend confirmation email
router.post('/admin/:id/resend-email', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body; // 'confirmation', 'receipt', 'cancellation'

    const booking = await Booking.findById(id)
      .populate('propertyId')
      .populate('userId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    const emailService = require('../services/emailService');
    
    switch (type) {
      case 'confirmation':
        await emailService.sendBookingConfirmation(booking, booking.userId, booking.propertyId);
        break;
      case 'receipt':
        const payment = await Payment.findOne({ bookingId: id });
        if (payment) {
          await emailService.sendPaymentReceipt(booking, payment, booking.userId, booking.propertyId);
        }
        break;
      case 'cancellation':
        await emailService.sendCancellationEmail(booking, 0, booking.userId, booking.propertyId);
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid email type'
        });
    }

    res.json({
      success: true,
      message: `${type} email sent successfully`
    });
  } catch (error) {
    console.error('Error resending email:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to resend email'
    });
  }
});

module.exports = router;