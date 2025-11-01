# Google OAuth Implementation Guide

This guide explains how Google Sign-In has been implemented for the frontend users.

## Overview

Google OAuth 2.0 authentication has been integrated to allow **frontend users only** to sign in using their Google accounts. Admin console uses traditional email/password authentication only.

The implementation uses:
- **Backend**: Passport.js with `passport-google-oauth20` strategy
- **Frontend**: Custom OAuth redirect flow (no client-side libraries needed)

## Backend Configuration

### 1. Environment Variables

The following environment variables have been added to `admin-console/config.env`:

```env
GOOGLE_CLIENT_ID=1001459678459-n4etc0698frf18vgijus2msb080kb4m5.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
```

### 2. Database Models

Both `User` and `Admin` models have been updated to support Google OAuth:

**New Fields:**
- `googleId`: Unique Google user ID
- `provider`: Authentication provider ('local' or 'google')
- `password`: Now optional for OAuth users

### 3. Passport Configuration

Location: `admin-console/config/passport.js`

One strategy is configured:
- **google-user**: For frontend users only (redirects to `/api/auth/google/callback`)

### 4. Routes

#### Frontend API Routes (`/api/auth/*`)
- `GET /api/auth/google` - Initiates Google OAuth flow for users
- `GET /api/auth/google/callback` - Handles OAuth callback for users
- `POST /api/auth/google/token` - Alternative endpoint for client-side Google token verification

**Note**: Admin console does NOT have Google OAuth routes - admins use email/password authentication only.

### 5. Dependencies Installed

```bash
npm install google-auth-library
```

## Frontend Configuration

### 1. Components

**GoogleSignInButton Component**
Location: `src/components/auth/GoogleSignInButton.tsx`

A reusable button component that initiates the Google OAuth flow by redirecting to the backend.

### 2. Auth Context Updates

The `AuthContext` has been updated with:
- `signInWithGoogle()` method - Redirects to backend OAuth endpoint
- OAuth callback handling in SignIn/SignUp pages

### 3. Pages Updated

Both `SignInPage` and `SignUpPage` now include:
- Google Sign-In button
- OAuth callback handling (success/error messages)
- URL cleanup after OAuth redirect

## OAuth Flow

### User Sign-In Flow

1. User clicks "Continue with Google" button
2. Frontend redirects to: `https://api.propsiss.com/api/auth/google`
3. Backend redirects to Google's OAuth consent screen
4. User authenticates with Google
5. Google redirects back to: `https://api.propsiss.com/api/auth/google/callback`
6. Backend:
   - Verifies the Google token
   - Creates or links user account
   - Creates session
7. Backend redirects to: `https://propsiss.com/login?google_auth=success`
8. Frontend displays success message and user is logged in

### Admin Sign-In Flow

**Admins do NOT use Google OAuth** - they must sign in with email and password only for security reasons.

## Security Features

1. **Admin Protection**: Admins do NOT have Google OAuth - they use email/password authentication only for enhanced security.

2. **Account Linking**: If a user already exists with the email from Google, the Google account is automatically linked.

3. **Session Management**: Sessions are stored in MongoDB with proper expiration and security settings.

4. **Email Verification**: Google-authenticated users are marked as verified automatically.

## Testing

### Test User Google Sign-In

1. Navigate to: `http://localhost:5173/sign-in` (or production URL)
2. Click "Continue with Google"
3. Complete Google authentication
4. You should be redirected to the user dashboard

## Error Handling

The implementation handles various error scenarios:
- Google authentication failure
- Session creation errors
- Account not found (for admins)
- Network errors

Error messages are displayed using toast notifications on the frontend.

## Production Deployment

### Required Steps:

1. **Update Redirect URIs** in Google Cloud Console:
   - Add: `https://api.propsiss.com/api/auth/google/callback` (users only)

2. **Environment Variables**: Ensure all production servers have the correct Google credentials set.

3. **HTTPS**: Google OAuth requires HTTPS in production.

4. **CORS**: Ensure CORS is properly configured to allow the frontend domain.

## Troubleshooting

### "Redirect URI mismatch" error
- Check that the callback URLs in Google Cloud Console match exactly
- Ensure the `API_URL` environment variable is correct

### Admin cannot use Google Sign-In
- This is by design - admins use email/password authentication only
- Google OAuth is available for frontend users only

### Session not persisting
- Check MongoDB connection
- Verify session secret is set
- Check cookie settings (secure, sameSite, domain)

### CORS errors
- Verify CORS settings in `admin-console/app.js`
- Ensure frontend URL is in the allowed origins list

## Files Modified

### Backend
- `admin-console/models/User.js`
- `admin-console/models/Admin.js`
- `admin-console/config/passport.js` (new)
- `admin-console/app.js`
- `admin-console/routes/authRoutes.js`
- `admin-console/routes/frontendAuthRoutes.js`
- `admin-console/controllers/authController.js`
- `admin-console/config.env`
- `admin-console/package.json`

### Frontend
- `src/contexts/AuthContext.tsx`
- `src/components/auth/GoogleSignInButton.tsx` (new)
- `src/pages/SignInPage.tsx`
- `src/pages/SignUpPage.tsx`

## Support

For issues or questions, refer to:
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Passport.js Documentation](http://www.passportjs.org/)
- [Google Cloud Console](https://console.cloud.google.com/)

