const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Google OAuth integration (optional, only for Google sign-in)
  googleId: {
    type: String,
    unique: true,
    sparse: true, // Allows null for email/password users
    index: true
  },
  
  // Core user fields
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  
  // Password (only for email/password users, null for Google users)
  password: {
    type: String,
    required: function() {
      // Password required only if no Google ID
      return !this.googleId;
    }
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
  
  // Authentication method tracking
  authProvider: {
    type: String,
    enum: ['email', 'google'],
    required: true
  },
  
  // Email verification (for email/password users)
  isEmailVerified: {
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

// Hash password before saving (only for email/password users)
userSchema.pre('save', async function(next) {
  this.updatedAt = Date.now();
  
  // Only hash password if it's modified and exists
  if (this.password && this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) {
    return false; // Google users don't have passwords
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check if user is using Google auth
userSchema.methods.isGoogleUser = function() {
  return this.authProvider === 'google';
};

module.exports = mongoose.model('User', userSchema);

