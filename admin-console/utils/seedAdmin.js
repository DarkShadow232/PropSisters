const mongoose = require('mongoose');
const readline = require('readline');
require('dotenv').config();

const Admin = require('../models/Admin');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Promisify readline question
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function seedAdmin() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rental-admin', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✓ Connected to MongoDB\n');

    // Get admin details from user
    console.log('╔═══════════════════════════════════════╗');
    console.log('║   Create Admin Account                ║');
    console.log('╚═══════════════════════════════════════╝\n');

    const name = await question('Enter admin name: ');
    const email = await question('Enter admin email: ');
    const password = await question('Enter admin password (min 6 characters): ');

    // Validate input
    if (!name || !email || !password) {
      console.error('\n✗ Error: All fields are required');
      process.exit(1);
    }

    if (password.length < 6) {
      console.error('\n✗ Error: Password must be at least 6 characters');
      process.exit(1);
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      console.log('\n⚠ Admin with this email already exists');
      const overwrite = await question('Do you want to update this account? (yes/no): ');
      
      if (overwrite.toLowerCase() === 'yes' || overwrite.toLowerCase() === 'y') {
        existingAdmin.name = name;
        existingAdmin.password = password; // Will be hashed by pre-save hook
        await existingAdmin.save();
        console.log('\n✓ Admin account updated successfully!');
      } else {
        console.log('\n✗ Operation cancelled');
      }
    } else {
      // Create new admin
      const admin = new Admin({
        name,
        email: email.toLowerCase(),
        password // Will be hashed by pre-save hook
      });

      await admin.save();
      console.log('\n✓ Admin account created successfully!');
    }

    console.log('\n╔═══════════════════════════════════════╗');
    console.log('║   Login Credentials                   ║');
    console.log('╚═══════════════════════════════════════╝');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('\n⚠ Please keep these credentials safe!\n');

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('\n✗ Error:', error.message);
    rl.close();
    process.exit(1);
  }
}

// Handle readline close
rl.on('close', () => {
  process.exit(0);
});

// Run seed function
seedAdmin();

