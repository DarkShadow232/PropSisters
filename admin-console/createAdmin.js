const mongoose = require('mongoose');
require('dotenv').config();

const Admin = require('./models/Admin');

async function createDefaultAdmin() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rental-admin', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✓ Connected to MongoDB\n');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@propsiss.com' });
    if (existingAdmin) {
      console.log('✓ Admin account already exists');
      console.log('Email: admin@propsiss.com');
      console.log('Password: admin123');
      process.exit(0);
    }

    // Create default admin
    const admin = new Admin({
      name: 'Admin User',
      email: 'admin@propsiss.com',
      password: 'admin123'
    });

    await admin.save();
    console.log('✓ Default admin account created successfully!');
    console.log('\n╔═══════════════════════════════════════╗');
    console.log('║   Default Login Credentials           ║');
    console.log('╚═══════════════════════════════════════╝');
    console.log('Email: admin@propsiss.com');
    console.log('Password: admin123');
    console.log('\n⚠ Please change these credentials after first login!\n');

    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

createDefaultAdmin();
