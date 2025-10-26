module.exports = {
  async up(db) {
    console.log('Creating database indexes for performance optimization...');
    
    try {
      // Rental indexes
      await db.collection('rentals').createIndex({ priority: -1, createdAt: -1 });
      await db.collection('rentals').createIndex({ status: 1 });
      await db.collection('rentals').createIndex({ location: 'text', title: 'text' });
      console.log('✅ Rental indexes created');

      // Booking indexes
      await db.collection('bookings').createIndex({ userId: 1, createdAt: -1 });
      await db.collection('bookings').createIndex({ propertyId: 1 });
      await db.collection('bookings').createIndex({ bookingStatus: 1 });
      await db.collection('bookings').createIndex({ paymentStatus: 1 });
      await db.collection('bookings').createIndex({ checkIn: 1, checkOut: 1 });
      console.log('✅ Booking indexes created');

      // Payment indexes
      await db.collection('payments').createIndex({ bookingId: 1 });
      await db.collection('payments').createIndex({ userId: 1 });
      await db.collection('payments').createIndex({ status: 1 });
      console.log('✅ Payment indexes created');

      // User indexes
      await db.collection('users').createIndex({ email: 1 }, { unique: true });
      console.log('✅ User indexes created');

      // Request logs indexes
      await db.collection('requestlogs').createIndex({ timestamp: -1 });
      await db.collection('requestlogs').createIndex({ method: 1, path: 1 });
      await db.collection('requestlogs').createIndex({ statusCode: 1 });
      await db.collection('requestlogs').createIndex({ userId: 1 });
      await db.collection('requestlogs').createIndex({ ip: 1 });
      console.log('✅ Request logs indexes created');

      console.log('All database indexes created successfully');
    } catch (error) {
      console.error('Error creating indexes:', error);
      throw error;
    }
  },

  async down(db) {
    console.log('Removing database indexes...');
    
    try {
      await db.collection('rentals').dropIndexes();
      await db.collection('bookings').dropIndexes();
      await db.collection('payments').dropIndexes();
      await db.collection('users').dropIndexes();
      await db.collection('requestlogs').dropIndexes();
      console.log('All database indexes removed successfully');
    } catch (error) {
      console.error('Error removing indexes:', error);
      throw error;
    }
  }
};
