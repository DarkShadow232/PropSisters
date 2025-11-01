/**
 * Google OAuth Configuration Test Script
 * Run this to verify your Google OAuth setup
 */

require('dotenv').config({ path: './.env' });

console.log('\n' + '='.repeat(60));
console.log('🔍 GOOGLE OAUTH CONFIGURATION DEBUG');
console.log('='.repeat(60) + '\n');

// Check environment variables
console.log('📋 Environment Variables:');
console.log('   NODE_ENV:', process.env.NODE_ENV);
console.log('   PORT:', process.env.PORT);
console.log('   API_URL:', process.env.API_URL);
console.log('   FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('\n');

console.log('🔑 Google OAuth Credentials:');
console.log('   GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✅ SET' : '❌ NOT SET');
if (process.env.GOOGLE_CLIENT_ID) {
  console.log('      Value:', process.env.GOOGLE_CLIENT_ID);
  console.log('      Length:', process.env.GOOGLE_CLIENT_ID.length, 'characters');
}

console.log('   GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '✅ SET' : '❌ NOT SET');
if (process.env.GOOGLE_CLIENT_SECRET) {
  console.log('      Value:', process.env.GOOGLE_CLIENT_SECRET.substring(0, 10) + '...' + process.env.GOOGLE_CLIENT_SECRET.slice(-5));
  console.log('      Length:', process.env.GOOGLE_CLIENT_SECRET.length, 'characters');
}
console.log('\n');

// Construct callback URLs
console.log('🔗 Callback URLs:');
const callbackURL = `${process.env.API_URL}/api/auth/google/callback`;
console.log('   Constructed Callback:', callbackURL);
console.log('   Google Console Should Match:', 'https://api.propsiss.com/api/auth/google/callback');
console.log('   Match:', callbackURL === 'https://api.propsiss.com/api/auth/google/callback' ? '✅ YES' : '❌ NO');
console.log('\n');

// Check OAuth initiation URL
console.log('🚀 OAuth Initiation URL:');
const initiateURL = `${process.env.API_URL}/api/auth/google`;
console.log('   Frontend should redirect to:', initiateURL);
console.log('\n');

// Validation
console.log('✔️  Validation:');
let allGood = true;

if (!process.env.GOOGLE_CLIENT_ID) {
  console.log('   ❌ GOOGLE_CLIENT_ID is missing!');
  allGood = false;
} else if (!process.env.GOOGLE_CLIENT_ID.includes('apps.googleusercontent.com')) {
  console.log('   ⚠️  GOOGLE_CLIENT_ID format looks incorrect');
  allGood = false;
} else {
  console.log('   ✅ GOOGLE_CLIENT_ID is valid');
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
  console.log('   ❌ GOOGLE_CLIENT_SECRET is missing!');
  allGood = false;
} else if (!process.env.GOOGLE_CLIENT_SECRET.startsWith('GOCSPX-')) {
  console.log('   ⚠️  GOOGLE_CLIENT_SECRET format looks incorrect');
  allGood = false;
} else {
  console.log('   ✅ GOOGLE_CLIENT_SECRET is valid');
}

if (!process.env.API_URL) {
  console.log('   ❌ API_URL is missing!');
  allGood = false;
} else {
  console.log('   ✅ API_URL is set');
}

console.log('\n');

if (allGood) {
  console.log('🎉 All configuration looks good!');
  console.log('\n📝 Next steps:');
  console.log('   1. Make sure Google Cloud Console has this redirect URI:');
  console.log('      → ' + callbackURL);
  console.log('   2. Save changes in Google Cloud Console');
  console.log('   3. Wait 2-3 minutes for propagation');
  console.log('   4. Restart your server: npm start');
  console.log('   5. Test from frontend by clicking "Continue with Google"');
} else {
  console.log('❌ Configuration has issues - please fix the errors above');
}

console.log('\n' + '='.repeat(60) + '\n');

