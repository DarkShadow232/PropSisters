# Admin Console - Complete Routes Summary

## Overview
This document provides a complete overview of all routes available in the Sisterhood Style Rentals Admin Console, including both web routes (server-rendered) and REST API routes.

---

## Architecture

```
admin-console/
├── app.js                          # Main application entry point
├── routes/
│   ├── authRoutes.js              # Authentication routes
│   ├── adminRoutes.js             # Admin web interface routes
│   └── apiRoutes.js               # REST API routes
├── controllers/
│   ├── authController.js          # Authentication logic
│   ├── dashboardController.js     # Dashboard logic
│   ├── propertyController.js      # Property CRUD logic
│   ├── userController.js          # User management logic
│   └── bookingController.js       # Booking management logic
└── middleware/
    └── authMiddleware.js          # Authentication middleware
```

---

## Route Types

### 1. Web Routes (Server-Rendered HTML)
- **Purpose:** Admin web interface
- **Response:** HTML pages (EJS templates)
- **Authentication:** Session-based
- **Base Path:** `/`

### 2. API Routes (REST API)
- **Purpose:** Programmatic access
- **Response:** JSON data
- **Authentication:** Session-based (same as web)
- **Base Path:** `/api`

---

## Complete Route List

### Authentication Routes (`/auth`)
| Method | Path | Type | Controller | Description |
|--------|------|------|------------|-------------|
| GET | `/auth/login` | Web | authController.getLogin | Login page |
| POST | `/auth/login` | Web | authController.postLogin | Login submit |
| GET | `/auth/logout` | Web | authController.logout | Logout |

### Dashboard Routes
| Method | Path | Type | Controller | Description |
|--------|------|------|------------|-------------|
| GET | `/` | Web | dashboardController.getDashboard | Dashboard page |
| GET | `/api/dashboard/stats` | API | - | Dashboard statistics JSON |
| GET | `/api/dashboard/recent-bookings` | API | - | Recent bookings JSON |

### Property Routes
| Method | Path | Type | Controller | Description |
|--------|------|------|------------|-------------|
| GET | `/properties` | Web | propertyController.listProperties | Properties list page |
| GET | `/properties/create` | Web | propertyController.getCreateProperty | Create property form |
| POST | `/properties/create` | Web | propertyController.postCreateProperty | Submit new property |
| GET | `/properties/:id/edit` | Web | propertyController.getEditProperty | Edit property form |
| POST | `/properties/:id/edit` | Web | propertyController.postEditProperty | Update property |
| POST | `/properties/:id/delete` | Web | propertyController.deleteProperty | Delete property |
| GET | `/api/properties` | API | - | List properties JSON |
| GET | `/api/properties/:id` | API | - | Get property JSON |
| POST | `/api/properties` | API | - | Create property JSON |
| PUT | `/api/properties/:id` | API | - | Update property JSON |
| DELETE | `/api/properties/:id` | API | - | Delete property JSON |

### User Routes
| Method | Path | Type | Controller | Description |
|--------|------|------|------------|-------------|
| GET | `/users` | Web | userController.listUsers | Users list page |
| GET | `/users/:id` | Web | userController.viewUser | User details page |
| POST | `/users/:id/delete` | Web | userController.deleteUser | Delete user |
| GET | `/api/users` | API | - | List users JSON |
| GET | `/api/users/:id` | API | - | Get user JSON |
| DELETE | `/api/users/:id` | API | - | Delete user JSON |

### Booking Routes
| Method | Path | Type | Controller | Description |
|--------|------|------|------------|-------------|
| GET | `/bookings` | Web | bookingController.listBookings | Bookings list page |
| GET | `/bookings/:id` | Web | bookingController.viewBooking | Booking details page |
| POST | `/bookings/:id/status` | Web | bookingController.updateBookingStatus | Update booking status |
| GET | `/api/bookings` | API | - | List bookings JSON |
| GET | `/api/bookings/:id` | API | - | Get booking JSON |
| PATCH | `/api/bookings/:id/status` | API | - | Update status JSON |
| DELETE | `/api/bookings/:id` | API | - | Delete booking JSON |

