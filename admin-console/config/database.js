const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // No need for useNewUrlParser and useUnifiedTopology in MongoDB Driver 4.0+
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
    console.log(`✓ Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`✗ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

