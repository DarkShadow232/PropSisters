const mongoose = require('mongoose');
const User = require('../models/User');

// Connect to database
const path = require('path');
const fs = require('fs');

// Try to load .env file if it exists
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
} else {
  console.log('⚠️  No .env file found, using default MongoDB connection');
}

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const seedUsers = async () => {
  try {
    console.log('🌱 Starting user seed data creation...');

    // Clear existing users (except admin)
    await User.deleteMany({ role: { $ne: 'admin' } });
    console.log('✅ Cleared existing non-admin users');

    // Create sample users
    const sampleUsers = [
      {
        email: 'john.doe@example.com',
        password: 'password123',
        displayName: 'John Doe',
        phoneNumber: '+201234567890',
        role: 'user'
      },
      {
        email: 'jane.smith@example.com',
        password: 'password123',
        displayName: 'Jane Smith',
        phoneNumber: '+201234567891',
        role: 'user'
      },
      {
        email: 'mike.wilson@example.com',
        password: 'password123',
        displayName: 'Mike Wilson',
        phoneNumber: '+201234567892',
        role: 'user'
      },
      {
        email: 'sarah.jones@example.com',
        password: 'password123',
        displayName: 'Sarah Jones',
        phoneNumber: '+201234567893',
        role: 'user'
      },
      {
        email: 'david.brown@example.com',
        password: 'password123',
        displayName: 'David Brown',
        phoneNumber: '+201234567894',
        role: 'user'
      }
    ];

    console.log('Creating sample users...');
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`✓ Created user: ${userData.displayName} (${userData.email})`);
    }

    console.log('============================================================');
    console.log('USER SEEDING COMPLETE!');
    console.log('============================================================');
    console.log(`Total users created: ${sampleUsers.length}`);
    console.log('============================================================');
    console.log('NEXT STEPS:');
    console.log('============================================================');
    console.log('1. Run booking seeding: node utils/seedBookings.js');
    console.log('2. Test user login with any of the created users');
    console.log('============================================================');

  } catch (error) {
    console.error('❌ Error creating user seed data:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedUsers();
