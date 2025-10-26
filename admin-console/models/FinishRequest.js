const mongoose = require('mongoose');

const finishRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  requestType: {
    type: String,
    enum: ['renovation', 'decoration', 'furnishing', 'maintenance', 'other'],
    required: true
  },
  propertyType: {
    type: String,
    enum: ['apartment', 'villa', 'office', 'commercial', 'other'],
    required: true
  },
  budget: {
    type: String,
    enum: ['under-10k', '10k-25k', '25k-50k', '50k-100k', '100k-plus'],
    required: true
  },
  timeline: {
    type: String,
    enum: ['asap', '1-month', '2-3-months', '3-6-months', 'flexible'],
    required: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  location: {
    type: String,
    required: true
  },
  contactPhone: {
    type: String,
    required: true
  },
  attachments: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    path: String
  }],
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  },
  notes: [{
    note: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  estimatedCost: {
    type: Number,
    default: null
  },
  actualCost: {
    type: Number,
    default: null
  },
  startDate: {
    type: Date,
    default: null
  },
  completionDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for better query performance
finishRequestSchema.index({ userId: 1, status: 1 });
finishRequestSchema.index({ status: 1, priority: 1 });
finishRequestSchema.index({ createdAt: -1 });

module.exports = mongoose.model('FinishRequest', finishRequestSchema);
