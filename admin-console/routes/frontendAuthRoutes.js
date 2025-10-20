const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const User = require('../models/User');

// Initialize Firebase Admin SDK (for Google Sign-In token verification only)
let firebaseAdmin;
try {
  if (!admin.apps.length) {
    firebaseAdmin = admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || 'proparty-sister',
    });
  } else {
    firebaseAdmin = admin.app();
  }
} catch (error) {
  console.warn('Firebase Admin not initialized:', error.message);
}

/**
 * Middleware to verify Firebase ID token (for Google Sign-In only)
 */
const verifyGoogleToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const idToken = authHeader.split('Bearer ')[1];
    
    if (!firebaseAdmin) {
      console.error('Firebase Admin not initialized');
      return res.status(500).json({
        success: false,
        message: 'Authentication service not available'
      });
    }

    // Verify the Google token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.googleUser = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// ==================== EMAIL/PASSWORD AUTHENTICATION (MongoDB) ====================

/**
 * POST /api/auth/register
 * Register new user with email and password (stored in MongoDB)
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, displayName, phoneNumber } = req.body;

    // Validate required fields
    if (!email || !password || !displayName) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and display name are required'
      });
    }

    // Check password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user (password will be hashed by pre-save hook)
    const user = new User({
      email: email.toLowerCase(),
      password,
      displayName,
      phoneNumber: phoneNumber || '',
      authProvider: 'email',
      role: 'user',
      isEmailVerified: false // Can implement email verification later
    });

    await user.save();

    // Create session
    req.session.userId = user._id;
    req.session.userEmail = user.email;
    req.session.userName = user.displayName;

    // Return user data (exclude password)
    const userResponse = {
      id: user._id,
      email: user.email,
      displayName: user.displayName,
      phoneNumber: user.phoneNumber,
      photoURL: user.photoURL,
      role: user.role,
      authProvider: user.authProvider
    };

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register user: ' + error.message
    });
  }
});

/**
 * POST /api/auth/login
 * Login with email and password (MongoDB authentication)
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user registered with Google
    if (user.isGoogleUser()) {
      return res.status(400).json({
        success: false,
        message: 'This account uses Google Sign-In. Please sign in with Google.'
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Create session
    req.session.userId = user._id;
    req.session.userEmail = user.email;
    req.session.userName = user.displayName;

    // Return user data (exclude password)
    const userResponse = {
      id: user._id,
      email: user.email,
      displayName: user.displayName,
      phoneNumber: user.phoneNumber,
      photoURL: user.photoURL,
      role: user.role,
      authProvider: user.authProvider
    };

    res.json({
      success: true,
      message: 'Logged in successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to login: ' + error.message
    });
  }
});

// ==================== GOOGLE OAUTH AUTHENTICATION ====================

/**
 * POST /api/auth/google
 * Authenticate with Google (verify token and create/update user in MongoDB)
 */
router.post('/google', verifyGoogleToken, async (req, res) => {
  try {
    const { uid, email, name, picture } = req.googleUser;

    // Find user by Google ID or email
    let user = await User.findOne({
      $or: [
        { googleId: uid },
        { email: email.toLowerCase() }
      ]
    });
    
    if (!user) {
      // Create new user with Google auth
      user = new User({
        googleId: uid,
        email: email.toLowerCase(),
        displayName: name || email.split('@')[0],
        photoURL: picture || '',
        authProvider: 'google',
        role: 'user',
        isEmailVerified: true // Google emails are pre-verified
      });
      
      await user.save();
    } else {
      // Update existing user
      if (!user.googleId) {
        // If user registered with email/password, link Google account
        user.googleId = uid;
      }
      
      // Update profile info from Google
      user.displayName = name || user.displayName;
      user.photoURL = picture || user.photoURL;
      user.updatedAt = new Date();
      
      await user.save();
    }

    // Create session
    req.session.userId = user._id;
    req.session.userEmail = user.email;
    req.session.userName = user.displayName;
    req.session.googleId = uid;

    // Return user data
    const userResponse = {
      id: user._id,
      email: user.email,
      displayName: user.displayName,
      phoneNumber: user.phoneNumber,
      photoURL: user.photoURL,
      role: user.role,
      authProvider: user.authProvider
    };

    res.json({
      success: true,
      message: 'Authenticated with Google successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to authenticate with Google: ' + error.message
    });
  }
});

// ==================== SESSION MANAGEMENT ====================

/**
 * GET /api/auth/verify
 * Verify current session
 */
router.get('/verify', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    const user = await User.findById(req.session.userId)
      .select('-password') // Exclude password
      .lean();
    
    if (!user) {
      req.session.destroy();
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        phoneNumber: user.phoneNumber,
        photoURL: user.photoURL,
        role: user.role,
        authProvider: user.authProvider
      }
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({
      success: false,
      message: 'Session verification failed'
    });
  }
});

/**
 * GET /api/auth/me
 * Get current user
 */
router.get('/me', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    const user = await User.findById(req.session.userId)
      .select('-password')
      .lean();
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        phoneNumber: user.phoneNumber,
        photoURL: user.photoURL,
        role: user.role,
        authProvider: user.authProvider,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user'
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout user (destroy session)
 */
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  });
});

/**
 * PUT /api/auth/profile
 * Update user profile
 */
router.put('/profile', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    const { displayName, phoneNumber, photoURL } = req.body;
    
    const user = await User.findById(req.session.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields
    if (displayName) user.displayName = displayName;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (photoURL !== undefined) user.photoURL = photoURL;
    user.updatedAt = new Date();

    await user.save();

    // Update session
    req.session.userName = user.displayName;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        phoneNumber: user.phoneNumber,
        photoURL: user.photoURL,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

/**
 * POST /api/auth/change-password
 * Change password (email/password users only)
 */
router.post('/change-password', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long'
      });
    }

    const user = await User.findById(req.session.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is using Google auth
    if (user.isGoogleUser()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change password for Google accounts'
      });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
});

module.exports = router;
