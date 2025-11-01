const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Password not required if using Google OAuth
    },
    minlength: 6
  },
  
  // OAuth provider fields
  googleId: {
    type: String,
    sparse: true,
    unique: true
  },
  
  provider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
adminSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Static method to hash password
adminSchema.statics.hashPassword = async function(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

module.exports = mongoose.model('Admin', adminSchema);

