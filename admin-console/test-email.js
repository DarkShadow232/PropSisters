const EmailService = require('./services/emailService');
require('dotenv').config();

async function testEmailConfiguration() {
  console.log('🧪 Testing Email Configuration...\n');
  
  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log('  EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ Not set');
  console.log('  EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✅ Set' : '❌ Not set');
  console.log('  ADMIN_EMAIL:', process.env.ADMIN_EMAIL ? '✅ Set' : '❌ Not set');
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log('\n❌ Email configuration is incomplete!');
    console.log('Please set the following environment variables in your .env file:');
    console.log('  EMAIL_USER=your_gmail@gmail.com');
    console.log('  EMAIL_PASSWORD=your_app_password');
    console.log('  ADMIN_EMAIL=admin@propsisters.com');
    return;
  }
  
  try {
    const emailService = new EmailService();
    
    console.log('\n🔧 Testing email configuration...');
    const isValid = await emailService.testEmailConfiguration();
    
    if (isValid) {
      console.log('✅ Email configuration is working!');
      
      // Test sending a password reset email
      console.log('\n📧 Testing password reset email...');
      const testUser = {
        email: process.env.EMAIL_USER, // Send to yourself for testing
        displayName: 'Test User'
      };
      const testToken = 'test-token-123456789';
      
      try {
        await emailService.sendPasswordResetEmail(testUser, testToken);
        console.log('✅ Test email sent successfully!');
        console.log('Check your inbox for the test email.');
      } catch (emailError) {
        console.log('❌ Failed to send test email:', emailError.message);
      }
    } else {
      console.log('❌ Email configuration is invalid!');
    }
  } catch (error) {
    console.log('❌ Error testing email configuration:', error.message);
  }
}

testEmailConfiguration();
