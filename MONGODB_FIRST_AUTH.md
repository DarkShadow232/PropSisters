# MongoDB-First Authentication Architecture

## 🎯 Overview

This application uses a **MongoDB-first authentication system** where:

- ✅ **Email/Password authentication**: Stored and validated in MongoDB
- ✅ **Google Sign-In**: Uses Firebase OAuth, but user data stored in MongoDB
- ✅ **All user data**: Centralized in MongoDB database
- ✅ **Firebase role**: Only for Google OAuth token verification

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  USER AUTHENTICATION                         │
└──────────────────┬─────────────────┬────────────────────────┘
                   │                 │
                   ▼                 ▼
    ┌──────────────────────┐  ┌──────────────────────┐
    │  EMAIL/PASSWORD      │  │   GOOGLE SIGN-IN     │
    │                      │  │                      │
    │  ✓ MongoDB only      │  │  ✓ Firebase OAuth   │
    │  ✓ Password hashed   │  │  ✓ Token verified   │
    │  ✓ Direct login      │  │  ✓ Data in MongoDB  │
    └──────────┬───────────┘  └──────────┬───────────┘
               │                         │
               │                         │
               ▼                         ▼
    ┌────────────────────────────────────────────────┐
    │                                                 │
    │          MONGODB USER COLLECTION                │
    │                                                 │
    │  {                                             │
    │    email: "user@example.com",                  │
    │    password: "hashed_password",  ← email users │
    │    googleId: "google_uid",       ← Google users│
    │    displayName: "John Doe",                    │
    │    authProvider: "email" | "google",           │
    │    role: "user",                                │
    │    ...                                          │
    │  }                                             │
    │                                                 │
    └────────────────────────────────────────────────┘
                           │
                           ▼
    ┌────────────────────────────────────────────────┐
    │           EXPRESS SESSION                       │
    │         (Stored in MongoDB)                     │
    └────────────────────────────────────────────────┘
```

## 📊 User Data Structure

### MongoDB User Schema

```javascript
{
  // Google OAuth (optional - only for Google users)
  googleId: String,              // Google user ID (unique)
  
  // Email/Password (required for email users)
  email: String,                 // User email (unique)
  password: String,              // Hashed password (null for Google users)
  
  // Profile Information
  displayName: String,           // Full name
  phoneNumber: String,           // Optional phone
  photoURL: String,              // Profile photo
  
  // Authentication
  authProvider: 'email' | 'google', // How user signed up
  role: 'user' | 'owner' | 'admin', // User role
  isEmailVerified: Boolean,      // Email verification status
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Authentication Flows

### Email/Password Registration

```
1. User fills signup form
   ↓
2. POST /api/auth/register
   {
     email: "user@example.com",
     password: "password123",
     displayName: "John Doe"
   }
   ↓
3. Backend validates data
   ↓
4. Password hashed with bcrypt
   ↓
5. User created in MongoDB
   {
     email: "user@example.com",
     password: "$2a$10$hashed...",
     displayName: "John Doe",
     authProvider: "email",
     role: "user"
   }
   ↓
6. Express session created
   ↓
7. User logged in
```

### Email/Password Login

```
1. User enters credentials
   ↓
2. POST /api/auth/login
   {
     email: "user@example.com",
     password: "password123"
   }
   ↓
3. Backend finds user by email
   ↓
4. Password compared with bcrypt
   ↓
5. If match: Session created
   ↓
6. User logged in
```

### Google Sign-In

```
1. User clicks "Sign in with Google"
   ↓
2. Firebase Google OAuth popup
   ↓
3. User authenticates with Google
   ↓
4. Firebase returns ID token
   ↓
5. Frontend sends token to backend
   POST /api/auth/google
   Headers: { Authorization: "Bearer <firebase_token>" }
   ↓
6. Backend verifies token with Firebase Admin
   ↓
7. Extract Google user info (uid, email, name, photo)
   ↓
8. Find or create user in MongoDB
   {
     googleId: "google_uid",
     email: "user@gmail.com",
     displayName: "John Doe",
     photoURL: "https://...",
     authProvider: "google",
     role: "user"
   }
   ↓
9. Express session created
   ↓
10. User logged in
```

## 🔑 Key Differences from Firebase-First

### Before (Firebase-First)
```
❌ User data split between Firebase and MongoDB
❌ Firebase for all authentication
❌ Complex sync logic
❌ Two sources of truth
```

### After (MongoDB-First)
```
✅ All user data in MongoDB
✅ Firebase only for Google OAuth
✅ Simple, direct authentication
✅ Single source of truth
✅ Better control over user data
```

## 📡 API Endpoints

### Email/Password Authentication

#### POST `/api/auth/register`
Register with email and password

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "displayName": "John Doe",
  "phoneNumber": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "displayName": "John Doe",
    "role": "user",
    "authProvider": "email"
  }
}
```

#### POST `/api/auth/login`
Login with email and password

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Logged in successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "displayName": "John Doe",
    "role": "user",
    "authProvider": "email"
  }
}
```

### Google Authentication

#### POST `/api/auth/google`
Authenticate with Google

**Headers:**
```
Authorization: Bearer <firebase_id_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Authenticated with Google successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@gmail.com",
    "displayName": "John Doe",
    "photoURL": "https://lh3.googleusercontent.com/...",
    "role": "user",
    "authProvider": "google"
  }
}
```

