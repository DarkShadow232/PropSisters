module.exports = {
  async up(db) {
    console.log('Adding calendar management fields to rentals...');
    await db.collection('rentals').updateMany(
      { calendar: { $exists: false } },
      { $set: { calendar: [], basePrice: 0, pricePerDate: {} } }
    );
    console.log('Calendar management fields added successfully');
  },

  async down(db) {
    console.log('Removing calendar management fields from rentals...');
    await db.collection('rentals').updateMany(
      {},
      { $unset: { calendar: "", basePrice: "", pricePerDate: "" } }
    );
    console.log('Calendar management fields removed successfully');
  }
};
