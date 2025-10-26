module.exports = {
  async up(db) {
    console.log('Adding Paymob integration fields to bookings...');
    await db.collection('bookings').updateMany(
      { paymentStatus: { $exists: false } },
      { 
        $set: { 
          paymentStatus: 'pending',
          paymobData: {},
          totalAmount: 0,
          currency: 'EGP',
          bookingStatus: 'pending',
          emailSent: false,
          cancellationPolicy: { canCancel: true, refundPercentage: 100 }
        } 
      }
    );
    console.log('Paymob integration fields added successfully');
  },

  async down(db) {
    console.log('Removing Paymob integration fields from bookings...');
    await db.collection('bookings').updateMany(
      {},
      { $unset: { paymentStatus: "", paymobData: "", totalAmount: "", currency: "", bookingStatus: "", emailSent: "", cancellationPolicy: "" } }
    );
    console.log('Paymob integration fields removed successfully');
  }
};
