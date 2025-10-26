const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  bedrooms: {
    type: Number,
    default: 1,
    min: 0
  },
  bathrooms: {
    type: Number,
    default: 1,
    min: 0
  },
  amenities: [{
    type: String,
    trim: true
  }],
  images: [{
    type: String
  }],
  ownerName: {
    type: String,
    default: 'Admin'
  },
  ownerEmail: {
    type: String,
    default: ''
  },
  ownerPhone: {
    type: String,
    default: ''
  },
  availability: {
    type: Boolean,
    default: true
  },
  priority: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending', 'maintenance', 'sold'],
    default: 'active'
  },
  calendar: [{
    date: {
      type: Date,
      required: true
    },
    available: {
      type: Boolean,
      default: true
    },
    price: Number,
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    }
  }],
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  pricePerDate: {
    type: Map,
    of: Number
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
rentalSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Rental', rentalSchema);

