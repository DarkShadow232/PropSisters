# Environment Setup Guide

## MongoDB & Environment Configuration

This guide will help you set up your environment and validate your MongoDB connection.

---

## 1. Environment Configuration

### ✅ .env File Created

Your `.env` file has been created with the following configuration:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/rental-admin
SESSION_SECRET=rental-admin-super-secret-key-change-this-in-production
```

### 🔧 Configuration Options

#### Local MongoDB (Recommended for Development)

```env
MONGODB_URI=mongodb://localhost:27017/rental-admin
```

- **Pros**: Fast, no internet required, full control
- **Cons**: Requires local MongoDB installation

#### MongoDB Atlas (Cloud)

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rental-admin?retryWrites=true&w=majority
```

- **Pros**: No installation, accessible anywhere, automatic backups
- **Cons**: Requires internet connection

### 🔐 Important Security Notes

**⚠️ NEVER commit `.env` to version control!**

The `.env` file is already in `.gitignore`, but make sure:

1. ✅ Change `SESSION_SECRET` to a random string in production
2. ✅ Use strong MongoDB credentials for production
3. ✅ Set `NODE_ENV=production` when deploying

---

## 2. MongoDB Installation

### Option A: Local MongoDB

#### Windows:
```powershell
# Download from https://www.mongodb.com/try/download/community
# Install and run MongoDB as a service
# Default connection: mongodb://localhost:27017
```

#### macOS:
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Verify
mongosh
```

#### Linux (Ubuntu):
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify
mongosh
```

### Option B: MongoDB Atlas (Cloud)

1. **Sign up**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Create Cluster**: Choose free tier (M0)
3. **Configure**:
   - Add database user (username & password)
   - Add IP address: `0.0.0.0/0` (allow from anywhere) for dev
