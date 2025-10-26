const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('🔄 Testing database connection...');
    console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000
    });
    
    console.log('✅ MongoDB Connected:', conn.connection.host);
    console.log('✅ Database:', conn.connection.name);
    
    // Test basic operations
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('📋 Collections:', collections.map(c => c.name));
    
    await mongoose.disconnect();
    console.log('✅ Connection test successful!');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    process.exit(1);
  }
}

testConnection();
