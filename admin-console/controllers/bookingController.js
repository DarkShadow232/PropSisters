const Booking = require('../models/Booking');
const Rental = require('../models/Rental');
const User = require('../models/User');
const Payment = require('../models/Payment');
const PaymobService = require('../services/paymobService');
const EmailService = require('../services/emailService');
const CalendarService = require('../services/calendarService');
const crypto = require('crypto');

// GET /bookings - List all bookings
exports.listBookings = async (req, res) => {
  try {
    const { status } = req.query;

    // Build query
    const query = status && status !== 'all' ? { bookingStatus: status } : {};

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
      status: booking.bookingStatus,
      totalPrice: booking.totalPrice,
      createdAt: booking.createdAt
    }));

    res.render('bookings/index', {
      title: 'Bookings',
      admin: req.admin,
      bookings: formattedBookings,
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
    console.error('Error listing bookings:', error);
    req.flash('error', 'Error loading bookings');
    res.render('bookings/index', {
      title: 'Bookings',
      admin: req.admin,
      bookings: [],
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

// Create new booking with Paymob integration
exports.createBooking = async (req, res) => {
  try {
    const {
      propertyId,
      checkIn,
      checkOut,
      guests,
      specialRequests,
      cleaningService,
      airportPickup,
      earlyCheckIn,
      billingData
    } = req.body;

    // Validate required fields
    if (!propertyId || !checkIn || !checkOut || !guests) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Check property exists and is available
    const property = await Rental.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found'
      });
    }

    if (!property.availability || property.status !== 'active') {
      return res.status(400).json({
        success: false,
        error: 'Property is not available for booking'
      });
    }

    // Check availability using calendar service
    const calendarService = new CalendarService();
    const isAvailable = await calendarService.checkAvailability(propertyId, new Date(checkIn), new Date(checkOut));
    
    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        error: 'Selected dates are not available'
      });
    }

    // Calculate total price
    const totalPrice = await calendarService.getPriceForDateRange(propertyId, new Date(checkIn), new Date(checkOut));
    
    // Generate confirmation code
    const confirmationCode = crypto.randomBytes(6).toString('hex').toUpperCase();

    // Create booking
    const booking = new Booking({
      propertyId,
      userId: req.user?.id || billingData?.userId || null, // Handle both authenticated and public requests
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      guests: parseInt(guests),
      totalPrice,
      totalAmount: totalPrice,
      currency: 'EGP',
      specialRequests: specialRequests || '',
      cleaningService: cleaningService === 'true' || cleaningService === true,
      airportPickup: airportPickup === 'true' || airportPickup === true,
      earlyCheckIn: earlyCheckIn === 'true' || earlyCheckIn === true,
      confirmationCode,
      paymentStatus: 'pending',
      bookingStatus: 'pending'
    });

    await booking.save();

    // Initialize Paymob payment
    const paymobService = new PaymobService();
    
    // Create order
    const order = await paymobService.createOrder(totalPrice, 'EGP', [{
      name: property.title,
      amount_cents: Math.round(totalPrice * 100),
      description: `Booking for ${property.title}`,
      quantity: 1
    }]);

    // Create payment key
    const paymentKey = await paymobService.createPaymentKey(
      order.id,
      totalPrice,
      req.user || billingData, // Use billingData if no authenticated user
      billingData
    );

    // Update booking with Paymob data
    booking.paymobData = {
      orderId: order.id,
      paymentKey: paymentKey.token,
      paymentToken: paymentKey.token
    };
    await booking.save();

    res.json({
      success: true,
      bookingId: booking._id,
      paymentUrl: paymobService.generatePaymentUrl(paymentKey.token),
      confirmationCode: booking.confirmationCode
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create booking: ' + error.message
    });
  }
};

// Handle Paymob payment callback
exports.handlePaymentCallback = async (req, res) => {
  try {
    const {
      hmac,
      transaction_id,
      order_id,
      success,
      error_occured,
      data
    } = req.body;

    // Find booking by order ID
    const booking = await Booking.findOne({ 'paymobData.orderId': order_id })
      .populate('propertyId')
      .populate('userId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Verify HMAC
    const paymobService = new PaymobService();
    const isValidHmac = paymobService.verifyPaymentHmac(data);

    if (!isValidHmac) {
      console.error('Invalid HMAC for booking:', booking._id);
      return res.status(400).json({
        success: false,
        error: 'Invalid payment verification'
      });
    }

    if (success === 'true' && !error_occured) {
      // Payment successful
      booking.paymentStatus = 'paid';
      booking.bookingStatus = 'confirmed';
      booking.paymobData.transactionId = transaction_id;
      booking.paymobData.hmac = hmac;
      await booking.save();

      // Create payment record
      const payment = new Payment({
        bookingId: booking._id,
        userId: booking.userId._id,
        amount: booking.totalAmount,
        currency: booking.currency,
        paymentMethod: 'card', // Default, will be updated from Paymob response
        paymobTransactionId: transaction_id,
        paymobOrderId: order_id,
        status: 'completed'
      });
      await payment.save();

      // Block calendar dates
      const calendarService = new CalendarService();
      await calendarService.blockDates(
        booking.propertyId._id,
        booking.checkIn,
        booking.checkOut,
        booking._id
      );

      // Send confirmation email
      const emailService = new EmailService();
      await emailService.sendBookingConfirmation(booking, booking.userId, booking.propertyId);
      await emailService.sendPaymentReceipt(booking, payment, booking.userId, booking.propertyId);
      await emailService.sendAdminNotification(booking, 'new_booking', booking.userId, booking.propertyId);

    } else {
      // Payment failed
      booking.paymentStatus = 'failed';
      booking.bookingStatus = 'cancelled';
      await booking.save();

      // Notify admin of payment failure
      const emailService = new EmailService();
      await emailService.sendAdminNotification(booking, 'payment_failed', booking.userId, booking.propertyId);
    }

    res.json({ success: true });

  } catch (error) {
    console.error('Error handling payment callback:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process payment callback'
    });
  }
};

