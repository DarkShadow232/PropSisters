const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Rental = require('../models/Rental');
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

const seedBookings = async () => {
  try {
    console.log('🌱 Starting booking seed data creation...');

    // Clear existing bookings
    await Booking.deleteMany({});
    console.log('✅ Cleared existing bookings');

    // Get sample properties and users
    const properties = await Rental.find().limit(5);
    const users = await User.find().limit(3);

    if (properties.length === 0) {
      console.log('❌ No properties found. Please seed properties first.');
      return;
    }

    if (users.length === 0) {
      console.log('❌ No users found. Please seed users first.');
      return;
    }

    const sampleBookings = [
      {
        propertyId: properties[0]._id,
        userId: users[0]._id,
        checkIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        checkOut: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        guests: 2,
        totalPrice: 1500,
        totalAmount: 1500,
        currency: 'EGP',
        bookingStatus: 'confirmed',
        paymentStatus: 'paid',
        confirmationCode: 'BK001',
        specialRequests: 'Late check-in requested',
        cleaningService: true,
        airportPickup: false,
        earlyCheckIn: true,
        paymobData: {
          transactionId: 'TXN001',
          orderId: 'ORD001',
          paymentKey: 'PK001',
          paymentToken: 'TOKEN001',
          hmac: 'HMAC001'
        },
        emailSent: true,
        emailSentAt: new Date()
      },
      {
        propertyId: properties[1]._id,
        userId: users[1]._id,
        checkIn: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        checkOut: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000), // 17 days from now
        guests: 4,
        totalPrice: 2000,
        totalAmount: 2000,
        currency: 'EGP',
        bookingStatus: 'pending',
        paymentStatus: 'pending',
        confirmationCode: 'BK002',
        specialRequests: 'Need extra towels',
        cleaningService: false,
        airportPickup: true,
        earlyCheckIn: false,
        paymobData: {
          orderId: 'ORD002',
          paymentKey: 'PK002',
          paymentToken: 'TOKEN002'
        },
        emailSent: false
      },
      {
        propertyId: properties[2]._id,
        userId: users[2]._id,
        checkIn: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        checkOut: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        guests: 1,
        totalPrice: 800,
        totalAmount: 800,
        currency: 'EGP',
        bookingStatus: 'completed',
        paymentStatus: 'paid',
        confirmationCode: 'BK003',
        specialRequests: '',
        cleaningService: false,
        airportPickup: false,
        earlyCheckIn: false,
        paymobData: {
          transactionId: 'TXN003',
          orderId: 'ORD003',
          paymentKey: 'PK003',
          paymentToken: 'TOKEN003',
          hmac: 'HMAC003'
        },
        emailSent: true,
        emailSentAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        propertyId: properties[0]._id,
        userId: users[0]._id,
        checkIn: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        checkOut: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000), // 35 days from now
        guests: 3,
        totalPrice: 2500,
        totalAmount: 2500,
        currency: 'EGP',
        bookingStatus: 'cancelled',
        paymentStatus: 'refunded',
        confirmationCode: 'BK004',
        specialRequests: 'Cancelled due to travel restrictions',
        cleaningService: true,
        airportPickup: true,
        earlyCheckIn: true,
        paymobData: {
          transactionId: 'TXN004',
          orderId: 'ORD004',
          paymentKey: 'PK004',
          paymentToken: 'TOKEN004',
          hmac: 'HMAC004'
        },
        emailSent: true,
        emailSentAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        cancellationPolicy: {
          canCancel: true,
          refundPercentage: 75,
          cancelledAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
          cancellationReason: 'Travel restrictions'
        }
      },
      {
        propertyId: properties[3]._id,
        userId: users[1]._id,
        checkIn: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
        checkOut: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
        guests: 2,
        totalPrice: 1200,
        totalAmount: 1200,
        currency: 'EGP',
        bookingStatus: 'active',
        paymentStatus: 'paid',
        confirmationCode: 'BK005',
        specialRequests: 'Anniversary celebration',
        cleaningService: true,
        airportPickup: false,
        earlyCheckIn: true,
        paymobData: {
          transactionId: 'TXN005',
          orderId: 'ORD005',
          paymentKey: 'PK005',
          paymentToken: 'TOKEN005',
          hmac: 'HMAC005'
        },
        emailSent: true,
        emailSentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        propertyId: properties[4]._id,
        userId: users[2]._id,
        checkIn: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
        checkOut: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000), // 24 days from now
        guests: 6,
        totalPrice: 3000,
        totalAmount: 3000,
        currency: 'EGP',
        bookingStatus: 'confirmed',
        paymentStatus: 'paid',
        confirmationCode: 'BK006',
        specialRequests: 'Family reunion - need extra beds',
        cleaningService: true,
        airportPickup: true,
        earlyCheckIn: false,
        paymobData: {
          transactionId: 'TXN006',
          orderId: 'ORD006',
          paymentKey: 'PK006',
          paymentToken: 'TOKEN006',
          hmac: 'HMAC006'
        },
        emailSent: true,
        emailSentAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)
      }
    ];

    // Create bookings
    for (const bookingData of sampleBookings) {
      const booking = new Booking(bookingData);
      await booking.save();
      console.log(`✅ Created booking ${booking.confirmationCode} for ${booking.guests} guests`);
    }

    console.log('🎉 Booking seed data created successfully!');
    console.log(`📊 Created ${sampleBookings.length} sample bookings with various statuses:`);
    console.log('   - 1 Confirmed booking (paid)');
    console.log('   - 1 Pending booking (payment pending)');
    console.log('   - 1 Completed booking');
    console.log('   - 1 Cancelled booking (refunded)');
    console.log('   - 1 Active booking (current)');
    console.log('   - 1 Confirmed booking (future)');

  } catch (error) {
    console.error('❌ Error creating booking seed data:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run if called directly
if (require.main === module) {
  seedBookings();
}

module.exports = seedBookings;
