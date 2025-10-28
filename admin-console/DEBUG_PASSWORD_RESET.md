# Password Reset System Debug Guide

## Current Issues Identified

### 1. Email Configuration Missing
The system is not configured with email credentials. You need to:

1. **Set up Gmail App Password**:
   - Go to Google Account settings
   - Enable 2-factor authentication
   - Generate an "App Password" for this application

2. **Update Environment Variables**:
   Edit `admin-console/config.env`:
   ```env
   EMAIL_USER=your-actual-gmail@gmail.com
   EMAIL_PASSWORD=your-16-character-app-password
   ADMIN_EMAIL=admin@propsiss.com
   ```

### 2. Testing Steps

#### Step 1: Test Email Configuration
```bash
cd admin-console
node test-email.js
```

#### Step 2: Start Admin Console with Debugging
```bash
cd admin-console
npm start
```

#### Step 3: Test Frontend
1. Go to `http://localhost:5173/forgot-password`
2. Enter a valid email address
3. Check browser console for frontend logs
4. Check admin console terminal for backend logs

### 3. Debug Logs to Look For

#### Frontend Logs (Browser Console):
- `🔍 Frontend: Password reset request initiated`
- `🔍 Frontend: Calling authService.requestPasswordReset...`
- `✅ Frontend: Password reset request successful`

#### Backend Logs (Admin Console Terminal):
- `🔍 Password reset request received`
- `🔍 Searching for user with email`
- `✅ User found` or `❌ User not found`
- `📧 EmailService: Starting password reset email process`
- `✅ EmailService: Email configuration is valid`

### 4. Common Issues and Solutions

#### Issue: "Email configuration is missing"
**Solution**: Set EMAIL_USER and EMAIL_PASSWORD in config.env

#### Issue: "Invalid login" or "Authentication failed"
**Solution**: Use Gmail App Password, not regular password

#### Issue: "User not found"
**Solution**: Make sure the email exists in your database

#### Issue: "Template not found"
**Solution**: Check if `admin-console/views/emails/password-reset.ejs` exists

### 5. Database Check
To verify users exist in the database:
```bash
cd admin-console
node -e "
const User = require('./models/User');
User.find({}).then(users => {
  console.log('Users in database:', users.map(u => ({ email: u.email, displayName: u.displayName })));
  process.exit(0);
});
"
```

### 6. Manual Testing
1. Create a test user account
2. Try password reset with that email
3. Check email inbox for reset link
4. Click reset link and test password change

## Debug Commands

### Test Email Configuration
```bash
cd admin-console
node test-email.js
```

### Check Environment Variables
```bash
cd admin-console
node -e "console.log('EMAIL_USER:', process.env.EMAIL_USER); console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'Set' : 'Not set');"
```

### Test Database Connection
```bash
cd admin-console
node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/propsisters')
  .then(() => console.log('✅ Database connected'))
  .catch(err => console.log('❌ Database error:', err.message));
"
```
