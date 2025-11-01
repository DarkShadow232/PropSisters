const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const Admin = require('../models/Admin');

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, { id: user.id, type: user.constructor.modelName });
});

// Deserialize user from session
passport.deserializeUser(async (sessionData, done) => {
  try {
    let user;
    if (sessionData.type === 'User') {
      user = await User.findById(sessionData.id);
    } else if (sessionData.type === 'Admin') {
      user = await Admin.findById(sessionData.id);
    }
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Debug: Log OAuth configuration on startup
console.log('\n🔧 Passport Google OAuth Configuration:');
console.log('   Client ID:', process.env.GOOGLE_CLIENT_ID ? '✅ Loaded' : '❌ Missing');
console.log('   Client Secret:', process.env.GOOGLE_CLIENT_SECRET ? '✅ Loaded' : '❌ Missing');
console.log('   Callback URL:', `${process.env.API_URL}/api/auth/google/callback`);
console.log('   API URL:', process.env.API_URL);
console.log('');

// Google OAuth Strategy for Users (Frontend only)
passport.use('google-user', new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.API_URL}/api/auth/google/callback`,
  passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    console.log('🔵 Google OAuth User - Profile received:', profile.id);
    
    // Check if user exists with this Google ID
    let user = await User.findOne({ googleId: profile.id });
    
    if (user) {
      console.log('✅ Existing Google user found:', user.email);
      return done(null, user);
    }
    
    // Check if user exists with this email
    user = await User.findOne({ email: profile.emails[0].value });
    
    if (user) {
      // Link Google account to existing user
      console.log('🔗 Linking Google account to existing user:', user.email);
      user.googleId = profile.id;
      user.provider = 'google';
      if (!user.photoURL && profile.photos && profile.photos.length > 0) {
        user.photoURL = profile.photos[0].value;
      }
      await user.save();
      return done(null, user);
    }
    
    // Create new user
    console.log('🆕 Creating new user with Google OAuth');
    user = await User.create({
      email: profile.emails[0].value,
      displayName: profile.displayName,
      googleId: profile.id,
      provider: 'google',
      photoURL: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : '',
      isEmailVerified: true, // Google accounts are pre-verified
      role: 'user'
    });
    
    console.log('✅ New user created:', user.email);
    done(null, user);
  } catch (error) {
    console.error('❌ Google OAuth User error:', error);
    done(error, null);
  }
}));

module.exports = passport;

