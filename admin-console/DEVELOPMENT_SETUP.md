# Development Setup Guide

## MongoDB Connection Issues

The SSL/TLS error you're encountering is a known issue with Node.js, OpenSSL, and MongoDB Atlas on Windows environments.

## Solutions

### Option 1: Use MongoDB Atlas with Connection String Fix

Update your `.env` file with this connection string format:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/propsisters?retryWrites=true&w=majority&ssl=true&authSource=admin&sslValidate=false
```

### Option 2: Install Local MongoDB (Recommended)

1. **Download MongoDB Community Server**:
   - Go to https://www.mongodb.com/try/download/community
   - Download Windows version
   - Install with default settings

2. **Start MongoDB Service**:
   ```bash
   # Start MongoDB service
   net start MongoDB
   
   # Or start manually
   mongod --dbpath C:\data\db
   ```

3. **Update .env for Local Development**:
   ```env
   MONGODB_URI=mongodb://localhost:27017/propsisters
   ```

### Option 3: Use MongoDB Atlas with Different Connection Method

Try using the legacy connection string format:
```env
MONGODB_URI=mongodb://username:password@cluster-shard-00-00.mongodb.net:27017,cluster-shard-00-01.mongodb.net:27017,cluster-shard-00-02.mongodb.net:27017/propsisters?ssl=true&replicaSet=atlas-xxxxx-shard-0&authSource=admin&retryWrites=true&w=majority
```

### Option 4: Docker MongoDB (Alternative)

If you have Docker installed:
```bash
# Run MongoDB in Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Update .env
MONGODB_URI=mongodb://localhost:27017/propsisters
```

## Testing the Connection

Once you have a working MongoDB connection:

```bash
# Test migration status
npm run migrate:status

# Run migrations
npm run migrate:up

# Check what was migrated
npm run migrate:status
```

## Why This Happens

1. **SSL/TLS Version Mismatch**: Node.js OpenSSL vs MongoDB Atlas TLS requirements
2. **Windows Environment**: Known compatibility issues
3. **Network Configuration**: Corporate firewalls or proxy servers
4. **MongoDB Driver Version**: Version compatibility with Atlas

## Recommended Approach

For development, use **Option 2 (Local MongoDB)** as it:
- Eliminates SSL issues
- Provides faster development
- No network dependencies
- Full control over database

For production, use MongoDB Atlas with proper SSL configuration.
