# Setup Instructions - MongoDB Integration

This guide will help you set up and test the MongoDB integration between the admin console and frontend.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or remote connection)
- npm or yarn

## Step 1: Create Environment Files

### Admin Console Environment File

Create `admin-console/.env`:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/rental-admin

# Session Configuration
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:8081
```

**Important**: Change `SESSION_SECRET` to a strong random string in production!

### Frontend Environment File

Create `.env.local` in the root directory:

```env
# Backend API URL
VITE_API_URL=http://localhost:3000/api
```

## Step 2: Install Dependencies

### Admin Console

```bash
cd admin-console
npm install
```

### Frontend

```bash
# From root directory
npm install
```

## Step 3: Start MongoDB

Make sure MongoDB is running:

```bash
# If using local MongoDB
mongod
```

Or use your MongoDB Atlas connection string in the `.env` file.

## Step 4: Seed Admin User (First Time Only)

```bash
cd admin-console
npm run seed
```

This will create an admin user with:
- Email: `admin@example.com`
- Password: `admin123`

## Step 5: Start the Admin Console Backend

```bash
cd admin-console
npm run dev
```

The admin console should start on `http://localhost:3000`

You should see:
```
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🏠  Admin Console is running!                      ║
║                                                       ║
║   📍 URL: http://localhost:3000                       ║
║   🌍 Environment: development                         ║
║   💾 Database: MongoDB (All Data)                    ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
```

## Step 6: Test Admin Panel

1. Open `http://localhost:3000/auth/login`
2. Login with admin credentials:
   - Email: `admin@example.com`
   - Password: `admin123`
3. Navigate to Properties section
4. Try creating a new property
5. Try editing a property (should NOT redirect to login)
6. Try deleting a property (should work correctly)

## Step 7: Test Public API Endpoints

Open a new terminal and test the public endpoints:

```bash
# Test getting all properties (no authentication required)
curl http://localhost:3000/api/public/properties

# Should return JSON with properties data
```

If you see property data, the public API is working correctly! ✅

## Step 8: Start the Frontend

In a new terminal:

```bash
# From root directory
npm run dev
```

The frontend should start on `http://localhost:8081`

## Step 9: Verify Frontend Integration

1. Open `http://localhost:8081/rentals`
2. You should see "Loading properties from database..."
3. Properties should load from MongoDB
4. Check browser console - you should see:
   ```
   Fetching properties from: http://localhost:3000/api/public/properties?limit=100
   Fetched X properties from MongoDB
   ```

## Step 10: Test Synchronization

### Add a Property in Admin Panel

1. Go to admin console: `http://localhost:3000/properties`
2. Click "Add New Property"
3. Fill in the details:
   - Title: "Test Property"
   - Description: "Testing MongoDB sync"
   - Location: "Test Location"
   - Address: "123 Test St"
   - Price: 1000
   - Bedrooms: 2
   - Bathrooms: 1
4. Upload at least one image
5. Click "Create Property"

### Verify on Frontend

1. Go to frontend: `http://localhost:8081/rentals`
2. Wait up to 30 seconds (auto-refresh) OR
3. Click the "Refresh" button
4. You should see the new "Test Property" appear! ✅

### Edit the Property

1. In admin console, edit "Test Property"
2. Change the title to "Test Property - Updated"
3. Save changes
4. Go to frontend and refresh
5. The updated title should appear! ✅

### Delete the Property

1. In admin console, delete "Test Property - Updated"
2. Go to frontend and refresh
3. The property should disappear! ✅

---

## Troubleshooting

### Issue: "Failed to Load Properties"

**Possible Causes:**
1. Admin console backend is not running
2. MongoDB is not running
3. Wrong API URL in `.env.local`

**Solution:**
- Check that admin console is running on port 3000
- Check MongoDB connection
- Verify VITE_API_URL in `.env.local`

### Issue: "Edit redirects to login"

**Possible Causes:**
1. Session expired
2. MongoDB not connected

**Solution:**
- Clear browser cookies
- Check MongoDB connection
- Restart admin console

### Issue: "Images not loading"

**Possible Causes:**
1. Image proxy not configured
2. Wrong image paths

**Solution:**
- Check `vite.config.ts` has proxy configuration
- Restart frontend dev server
- Check image paths start with `/uploads/`

### Issue: "Properties not updating on frontend"

**Possible Causes:**
1. Polling not working
2. Browser cache

**Solution:**
- Hard refresh browser (Ctrl+Shift+R)
- Click manual "Refresh" button
- Check browser console for errors

---

## Configuration Reference

### Admin Console (Backend)

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 3000 | Server port |
| MONGODB_URI | `mongodb://localhost:27017/rental-admin` | MongoDB connection |
| SESSION_SECRET | (required) | Session encryption key |
| FRONTEND_URL | `http://localhost:8081` | Frontend URL for CORS |

### Frontend

| Variable | Default | Description |
|----------|---------|-------------|
| VITE_API_URL | `http://localhost:3000/api` | Backend API URL |

---

## API Endpoints Reference

### Public Endpoints (No Authentication)

- `GET /api/public/properties` - Get all available properties
  - Query params: `location`, `minPrice`, `maxPrice`, `bedrooms`, `page`, `limit`
- `GET /api/public/properties/:id` - Get single property

### Admin Endpoints (Authentication Required)

- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/properties` - All properties (including unavailable)
- `POST /api/admin/properties` - Create property
- `PUT /api/admin/properties/:id` - Update property
- `DELETE /api/admin/properties/:id` - Delete property
- And more... (see `admin-console/routes/apiRoutes.js`)

---

## Production Deployment Notes

### Admin Console

Update `admin-console/.env`:

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=your-production-mongodb-uri
SESSION_SECRET=very-strong-random-secret-here
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend

Update `.env.local`:

```env
VITE_API_URL=https://your-backend-domain.com/api
```

Build frontend:

```bash
npm run build
```

Deploy `dist/` folder to your hosting service.

---

## Security Checklist

- [ ] Changed SESSION_SECRET to strong random string
- [ ] Using HTTPS in production
- [ ] MongoDB has authentication enabled
- [ ] Strong admin password set
- [ ] CORS configured with correct frontend URL
- [ ] Rate limiting configured (recommended)
- [ ] File upload validation enabled

---

## Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review the browser console for errors
3. Check the admin console logs
4. Verify all environment variables are set correctly
5. Ensure MongoDB is running and accessible

For detailed implementation details, see:
- `IMPLEMENTATION_PLAN_UPDATED.md` - Complete technical plan
- `QUICK_ACTION_SUMMARY.md` - Quick reference guide

---

## Success Indicators

✅ Admin console running on port 3000  
✅ Can login to admin panel without issues  
✅ Can create/edit/delete properties without redirect  
✅ Public API returns property data without authentication  
✅ Frontend loads properties from MongoDB  
✅ Changes in admin panel appear on frontend within 30 seconds  
✅ Images load correctly on frontend  

---

Congratulations! Your MongoDB integration is now complete and fully synchronized! 🎉

