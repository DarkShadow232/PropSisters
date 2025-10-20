/**
 * MongoDB Connection Test Script
 * 
 * Run this script to verify your MongoDB connection before starting the application
 * 
 * Usage: node test-connection.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  console.log('\n====================================');
  console.log('🔍 MongoDB Connection Test');
  console.log('====================================\n');

  // Check if .env file exists
  if (!process.env.MONGODB_URI) {
    console.error('❌ ERROR: MONGODB_URI not found in environment variables');
    console.log('\n📝 Action required:');
    console.log('1. Create .env file: cp env.example .env');
    console.log('2. Edit .env and set MONGODB_URI\n');
    process.exit(1);
  }

  console.log('📍 Connection String:', process.env.MONGODB_URI.replace(/\/\/.*:.*@/, '//***:***@'));
  console.log('');

  try {
    console.log('⏳ Connecting to MongoDB...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000 // 5 second timeout
    });
    
    console.log('✅ MongoDB Connected Successfully!\n');
    console.log('📊 Connection Details:');
    console.log('   Database:', mongoose.connection.name);
    console.log('   Host:', mongoose.connection.host);
    console.log('   Port:', mongoose.connection.port);
    console.log('   Read State:', mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected');
    
    // List existing collections
    console.log('\n📚 Existing Collections:');
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log('   (No collections yet - they will be created when you add data)');
    } else {
      collections.forEach(coll => {
        console.log('   -', coll.name);
      });
    }

    // Test basic query
    console.log('\n🔍 Testing Query Capability...');
    await mongoose.connection.db.admin().ping();
    console.log('✅ Query test passed\n');

    console.log('====================================');
    console.log('✅ ALL TESTS PASSED');
    console.log('====================================\n');
    console.log('Your MongoDB connection is working correctly!');
    console.log('You can now run: npm start\n');
    
    await mongoose.connection.close();
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ CONNECTION FAILED\n');
    console.error('Error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('   → MongoDB is not running');
      console.log('   → Start MongoDB: mongod (or check MongoDB Atlas connection)');
    } else if (error.message.includes('Authentication failed')) {
      console.log('   → Check username/password in connection string');
      console.log('   → Verify database user permissions in MongoDB Atlas');
    } else if (error.message.includes('querySrv ENOTFOUND')) {
      console.log('   → DNS lookup failed for MongoDB Atlas');
      console.log('   → Check your internet connection');
      console.log('   → Verify MongoDB Atlas connection string');
    } else if (error.message.includes('connect ETIMEDOUT')) {
      console.log('   → Connection timed out');
      console.log('   → Check firewall settings');
      console.log('   → Verify IP whitelist in MongoDB Atlas (add 0.0.0.0/0 for testing)');
    } else {
      console.log('   → Check your MONGODB_URI in .env file');
      console.log('   → Ensure MongoDB is running');
    }
    
    console.log('\n📖 See ENVIRONMENT_SETUP.md for detailed instructions\n');
    
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});

// Run the test
testConnection();