4. **Get Connection String**:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
5. **Update .env**:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rental-admin
   ```

---

## 3. Test MongoDB Connection

### Quick Test Script

Create `admin-console/test-connection.js`:

```javascript
const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('URI:', process.env.MONGODB_URI);
    
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('✓ MongoDB Connected Successfully!');
    console.log('✓ Database:', mongoose.connection.name);
    console.log('✓ Host:', mongoose.connection.host);
    
    await mongoose.connection.close();
    console.log('✓ Connection closed');
    process.exit(0);
  } catch (error) {
    console.error('✗ Connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
```

Run it:
```bash
cd admin-console
node test-connection.js
```

Expected output:
```
Testing MongoDB connection...
URI: mongodb://localhost:27017/rental-admin
✓ MongoDB Connected Successfully!
✓ Database: rental-admin
✓ Host: localhost
✓ Connection closed
```

---

## 4. Validate Collections & Schemas

Your Mongoose models will automatically create collections when you first insert data.

### Collections Overview:

| Collection | Model File | Purpose |
|------------|-----------|---------|
| `admins` | `models/Admin.js` | Admin authentication |
| `rentals` | `models/Rental.js` | Property listings |
| `users` | `models/User.js` | Platform users |
| `bookings` | `models/Booking.js` | Property bookings |

### Verify Collections

After starting your app and creating some data, verify in MongoDB shell:

```bash
mongosh

use rental-admin

show collections
# Should show: admins, rentals, users, bookings

# View a sample document
db.rentals.findOne()
db.users.findOne()
db.bookings.findOne()
```

---

## 5. Create Sample Data (Optional)

### Create Sample Admin

Already included! Just run:
```bash
npm run seed
```

### Create Sample Rental Property

You can create through the admin console UI, or via MongoDB shell:

```javascript
use rental-admin

db.rentals.insertOne({
  title: "Luxury 2BR Apartment in Cairo",
  description: "Beautiful modern apartment with city views",
  location: "Cairo",
  address: "123 Tahrir Square, Cairo, Egypt",
  price: 150,
  bedrooms: 2,
  bathrooms: 2,
  amenities: ["WiFi", "Air Conditioning", "Kitchen"],
  images: [],
  ownerName: "Admin",
  ownerEmail: "admin@example.com",
  ownerPhone: "",
  availability: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### Create Sample User

```javascript
db.users.insertOne({
  email: "customer@example.com",
  displayName: "John Doe",
  phoneNumber: "+1234567890",
  role: "user",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### Create Sample Booking

```javascript
// First, get IDs of property and user
const property = db.rentals.findOne()
const user = db.users.findOne()

db.bookings.insertOne({
  propertyId: property._id,
  userId: user._id,
  checkIn: new Date('2024-02-01'),
  checkOut: new Date('2024-02-05'),
  guests: 2,
  totalPrice: 600,
  status: "confirmed",
  specialRequests: "",
  cleaningService: false,
  airportPickup: false,
  earlyCheckIn: false,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

---

## 6. Start the Application

```bash
cd admin-console

# Install dependencies (if not done)
npm install

# Create admin account
npm run seed

# Start server
npm start

# Or for development with auto-reload
npm run dev
```

Visit: **http://localhost:3000/auth/login**

---

## 7. Troubleshooting

### Issue: "Cannot connect to MongoDB"

**Solution 1: Local MongoDB not running**
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**Solution 2: Check connection string**
```bash
# Verify .env file exists
cat .env

# Should contain valid MONGODB_URI
```

**Solution 3: Test connection**
```bash
# Using mongosh
mongosh mongodb://localhost:27017/rental-admin

# Should connect without error
```

### Issue: "Authentication failed" (Atlas)

**Solution**: 
- Verify username/password in connection string
- Check IP whitelist in Atlas (add `0.0.0.0/0` for dev)
- Ensure database user has read/write permissions

### Issue: "Module not found"

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Port 3000 already in use"

**Solution**: Change port in `.env`:
```env
PORT=3001
```

---

## 8. MongoDB GUI Tools (Optional)

For easier database management, install a GUI:

### MongoDB Compass (Official)
- Download: https://www.mongodb.com/products/compass
- Visual interface for MongoDB
- Free and user-friendly

### Studio 3T
- Download: https://studio3t.com/
- Advanced features
- Free trial available

### Connect:
- Connection String: `mongodb://localhost:27017`
- Or paste your Atlas connection string

---

## 9. Database Backup

### Local MongoDB

```bash
# Backup
mongodump --db rental-admin --out ./backups

# Restore
mongorestore --db rental-admin ./backups/rental-admin
```

### MongoDB Atlas

- Automatic backups included in paid tiers
- Manual backup via `mongodump` with connection string

---

## 10. Production Checklist

Before deploying to production:

- [ ] Change `SESSION_SECRET` to a strong random string
- [ ] Set `NODE_ENV=production` in `.env`
- [ ] Use MongoDB Atlas (not local) for production
- [ ] Enable MongoDB authentication
- [ ] Whitelist only production server IPs in Atlas
- [ ] Use strong database passwords
- [ ] Enable SSL/TLS for MongoDB connection
- [ ] Set up regular database backups
- [ ] Monitor database performance
- [ ] Set up error logging (e.g., Sentry)

---

## ✅ Validation Checklist

Confirm everything is working:

- [ ] `.env` file created and configured
- [ ] MongoDB installed/configured (local or Atlas)
- [ ] Test connection script runs successfully
- [ ] Admin account created (`npm run seed`)
- [ ] Server starts without errors (`npm start`)
- [ ] Can login to admin console
- [ ] Dashboard loads with stats
- [ ] Can create a property
- [ ] Can upload images
- [ ] Can view users
- [ ] Can view bookings

---

## 🎉 You're Ready!

If all checks pass, your environment is fully configured and ready to use!

**Next Steps:**
1. Login to the admin console
2. Create your first property
3. Add some sample users
4. Create test bookings
5. Explore all features!

---

**Need Help?**
- Check `README.md` for full documentation
- Review `DATA_SCHEMA_REFERENCE.md` for schema details
- See `MONGODB_ONLY_UPDATE.md` for technical details

**Happy Managing! 🏠**