---

## Controllers Summary

### authController.js
**Exports:**
- `getLogin()` - Display login page
- `postLogin()` - Handle login authentication
- `logout()` - Handle logout and session destruction

### dashboardController.js
**Exports:**
- `getDashboard()` - Display dashboard with statistics and recent bookings

### propertyController.js
**Exports:**
- `listProperties()` - List all properties
- `getCreateProperty()` - Display create form
- `postCreateProperty()` - Handle property creation with image uploads
- `getEditProperty()` - Display edit form
- `postEditProperty()` - Handle property update with image management
- `deleteProperty()` - Delete property and associated images

### userController.js
**Exports:**
- `listUsers()` - List all users
- `viewUser()` - Display user details with booking history
- `deleteUser()` - Delete user account

### bookingController.js
**Exports:**
- `listBookings()` - List all bookings with optional status filter
- `viewBooking()` - Display booking details with property and user info
- `updateBookingStatus()` - Update booking status (pending/confirmed/cancelled)

---

## Middleware

### authMiddleware.js
**Exports:**

1. **isAuthenticated**
   - Protects routes from unauthenticated access
   - Checks if admin is logged in
   - Fetches admin data and attaches to `req.admin`
   - Redirects to login if not authenticated

2. **isNotAuthenticated**
   - Prevents authenticated users from accessing login
   - Redirects to dashboard if already logged in

---

## Data Models