// Cancel booking with refund
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findById(id)
      .populate('propertyId')
      .populate('userId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Check if booking can be cancelled
    if (!booking.cancellationPolicy.canCancel) {
      return res.status(400).json({
        success: false,
        error: 'This booking cannot be cancelled'
      });
    }

    // Calculate refund amount based on cancellation policy
    const daysUntilCheckIn = Math.ceil((new Date(booking.checkIn) - new Date()) / (1000 * 60 * 60 * 24));
    let refundPercentage = 0;

    if (daysUntilCheckIn > 7) {
      refundPercentage = 100; // Full refund
    } else if (daysUntilCheckIn > 3) {
      refundPercentage = 50; // 50% refund
    } else if (daysUntilCheckIn > 1) {
      refundPercentage = 25; // 25% refund
    } else {
      refundPercentage = 0; // No refund
    }

    const refundAmount = (booking.totalAmount * refundPercentage) / 100;

    // Process refund if applicable
    if (refundAmount > 0 && booking.paymobData.transactionId) {
      const paymobService = new PaymobService();
      await paymobService.processRefund(booking.paymobData.transactionId, refundAmount);
    }

    // Update booking status
    booking.bookingStatus = 'cancelled';
    booking.paymentStatus = refundAmount > 0 ? 'refunded' : 'cancelled';
    booking.cancellationPolicy.cancelledAt = new Date();
    booking.cancellationPolicy.cancellationReason = reason;
    booking.cancellationPolicy.refundPercentage = refundPercentage;
    await booking.save();

    // Unblock calendar dates
    const calendarService = new CalendarService();
    await calendarService.unblockDates(
      booking.propertyId._id,
      booking.checkIn,
      booking.checkOut
    );

    // Send cancellation email
    const emailService = new EmailService();
    await emailService.sendCancellationEmail(booking, refundAmount, booking.userId, booking.propertyId);
    await emailService.sendAdminNotification(booking, 'cancellation', booking.userId, booking.propertyId);

    res.json({
      success: true,
      refundAmount,
      refundPercentage
    });

  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel booking: ' + error.message
    });
  }
};

// Get user bookings
exports.getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.query;

    const query = { userId };
    if (status && status !== 'all') {
      query.bookingStatus = status;
    }

    const bookings = await Booking.find(query)
      .populate('propertyId', 'title location images')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      bookings: bookings.map(booking => ({
        id: booking._id,
        property: {
          id: booking.propertyId._id,
          title: booking.propertyId.title,
          location: booking.propertyId.location,
          images: booking.propertyId.images
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
      }))
    });

  } catch (error) {
    console.error('Error getting user bookings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user bookings'
    });
  }
};

// Get booking details
exports.getBookingDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate('propertyId')
      .populate('userId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    res.json({
      success: true,
      booking: {
        id: booking._id,
        property: {
          id: booking.propertyId._id,
          title: booking.propertyId.title,
          location: booking.propertyId.location,
          address: booking.propertyId.address,
          images: booking.propertyId.images
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
        specialRequests: booking.specialRequests,
        cleaningService: booking.cleaningService,
        airportPickup: booking.airportPickup,
        earlyCheckIn: booking.earlyCheckIn,
        paymobData: booking.paymobData,
        cancellationPolicy: booking.cancellationPolicy,
        createdAt: booking.createdAt
      }
    });

  } catch (error) {
    console.error('Error getting booking details:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get booking details'
    });
  }
};

/**
 * GET /api/bookings/property/:propertyId
 * Get all bookings for a specific property (public route for calendar)
 */
exports.getBookingsByProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    
    // Get all active bookings for this property
    const bookings = await Booking.find({
      propertyId: propertyId,
      bookingStatus: { $in: ['confirmed', 'paid', 'active'] }
    })
    .select('checkIn checkOut bookingStatus')
    .lean();
    
    // Format the response for calendar usage
    const formattedBookings = bookings.map(booking => ({
      id: booking._id,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      status: booking.bookingStatus
    }));
    
    res.json(formattedBookings);
  } catch (error) {
    console.error('Error fetching bookings by property:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bookings for property'
    });
  }
};
