# Firebase Integration Setup for Backend

This guide explains how to set up Firebase Admin SDK in the Node.js backend to verify Firebase tokens from the React frontend.

## Prerequisites

- Firebase project (already set up in frontend)
- Node.js backend with MongoDB

## Installation

### 1. Install Firebase Admin SDK

```bash
cd admin-console
npm install firebase-admin
```

### 2. Get Firebase Service Account Key

#### Option A: Using Project ID Only (Simpler, for Development)

The backend is currently configured to work with just the project ID:

```env
# Add to admin-console/.env
FIREBASE_PROJECT_ID=proparty-sister
```

This method uses Application Default Credentials and works in most development environments.

#### Option B: Using Service Account JSON (Recommended for Production)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `proparty-sister`
3. Click on **Settings** (⚙️) → **Project Settings**
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Download the JSON file
7. Save it as `firebase-admin-key.json` in the `admin-console` directory
8. **IMPORTANT**: Add this file to `.gitignore`

```bash
# Add to admin-console/.gitignore
firebase-admin-key.json
```

### 3. Update Environment Variables

Add to `admin-console/.env`:

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=proparty-sister

# Optional: Path to service account key (for production)
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-admin-key.json
```

### 4. Initialize Firebase Admin in app.js

Update `admin-console/app.js` to initialize Firebase Admin:

```javascript
// Add this near the top of app.js, after requiring dotenv
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    // Production: Use service account key file
    const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID
    });
  } else {
    // Development: Use application default credentials
    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID
    });
  }
  console.log('✅ Firebase Admin initialized successfully');
} catch (error) {
  console.warn('⚠️  Firebase Admin initialization failed:', error.message);
  console.warn('   Frontend authentication will still work, but backend sync may fail');
}
```

## How It Works

### Authentication Flow

1. **User signs in on React frontend** (SignInPage.tsx)
   - Uses Firebase Authentication (Google or Email/Password)
   - Gets Firebase ID token

2. **Frontend sends token to backend** (via authService.ts)
   - Token included in `Authorization: Bearer <token>` header
   - Sent to `/api/auth/sync` or `/api/auth/register`

3. **Backend verifies token** (frontendAuthRoutes.js)
   - Firebase Admin SDK verifies the token
   - Extracts user information from token

4. **Backend creates/updates user in MongoDB**
   - Stores user with `firebaseUid` for linking
   - Creates Express session for backend routes

5. **User can now access both systems**
   - Frontend: Uses Firebase auth state
   - Backend: Uses Express sessions linked to Firebase UID

### API Endpoints

All routes are prefixed with `/api/auth`:

#### POST `/api/auth/register`
Register new user after Firebase signup
- **Auth**: Requires Firebase ID token
- **Body**: `{ firebaseUid, email, displayName, photoURL }`
- **Returns**: User object with MongoDB ID

#### POST `/api/auth/sync`
Sync existing Firebase user with backend (login)
- **Auth**: Requires Firebase ID token
- **Body**: `{ firebaseUid, email, displayName, photoURL }`
- **Returns**: User object with updated info

#### GET `/api/auth/verify`
Verify current session
- **Auth**: Express session
- **Returns**: Current user info

#### GET `/api/auth/me`
Get current user details
- **Auth**: Express session
- **Returns**: Full user object

#### POST `/api/auth/logout`
Destroy backend session
- **Auth**: Express session
- **Returns**: Success message

#### PUT `/api/auth/profile`
Update user profile
- **Auth**: Express session
- **Body**: `{ displayName?, photoURL? }`
- **Returns**: Updated user object

## Testing

### 1. Start Backend Server

```bash
cd admin-console
npm start
```

### 2. Start Frontend Server

```bash
# In root directory
npm run dev
```

### 3. Test Authentication

1. Go to `http://localhost:5173/sign-up`
2. Create account with email/password or Google
3. Check browser console for sync messages
4. Check backend terminal for user creation logs
5. Verify user exists in MongoDB:

```bash
mongosh
use rental-admin
db.users.find().pretty()
```

You should see a user with `firebaseUid` field.

## Database Schema

The User model now includes:

```javascript
{
  firebaseUid: String,      // Links to Firebase user
  email: String,            // User email
  displayName: String,      // Display name
  photoURL: String,         // Profile photo URL
  phoneNumber: String,      // Optional phone
  role: String,             // 'user' | 'owner' | 'admin'
  createdAt: Date,
  updatedAt: Date
}
```

## Troubleshooting

### "Firebase Admin not initialized"

**Cause**: Firebase Admin SDK failed to initialize

**Solutions**:
1. Check `FIREBASE_PROJECT_ID` in `.env`
2. Verify service account key path (if using)
3. Check permissions on service account key file
4. Frontend auth will still work, but backend sync will fail

### "Invalid or expired token"

**Cause**: Firebase ID token verification failed

**Solutions**:
1. Token may have expired (valid for 1 hour)
2. User needs to sign in again
3. Check clock sync on server
4. Verify project ID matches frontend config

### "User not synced with backend"

**Cause**: Backend sync failed during authentication

**Solutions**:
1. Check backend server is running
2. Verify CORS configuration in app.js
3. Check network tab for failed requests
4. Look for errors in backend logs

### CORS Errors

Make sure `admin-console/app.js` has proper CORS configuration:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',  // Vite dev server
    'http://localhost:8081',  // Alternative port
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true  // Important for sessions!
}));
```

## Security Best Practices

1. **Never commit service account keys** to Git
2. **Use environment variables** for sensitive data
3. **Verify tokens on every request** that needs authentication
4. **Use HTTPS in production**
5. **Set secure: true** for cookies in production
6. **Implement rate limiting** on auth endpoints
7. **Log authentication attempts** for security monitoring

## Production Deployment

### Environment Variables

Set these in your production environment:

```env
FIREBASE_PROJECT_ID=proparty-sister
FIREBASE_SERVICE_ACCOUNT_PATH=/path/to/service-account.json
FRONTEND_URL=https://yourdomain.com
SESSION_SECRET=your-super-secret-session-key
NODE_ENV=production
```

### Service Account Security

- Store service account key securely (e.g., AWS Secrets Manager, Azure Key Vault)
- Use IAM roles when deploying to cloud platforms
- Rotate keys regularly
- Limit permissions to minimum required

## Next Steps

1. ✅ Install Firebase Admin SDK
2. ✅ Configure environment variables
3. ✅ Initialize Firebase Admin in app.js
4. ✅ Test authentication flow
5. 🔄 Update frontend to use authService
6. 🔄 Test all auth endpoints
7. 🔄 Deploy to production

## Questions?

Check the following files for implementation details:

- **Backend Routes**: `admin-console/routes/frontendAuthRoutes.js`
- **Frontend Service**: `src/services/authService.ts`
- **Auth Context**: `src/contexts/AuthContext.tsx`
- **User Model**: `admin-console/models/User.js`

