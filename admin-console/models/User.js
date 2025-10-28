const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  // Core user fields
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  
  // Password for email/password authentication
  password: {
    type: String,
    required: true
  },
  
  displayName: {
    type: String,
    required: true
  },
  
  phoneNumber: {
    type: String,
    default: ''
  },
  
  photoURL: {
    type: String,
    default: ''
  },
  
  role: {
    type: String,
    enum: ['user', 'owner', 'admin'],
    default: 'user'
  },
  
  // Email verification
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  
  // Password reset fields
  resetPasswordToken: {
    type: String,
    default: null
  },
  
  resetPasswordExpires: {
    type: Date,
    default: null
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

// Hash password before saving
userSchema.pre('save', async function(next) {
  this.updatedAt = Date.now();
  
  // Only hash password if it's modified
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate password reset token
userSchema.methods.generateResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour from now
  return resetToken;
};

// Method to check if reset token is valid
userSchema.methods.isResetTokenValid = function() {
  return this.resetPasswordExpires && this.resetPasswordExpires > Date.now();
};

module.exports = mongoose.model('User', userSchema);

