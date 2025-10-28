const User = require('../models/User');
const EmailService = require('../services/emailService');
const crypto = require('crypto');

const emailService = new EmailService();

/**
 * POST /api/auth/forgot-password
 * Request password reset
 */
exports.requestPasswordReset = async (req, res) => {
  try {
    console.log('🔍 Password reset request received:', {
      email: req.body.email,
      timestamp: new Date().toISOString()
    });

    const { email } = req.body;

    // Validate email
    if (!email) {
      console.log('❌ No email provided');
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find user by email (case-insensitive)
    console.log('🔍 Searching for user with email:', email.toLowerCase());
    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return success to prevent email enumeration attacks
    // Even if user doesn't exist, we return the same response
    if (!user) {
      console.log('❌ User not found for email:', email);
      return res.json({
        success: true,
        message: 'If an account with that email exists, we have sent a password reset link.'
      });
    }

    console.log('✅ User found:', {
      id: user._id,
      email: user.email,
      displayName: user.displayName
    });

    // Generate reset token
    console.log('🔑 Generating reset token...');
    const resetToken = user.generateResetToken();
    await user.save();
    
    console.log('✅ Reset token generated and saved:', {
      tokenLength: resetToken.length,
      expiresAt: new Date(user.resetPasswordExpires).toISOString()
    });

    // Send password reset email
    try {
      console.log('📧 Attempting to send password reset email...');
      await emailService.sendPasswordResetEmail(user, resetToken);
      
      console.log('✅ Password reset email sent successfully');
      res.json({
        success: true,
        message: 'If an account with that email exists, we have sent a password reset link.'
      });
    } catch (emailError) {
      console.error('❌ Error sending password reset email:', emailError);
      console.error('❌ Email error details:', {
        name: emailError.name,
        message: emailError.message,
        code: emailError.code
      });
      
      // Clear the reset token if email failed
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();
      
      res.status(500).json({
        success: false,
        message: 'Failed to send password reset email. Please try again later.'
      });
    }
  } catch (error) {
    console.error('Error in requestPasswordReset:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
};

/**
 * POST /api/auth/reset-password
 * Reset password with token
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Validate input
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required'
      });
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }

    // Hash the token to match stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid token and expiry
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({
      success: true,
      message: 'Password has been reset successfully. You can now sign in with your new password.'
    });
  } catch (error) {
    console.error('Error in resetPassword:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
};
