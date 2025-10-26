require('dotenv').config();

const config = {
  mongodb: {
    url: process.env.MONGODB_URI,
    options: {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      maxPoolSize: 10,
      retryWrites: true,
      tlsAllowInvalidCertificates: true,
      tlsAllowInvalidHostnames: true
    }
  },
  migrationsDir: "migrations",
  changelogCollectionName: "changelog",
  lockCollectionName: "changelog_lock",
  lockTtl: 0,
  migrationFileExtension: ".js",
  useFileHash: false,
  moduleSystem: 'commonjs'
};

module.exports = config;
