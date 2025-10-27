const mongoose = require('mongoose');
const FinishRequest = require('../models/FinishRequest');
const User = require('../models/User');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ MongoDB Connected');
  } catch (error) {
    console.error('✗ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

const sampleFinishRequests = [
  {
    userEmail: 'customer1@example.com',
    userName: 'Ahmed Hassan',
    requestType: 'renovation',
    propertyType: 'apartment',
    budget: '25k-50k',
    timeline: '2-3-months',
    description: 'I need to renovate my 2-bedroom apartment in New Cairo. Looking for modern design with high-quality materials.',
    location: 'New Cairo, Cairo',
    contactPhone: '+201234567890',
    countryCode: 'EG',
    status: 'pending',
    priority: 'medium'
  },
  {
    userEmail: 'customer2@example.com',
    userName: 'Fatma Mohamed',
    requestType: 'decoration',
    propertyType: 'villa',
    budget: '50k-100k',
    timeline: '1-month',
    description: 'Complete interior decoration for my new villa. I want a contemporary style with Egyptian touches.',
    location: '6th October City, Giza',
    contactPhone: '+201987654321',
    countryCode: 'EG',
    status: 'reviewed',
    priority: 'high'
  },
  {
    userEmail: 'customer3@example.com',
    userName: 'Omar Ali',
    requestType: 'furnishing',
    propertyType: 'apartment',
    budget: '10k-25k',
    timeline: 'asap',
    description: 'Furnishing a 1-bedroom apartment for rental. Need basic furniture and appliances.',
    location: 'Maadi, Cairo',
    contactPhone: '+201555123456',
    countryCode: 'EG',
    status: 'in-progress',
    priority: 'urgent'
  },
  {
    userEmail: 'customer4@example.com',
    userName: 'Nour Ibrahim',
    requestType: 'maintenance',
    propertyType: 'office',
    budget: 'under-10k',
    timeline: 'flexible',
    description: 'Office maintenance including painting, electrical fixes, and plumbing repairs.',
    location: 'Nasr City, Cairo',
    contactPhone: '+201777888999',
    countryCode: 'EG',
    status: 'completed',
    priority: 'low'
  },
  {
    userEmail: 'customer5@example.com',
    userName: 'Sarah Al-Rashid',
    requestType: 'renovation',
    propertyType: 'villa',
    budget: '100k-plus',
    timeline: '3-6-months',
    description: 'Complete villa renovation in Dubai Marina. Looking for luxury modern design.',
    location: 'Dubai Marina, UAE',
    contactPhone: '+971501234567',
    countryCode: 'AE',
    status: 'pending',
    priority: 'high'
  },
  {
    userEmail: 'customer6@example.com',
    userName: 'Mohammed Al-Saud',
    requestType: 'furnishing',
    propertyType: 'apartment',
    budget: '50k-100k',
    timeline: '1-month',
    description: 'Furnishing new apartment in Riyadh. Need contemporary Arabic style furniture.',
    location: 'Riyadh, Saudi Arabia',
    contactPhone: '+966501234567',
    countryCode: 'SA',
    status: 'reviewed',
    priority: 'medium'
  }
];

const seedFinishRequests = async () => {
  try {
    await connectDB();
    
    // Clear existing finish requests
    await FinishRequest.deleteMany({});
    console.log('✓ Cleared existing finish requests');
    
    // Get a user to associate with requests
    const user = await User.findOne();
    if (!user) {
      console.log('✗ No users found. Please seed users first.');
      return;
    }
    
    // Create finish requests
    const requests = await Promise.all(
      sampleFinishRequests.map(requestData => {
        return FinishRequest.create({
          ...requestData,
          userId: user._id
        });
      })
    );
    
    console.log(`✓ Created ${requests.length} finish requests`);
    console.log('Sample finish requests:');
    requests.forEach((request, index) => {
      console.log(`${index + 1}. ${request.userName} - ${request.requestType} (${request.status})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding finish requests:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedFinishRequests();
}

module.exports = seedFinishRequests;
