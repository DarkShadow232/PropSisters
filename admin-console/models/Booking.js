const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rental',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  },
  guests: {
    type: Number,
    default: 1,
    min: 1
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded', 'cancelled'],
    default: 'pending'
  },
  paymobData: {
    paymentKey: String,
    transactionId: String,
    orderId: String,
    paymentToken: String,
    hmac: String
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'wallet', 'bank_transfer', 'valu', 'fawry'],
    default: 'card'
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'EGP'
  },
  bookingStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  confirmationCode: String,
  emailSent: {
    type: Boolean,
    default: false
  },
  emailSentAt: Date,
  cancellationPolicy: {
    canCancel: {
      type: Boolean,
      default: true
    },
    refundPercentage: Number,
    cancelledAt: Date,
    cancellationReason: String
  },
  specialRequests: {
    type: String,
    default: ''
  },
  cleaningService: {
    type: Boolean,
    default: false
  },
  airportPickup: {
    type: Boolean,
    default: false
  },
  earlyCheckIn: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);

