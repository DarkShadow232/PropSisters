const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Try to load .env file if it exists
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
} else {
  console.log('⚠️  No .env file found, using default MongoDB connection');
}

const Rental = require('../models/Rental');

async function clearProperties() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rental-admin', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB successfully!');

    // Get count before deletion
    const count = await Rental.countDocuments();
    console.log(`Found ${count} properties in database`);

    if (count === 0) {
      console.log('Database is already empty. Nothing to clear.');
      return;
    }

    // Delete all properties
    console.log('\nDeleting all properties...');
    const result = await Rental.deleteMany({});
    console.log(`✓ Successfully deleted ${result.deletedCount} properties`);

    console.log('\n' + '='.repeat(60));
    console.log('DATABASE CLEARED!');
    console.log('='.repeat(60));
    console.log('You can now run: node utils/seedProperties.js');
    console.log('To add fresh property data.');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('Error clearing properties:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  }
}

// Run the clearing function
clearProperties();

