module.exports = {
  async up(db) {
    console.log('Adding priority and status fields to rentals...');
    await db.collection('rentals').updateMany(
      { $or: [{ priority: { $exists: false } }, { status: { $exists: false } }] },
      { $set: { priority: 0, status: 'active' } }
    );
    console.log('Priority and status fields added successfully');
  },

  async down(db) {
    console.log('Removing priority and status fields from rentals...');
    await db.collection('rentals').updateMany(
      {},
      { $unset: { priority: "", status: "" } }
    );
    console.log('Priority and status fields removed successfully');
  }
};