### Session Management

#### GET `/api/auth/verify`
Verify current session

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "displayName": "John Doe",
    "role": "user",
    "authProvider": "email"
  }
}
```

#### GET `/api/auth/me`
Get current user details

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "displayName": "John Doe",
    "phoneNumber": "+1234567890",
    "photoURL": "",
    "role": "user",
    "authProvider": "email",
    "isEmailVerified": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST `/api/auth/logout`
Logout current user

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Profile Management

#### PUT `/api/auth/profile`
Update user profile

**Request:**
```json
{
  "displayName": "Jane Doe",
  "phoneNumber": "+1234567890",
  "photoURL": "https://example.com/photo.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "displayName": "Jane Doe",
    "phoneNumber": "+1234567890",
    "role": "user"
  }
}
```

#### POST `/api/auth/change-password`
Change password (email/password users only)

**Request:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

## 🛡️ Security Features

### Password Security
- ✅ **Bcrypt hashing** - Industry standard, auto-salted
- ✅ **Password strength** - Minimum 8 characters required
- ✅ **No plain text storage** - Passwords always hashed
- ✅ **Secure comparison** - Constant-time comparison to prevent timing attacks

### Google OAuth Security
- ✅ **Token verification** - Firebase Admin SDK verifies all tokens server-side
- ✅ **Tokens can't be forged** - Cryptographic verification
- ✅ **Short-lived tokens** - ID tokens expire in 1 hour
- ✅ **Issuer validation** - Ensures token is from correct Firebase project

### Session Security
- ✅ **Session stored in MongoDB** - Not in memory or client
- ✅ **HTTP-only cookies** - Cannot be accessed by JavaScript
- ✅ **Secure cookies in production** - HTTPS only
- ✅ **Session expiration** - 7 days by default
- ✅ **CORS configured** - Only allowed origins can access

## 🔄 Migration from Old System

If you have existing users in Firebase/Firestore:

### Option 1: Manual Migration Script

```javascript
// migrate-users.js
const admin = require('firebase-admin');
const User = require('./models/User');

async function migrateUsers() {
  const firebaseUsers = await admin.auth().listUsers();
  
  for (const firebaseUser of firebaseUsers.users) {
    // Check if user already exists
    const existing = await User.findOne({ email: firebaseUser.email });
    if (existing) continue;
    
    // Create MongoDB user
    const user = new User({
      email: firebaseUser.email,
      displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
      photoURL: firebaseUser.photoURL || '',
      authProvider: 'email', // or 'google' based on provider
      role: 'user',
      isEmailVerified: firebaseUser.emailVerified,
      // No password - user will need to reset
    });
    
    await user.save();
    console.log(`Migrated: ${firebaseUser.email}`);
  }
}

migrateUsers();
```

### Option 2: Lazy Migration

Users automatically migrated on first Google sign-in (already implemented in `/api/auth/google` endpoint).

## 💡 Benefits

### For Development
- ✅ **Simpler** - One database to manage
- ✅ **More control** - Full access to user data
- ✅ **Easier queries** - Complex user queries possible
- ✅ **Better testing** - No external dependencies for email auth

### For Users
- ✅ **Faster** - No Firebase roundtrips for email/password
- ✅ **More options** - Can still use Google if preferred
- ✅ **Better privacy** - Data stored in your database

### For Production
- ✅ **Lower costs** - No Firebase Auth pricing
- ✅ **Better scalability** - Control your own infrastructure
- ✅ **Data ownership** - All data in your MongoDB
- ✅ **Compliance** - Easier to meet data residency requirements

## 🚀 Setup

### 1. Environment Variables

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/rental-db

# Session
SESSION_SECRET=your-secret-key-here

# Firebase (for Google Sign-In only)
FIREBASE_PROJECT_ID=proparty-sister

# Frontend
FRONTEND_URL=http://localhost:5173
```

### 2. Install Dependencies

```bash
cd admin-console
npm install bcryptjs
npm install firebase-admin
```

### 3. Test It

```bash
# Start backend
npm start

# Start frontend
npm run dev
```

### 4. Test Scenarios

1. **Register with email/password** - `http://localhost:5173/sign-up`
2. **Login with email/password** - `http://localhost:5173/sign-in`
3. **Sign in with Google** - Click Google button
4. **Verify in MongoDB** - Check users collection

```bash
mongosh
use rental-admin
db.users.find().pretty()
```

## 📋 Checklist

- [ ] User model updated with password field
- [ ] bcryptjs installed for password hashing
- [ ] Firebase Admin SDK installed (for Google only)
- [ ] Auth routes handle both email and Google
- [ ] Frontend updated to use MongoDB auth
- [ ] Environment variables configured
- [ ] Test email registration
- [ ] Test email login
- [ ] Test Google sign-in
- [ ] Verify users in MongoDB

## 🎉 Summary

**You now have:**
- ✅ MongoDB-first authentication
- ✅ Email/password stored in MongoDB
- ✅ Google OAuth via Firebase (data in MongoDB)
- ✅ Single source of truth (MongoDB)
- ✅ Full control over user data
- ✅ Better performance for email users
- ✅ Lower costs (no Firebase Auth pricing)

**Firebase is only used for:**
- 🔐 Google OAuth token verification
- That's it!

All user data, sessions, and password authentication happens in MongoDB! 🚀