### Admin
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### User
```javascript
{
  email: String (unique),
  displayName: String,
  phoneNumber: String,
  profilePicture: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Rental (Property)
```javascript
{
  title: String,
  description: String,
  location: String,
  address: String,
  price: Number,
  bedrooms: Number,
  bathrooms: Number,
  amenities: [String],
  images: [String],
  ownerName: String,
  ownerEmail: String,
  ownerPhone: String,
  availability: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Booking
```javascript
{
  propertyId: ObjectId (ref: Rental),
  userId: ObjectId (ref: User),
  checkIn: Date,
  checkOut: Date,
  guests: Number,
  status: String (pending/confirmed/cancelled),
  totalPrice: Number,
  specialRequests: String,
  cleaningService: Boolean,
  airportPickup: Boolean,
  earlyCheckIn: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Request/Response Flow

### Web Interface Flow
```
Browser → GET /properties → isAuthenticated → propertyController.listProperties → EJS Template → HTML Response
```

### API Flow
```
Client → GET /api/properties → isAuthenticated → API Handler → JSON Response
```

---

## Authentication Flow

### Login Process
```
1. User visits /auth/login
2. User submits email/password
3. Server validates credentials
4. Server creates session
5. Session cookie sent to client
6. User redirected to dashboard
```

### Protected Route Access
```
1. Client sends request with session cookie
2. isAuthenticated middleware checks session
3. If valid: attach admin to req.admin, proceed
4. If invalid: redirect to /auth/login
```

---

## File Upload Flow

### Property Image Upload
```
1. Client submits multipart/form-data
2. Multer middleware intercepts
3. Files saved to public/uploads/rentals/
4. File paths stored in database
5. Images accessible at /uploads/rentals/{filename}
```

**Configuration:**
- Storage: Local disk (public/uploads/rentals/)
- Max files: 10 per request
- Max size: 10MB per file
- Allowed types: Images only

---

## Common Query Parameters

### Properties API
- `availability` - Filter by availability (true/false)
- `location` - Search by location (case-insensitive)
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

### Users API
- `search` - Search by email or name
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

### Bookings
- `status` - Filter by status (pending/confirmed/cancelled/all)
- `propertyId` - Filter by property
- `userId` - Filter by user
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

---

## Status Codes

| Code | Meaning | Used When |
|------|---------|-----------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST (create) |
| 302 | Redirect | After POST in web interface |
| 400 | Bad Request | Invalid input/validation error |
| 401 | Unauthorized | Not authenticated |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Unexpected error |

---

## Error Handling

### Web Routes
- Use flash messages for user feedback
- Redirect back to appropriate page
- Display errors in EJS templates

### API Routes
- Return JSON error response
- Include error message
- Log error to console

**Example API Error:**
```json
{
  "success": false,
  "error": "Property not found"
}
```

---

## Session Configuration

**Storage:** MongoDB (using connect-mongo)

**Cookie Settings:**
- Max Age: 7 days
- HttpOnly: true
- Secure: true (production only)

**Session Data:**
```javascript
{
  adminId: ObjectId,
  adminEmail: String,
  adminName: String,
  returnTo: String (optional)
}
```

---

## CORS Configuration

**Enabled for:** `http://localhost:5173` (React frontend)

**Credentials:** Allowed (for session cookies)

**Configurable via:** `FRONTEND_URL` environment variable

---

## Environment Variables

Required in `.env`:
```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/rental-admin

# Session
SESSION_SECRET=your-secret-key-here

# Frontend
FRONTEND_URL=http://localhost:5173
```

---

## Testing

### Test Web Interface
1. Start server: `npm start`
2. Visit: `http://localhost:3000/auth/login`
3. Login with admin credentials
4. Navigate through interface

### Test API
1. Login to get session cookie
2. Use cURL/Postman with cookie
3. Test CRUD operations
4. Verify JSON responses

---

## Documentation Files

| File | Purpose |
|------|---------|
| `ROUTES_DOCUMENTATION.md` | Comprehensive route documentation |
| `API_DOCUMENTATION.md` | REST API reference with examples |
| `ROUTES_QUICK_REFERENCE.md` | Quick lookup table |
| `ROUTES_SUMMARY.md` | This file - complete overview |

---

## Quick Start

### 1. Install Dependencies
```bash
cd admin-console
npm install
```

### 2. Configure Environment
```bash
cp env.example .env
# Edit .env with your settings
```

### 3. Create Admin Account
```bash
npm run seed
```

### 4. Start Server
```bash
npm start
```

### 5. Access Interface
- Web: `http://localhost:3000/auth/login`
- API: `http://localhost:3000/api/*`

---

## Development Workflow

1. **Add New Feature:**
   - Create controller function
   - Add route in appropriate routes file
   - Create view (for web) or test endpoint (for API)
   - Update documentation

2. **Modify Existing Feature:**
   - Update controller
   - Update route if needed
   - Update view/tests
   - Update documentation

3. **Debug Issues:**
   - Check console logs
   - Verify MongoDB connection
   - Check session configuration
   - Test authentication flow

---

## Production Considerations

1. **Security:**
   - Use HTTPS
   - Set strong SESSION_SECRET
   - Enable secure cookies
   - Add rate limiting
   - Implement CSRF protection

2. **Performance:**
   - Add database indexes
   - Implement caching
   - Optimize image storage
   - Use CDN for static assets

3. **Monitoring:**
   - Add logging (Winston/Morgan)
   - Monitor database performance
   - Track API usage
   - Set up error tracking (Sentry)

4. **Scalability:**
   - Use Redis for sessions
   - Implement queue for heavy operations
   - Consider microservices
   - Use load balancer

---

## Troubleshooting

### Common Issues

**Issue:** Session not persisting
- **Solution:** Check SESSION_SECRET, verify MongoDB connection, clear browser cookies

**Issue:** Images not uploading
- **Solution:** Ensure public/uploads/rentals/ exists, check file permissions, verify file size

**Issue:** 401 Unauthorized on API
- **Solution:** Login first, verify session cookie is sent, check credentials setting

**Issue:** CORS errors from frontend
- **Solution:** Verify FRONTEND_URL in .env, enable credentials in fetch requests

---

## Support & Resources

- **MongoDB Docs:** https://docs.mongodb.com/
- **Express Docs:** https://expressjs.com/
- **EJS Docs:** https://ejs.co/
- **Multer Docs:** https://github.com/expressjs/multer

---

*Last Updated: October 2025*
*Version: 1.0.0*

