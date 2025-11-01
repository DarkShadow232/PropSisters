const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const passwordResetController = require('../controllers/passwordResetController');

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

    // User authentication is email/password only

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
 * GET /api/auth/google
 * Initiate Google OAuth flow for frontend users
 */
router.get('/google', (req, res, next) => {
  console.log('\n🔵 Google OAuth Initiation Request');
  console.log('   Time:', new Date().toISOString());
  console.log('   Client IP:', req.ip);
  console.log('   User-Agent:', req.get('user-agent'));
  console.log('   Referer:', req.get('referer'));
  console.log('   Redirecting to Google...\n');
  next();
}, passport.authenticate('google-user', { 
  scope: ['profile', 'email'] 
}));

/**
 * GET /api/auth/google/callback
 * Handle Google OAuth callback for frontend users
 */
router.get('/google/callback', (req, res, next) => {
  console.log('\n🔵 Google OAuth Callback Request');
  console.log('   Time:', new Date().toISOString());
  console.log('   Query params:', req.query);
  console.log('   Has code:', !!req.query.code);
  console.log('   Has error:', !!req.query.error);
  if (req.query.error) {
    console.log('   ❌ OAuth Error:', req.query.error);
  }
  next();
}, passport.authenticate('google-user', { 
  failureRedirect: process.env.FRONTEND_URL + '/?error=google_auth_failed',
  session: true
}),
  async (req, res) => {
    try {
      console.log('✅ Google OAuth callback - User authenticated:', req.user.email);
      
      // Create session
      req.session.userId = req.user._id;
      req.session.userEmail = req.user.email;
      req.session.userName = req.user.displayName;
      
      // Force session save before redirect
      req.session.save((err) => {
        if (err) {
          console.error('🔴 Session save error:', err);
          return res.redirect(process.env.FRONTEND_URL + '/?error=session_error');
        }
        
        console.log('✅ Google OAuth session saved successfully');
        // Redirect to frontend home page
        res.redirect(process.env.FRONTEND_URL + '/?google_auth=success');
      });
    } catch (error) {
      console.error('❌ Google OAuth callback error:', error);
      res.redirect(process.env.FRONTEND_URL + '/?error=auth_error');
    }
  }
);

/**
 * POST /api/auth/google/token
 * Authenticate with Google ID token (alternative flow for client-side Google Sign-In)
 */
router.post('/google/token', async (req, res) => {
  try {
    const { credential } = req.body;
    
    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential token is required'
      });
    }

    // Verify the Google ID token
    const { OAuth2Client } = require('google-auth-library');
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    console.log('🔵 Google token verified for:', payload.email);
    
    // Check if user exists with this Google ID
    let user = await User.findOne({ googleId: payload.sub });
    
    if (user) {
      console.log('✅ Existing Google user found:', user.email);
    } else {
      // Check if user exists with this email
      user = await User.findOne({ email: payload.email });
      
      if (user) {
        // Link Google account to existing user
        console.log('🔗 Linking Google account to existing user:', user.email);
        user.googleId = payload.sub;
        user.provider = 'google';
        if (!user.photoURL && payload.picture) {
          user.photoURL = payload.picture;
        }
        await user.save();
      } else {
        // Create new user
        console.log('🆕 Creating new user with Google token');
        user = await User.create({
          email: payload.email,
          displayName: payload.name,
          googleId: payload.sub,
          provider: 'google',
          photoURL: payload.picture || '',
          isEmailVerified: payload.email_verified || true,
          role: 'user'
        });
        
        console.log('✅ New user created:', user.email);
      }
    }
    
    // Create session
    req.session.userId = user._id;
    req.session.userEmail = user.email;
    req.session.userName = user.displayName;
    
    // Return user data
    const userResponse = {
      id: user._id,
      email: user.email,
      displayName: user.displayName,
      phoneNumber: user.phoneNumber,
      photoURL: user.photoURL,
      role: user.role,
      isEmailVerified: user.isEmailVerified
    };
    
    res.json({
      success: true,
      message: 'Google authentication successful',
      user: userResponse
    });
  } catch (error) {
    console.error('❌ Google token authentication error:', error);
    res.status(401).json({
      success: false,
      message: 'Google authentication failed: ' + error.message
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

    // Password change is available for all users

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

// ==================== PASSWORD RESET ROUTES ====================

/**
 * POST /api/auth/forgot-password
 * Request password reset
 */
router.post('/forgot-password', passwordResetController.requestPasswordReset);

/**
 * POST /api/auth/reset-password
 * Reset password with token
 */
router.post('/reset-password', passwordResetController.resetPassword);

module.exports = router;
