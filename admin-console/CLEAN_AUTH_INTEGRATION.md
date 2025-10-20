# Clean Authentication Integration Guide

This document explains how the React frontend authentication (Firebase) is cleanly integrated with the Node.js backend (MongoDB + Express Sessions).

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER SIGNS IN                            │
│                   (SignInPage.tsx/SignUpPage.tsx)               │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FIREBASE AUTHENTICATION                       │
│              (Google Sign-In / Email+Password)                   │
│                                                                  │
│  • User authenticates with Firebase                             │
│  • Firebase returns ID token                                    │
│  • User object stored in Firestore                             │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AUTH CONTEXT                                │
│                   (AuthContext.tsx)                              │
│                                                                  │
│  • Listens to Firebase auth state                              │
│  • Automatically syncs with backend on sign-in                  │
│  • Manages user state globally                                  │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                     AUTH SERVICE                                 │
│                  (authService.ts)                                │
│                                                                  │
│  • Gets Firebase ID token                                       │
│  • Sends to backend: POST /api/auth/sync                       │
│  • Includes Authorization header                                │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                  BACKEND AUTH ROUTES                             │
│             (frontendAuthRoutes.js)                              │
│                                                                  │
│  • Verifies Firebase ID token using Firebase Admin SDK         │
│  • Extracts user info from token                                │
│  • Creates/updates user in MongoDB                              │
│  • Creates Express session                                       │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MONGODB USER                                │
│                    (User Model)                                  │
│                                                                  │
│  {                                                               │
│    firebaseUid: "abc123...",  ← Links to Firebase              │
│    email: "user@example.com",                                   │
│    displayName: "John Doe",                                     │
│    role: "user",                                                │
│    ...                                                           │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
```

## File Structure

### Frontend Files

```
src/
├── pages/
│   ├── SignInPage.tsx           ← Sign in UI
│   ├── SignUpPage.tsx           ← Sign up UI
│   └── ...
├── contexts/
│   └── AuthContext.tsx          ← Global auth state management
├── services/
│   └── authService.ts           ← Backend sync service (NEW)
└── lib/
    └── firebase.ts              ← Firebase configuration
```

### Backend Files

```
admin-console/
├── routes/
│   ├── authRoutes.js            ← Admin console login (EJS views)
│   ├── frontendAuthRoutes.js    ← Frontend auth sync (NEW)
│   ├── apiRoutes.js             ← Main API router (UPDATED)
│   ├── propertyRoutes.js        ← Property CRUD (SEPARATED)
│   ├── userRoutes.js            ← User management (SEPARATED)
│   ├── bookingRoutes.js         ← Booking management (SEPARATED)
│   └── dashboardRoutes.js       ← Dashboard stats (SEPARATED)
├── models/
│   └── User.js                  ← User model (UPDATED with firebaseUid)
└── controllers/
    └── authController.js        ← Admin login controller
```

## Key Components Explained

### 1. SignInPage.tsx & SignUpPage.tsx

**Purpose**: User-facing authentication forms

**Features**:
- Email/password authentication
- Google sign-in
- Form validation
- Error handling
- Loading states
- Auto-redirect when authenticated

**Flow**:
1. User enters credentials
2. Calls `signIn()` or `signUp()` from AuthContext
3. Firebase authenticates user
4. AuthContext automatically syncs with backend
5. User redirected to dashboard

### 2. AuthContext.tsx

**Purpose**: Global authentication state manager

**Features**:
- Listens to Firebase auth state changes
- Provides auth functions to entire app
- Manages user role
- **NEW**: Automatically syncs with backend MongoDB

**Key Addition**:
```typescript
// Inside onAuthStateChanged
if (user) {
  // Sync user with backend MongoDB
  try {
    await authService.syncUserWithBackend(user);
  } catch (error) {
    console.error('Failed to sync with backend:', error);
  }
}
```

### 3. authService.ts (NEW)

**Purpose**: Bridge between Firebase and Backend

**Key Methods**:

#### `syncUserWithBackend(firebaseUser)`
- Called automatically after Firebase sign-in
- Sends user info to backend
- Creates/updates MongoDB user record
- Establishes Express session

#### `signOutBackend()`
- Called during sign-out
- Destroys Express session
- Completes full logout

**Example Usage**:
```typescript
const authService = new AuthService();
await authService.syncUserWithBackend(firebaseUser);
```

### 4. frontendAuthRoutes.js (NEW)

**Purpose**: Backend routes for frontend authentication

**Key Routes**:

#### `POST /api/auth/sync`
```javascript
// Verifies Firebase token
// Creates/updates user in MongoDB
// Returns user data
```

#### `POST /api/auth/register`
```javascript
// Registers new user
// Similar to sync but for initial signup
```

#### `GET /api/auth/verify`
```javascript
// Checks if session is valid
// Returns current user
```

#### `POST /api/auth/logout`
```javascript
// Destroys Express session
```

**Security**: All routes verify Firebase ID token using Firebase Admin SDK

### 5. User Model (UPDATED)

**Purpose**: MongoDB schema for users

**New Fields**:
```javascript
{
  firebaseUid: String,  // Links to Firebase user
  photoURL: String,     // Profile photo from Google/Firebase
  // ... existing fields
}
```

**Index**: `firebaseUid` is indexed and unique for fast lookups

## Authentication Flow

### Sign Up Flow

```
1. User fills signup form (SignUpPage.tsx)
   ↓
2. Click "Create Account"
   ↓
3. signUp(email, password) called
   ↓
4. Firebase creates user account
   ↓
5. AuthContext detects new user
   ↓
6. authService.syncUserWithBackend() called
   ↓
7. POST /api/auth/sync with Firebase token
   ↓
8. Backend verifies token
   ↓
9. User created in MongoDB
   ↓
10. Express session created
    ↓
11. User redirected to dashboard
```

### Sign In Flow

```
1. User enters credentials (SignInPage.tsx)
   ↓
2. Click "Sign In"
   ↓
3. signIn(email, password) called
   ↓
4. Firebase authenticates user
   ↓
5. AuthContext detects auth state change
   ↓
6. authService.syncUserWithBackend() called
   ↓
7. POST /api/auth/sync with Firebase token
   ↓
8. Backend verifies token
   ↓
9. User found/updated in MongoDB
   ↓
10. Express session created
    ↓
11. User redirected to dashboard
```

### Sign Out Flow

```
1. User clicks "Sign Out"
   ↓
2. signOut() called
   ↓
3. authService.signOutBackend() called
   ↓
4. POST /api/auth/logout
   ↓
5. Express session destroyed
   ↓
6. Firebase sign out
   ↓
7. AuthContext clears state
   ↓
8. User redirected to sign-in page
```

## API Endpoints

### Frontend Authentication API

Base URL: `http://localhost:3000/api/auth`

#### POST `/api/auth/sync`
Sync Firebase user with MongoDB

**Request**:
```json
{
  "firebaseUid": "abc123...",
  "email": "user@example.com",
  "displayName": "John Doe",
  "photoURL": "https://..."
}
```

**Headers**:
```
Authorization: Bearer <firebase-id-token>
```

**Response**:
```json
{
  "success": true,
  "message": "User synced successfully",
  "user": {
    "id": "mongo-id",
    "email": "user@example.com",
    "displayName": "John Doe",
    "role": "user"
  }
}
```

#### POST `/api/auth/register`
Same as sync, but for initial signup

#### GET `/api/auth/verify`
Verify current session

**Response**:
```json
{
  "success": true,
  "user": {
    "id": "mongo-id",
    "email": "user@example.com",
    "displayName": "John Doe",
    "role": "user"
  }
}
```

#### POST `/api/auth/logout`
Destroy session

**Response**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Session Management

### Frontend
- Firebase manages authentication state
- ID tokens refresh automatically
- Persists across page reloads

### Backend
- Express sessions stored in MongoDB
- Session linked to user via `firebaseUid`
- Expires after 7 days (configurable)

### Session Data Structure
```javascript
{
  userId: "mongo-user-id",
  userEmail: "user@example.com",
  userName: "John Doe",
  firebaseUid: "firebase-uid"
}
```

## Two Authentication Systems

### Admin Console (Traditional)
- Route: `/auth/login`
- Uses: Email + Password (MongoDB)
- Session: Express sessions
- Model: Admin model
- Purpose: Admin panel access

### Frontend Users (Firebase)
- Route: `/sign-in`, `/sign-up`
- Uses: Firebase Auth (Google, Email)
- Session: Firebase + Express (synced)
- Model: User model
- Purpose: Public-facing app

## Benefits of This Architecture

### ✅ Separation of Concerns
- Frontend auth logic in Firebase
- Backend business logic in Node.js
- Clean API boundaries

### ✅ Best of Both Worlds
- Firebase: Social auth, security, scalability
- MongoDB: Custom user data, complex queries
- Express: Traditional session management

### ✅ Maintainability
- Each entity in separate file
- Clear responsibilities
- Easy to test and debug

### ✅ Scalability
- Firebase handles auth load
- MongoDB handles data queries
- Can scale independently

### ✅ Security
- Firebase tokens verified server-side
- Sessions stored securely
- CORS properly configured
- Credentials never exposed

## Configuration Checklist

### Frontend (src/)
- [x] Firebase config in `lib/firebase.ts`
- [x] AuthContext provider in `App.tsx`
- [x] Sign-in/up pages created
- [x] authService integrated
- [x] API URL configured (`VITE_API_URL`)

### Backend (admin-console/)
- [x] Firebase Admin SDK installed
- [x] Firebase initialized in `app.js`
- [x] User model updated with `firebaseUid`
- [x] Frontend auth routes created
- [x] Routes mounted in `apiRoutes.js`
- [x] CORS configured for frontend
- [x] Environment variables set

## Testing Checklist

- [ ] User can sign up with email/password
- [ ] User can sign up with Google
- [ ] User can sign in with email/password
- [ ] User can sign in with Google
- [ ] User data syncs to MongoDB
- [ ] Session persists across page reloads
- [ ] User can sign out completely
- [ ] Error messages display correctly
- [ ] Loading states work properly
- [ ] Protected routes redirect to sign-in

## Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
```

### Backend (admin-console/.env)
```env
FIREBASE_PROJECT_ID=proparty-sister
MONGODB_URI=mongodb://localhost:27017/rental-admin
SESSION_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

## Common Issues & Solutions

### Issue: "Failed to sync with backend"
**Solution**: Check if backend server is running on port 3000

### Issue: "CORS error"
**Solution**: Verify CORS origin includes frontend URL

### Issue: "Invalid token"
**Solution**: Firebase token expired, user needs to sign in again

### Issue: "User not found in MongoDB"
**Solution**: Sync may have failed, check backend logs

## Next Steps

1. Install Firebase Admin SDK: `npm install firebase-admin`
2. Update `app.js` with Firebase initialization
3. Test authentication flow end-to-end
4. Deploy to production with proper env vars

## Documentation References

- [Firebase Integration Setup](./FIREBASE_INTEGRATION_SETUP.md)
- [Routes Structure](./routes/ROUTES_STRUCTURE.md)
- [API Documentation](./API_DOCUMENTATION.md)

