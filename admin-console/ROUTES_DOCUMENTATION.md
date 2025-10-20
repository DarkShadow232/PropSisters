# Admin Console Routes Documentation

## Overview
This document provides comprehensive documentation for all routes in the Sisterhood Style Rentals Admin Console. The admin console is built with Express.js and uses EJS templates for server-side rendering.

---

## Table of Contents
1. [Authentication Routes](#authentication-routes)
2. [Dashboard Routes](#dashboard-routes)
3. [Property Routes](#property-routes)
4. [User Routes](#user-routes)
5. [Booking Routes](#booking-routes)
6. [Middleware](#middleware)
7. [Models](#models)

---

## Authentication Routes
**Base Path:** `/auth`  
**Controller:** `authController.js`  
**Route File:** `routes/authRoutes.js`

### Login Page
- **URL:** `GET /auth/login`
- **Access:** Public (Not Authenticated)
- **Controller Method:** `authController.getLogin`
- **Description:** Displays the admin login page
- **View:** `views/auth/login.ejs`
- **Response Data:**
  - `title`: Page title
  - `error`: Flash error messages
  - `success`: Flash success messages

### Login Submit
- **URL:** `POST /auth/login`
- **Access:** Public (Not Authenticated)
- **Controller Method:** `authController.postLogin`
- **Description:** Handles admin authentication
- **Request Body:**
  ```json
  {
    "email": "admin@example.com",
    "password": "password123"
  }
  ```
- **Success Response:** Redirects to dashboard (`/`) or return URL
- **Error Response:** Redirects to `/auth/login` with error message
- **Session Data Created:**
  - `adminId`: Admin's MongoDB ObjectId
  - `adminEmail`: Admin's email
  - `adminName`: Admin's display name

### Logout
- **URL:** `GET /auth/logout`
- **Access:** Public
- **Controller Method:** `authController.logout`
- **Description:** Destroys admin session and logs out
- **Success Response:** Redirects to `/auth/login`

---

## Dashboard Routes
**Base Path:** `/`  
**Controller:** `dashboardController.js`  
**Route File:** `routes/adminRoutes.js`  
**Authentication:** Required

### Dashboard Home
- **URL:** `GET /`
- **Access:** Authenticated Admin Only
- **Controller Method:** `dashboardController.getDashboard`
- **Description:** Displays the main dashboard with statistics
- **View:** `views/dashboard.ejs`
- **Response Data:**
  ```javascript
  {
    title: "Dashboard",
    admin: {
      _id, email, name
    },
    stats: {
      totalProperties: Number,
      totalUsers: Number,
      totalBookings: Number,
      pendingBookings: Number,
      confirmedBookings: Number,
      cancelledBookings: Number,
      totalRevenue: Number
    },
    recentBookings: [
      {
        id, propertyTitle, userName,
        checkIn, checkOut, status,
        totalPrice, createdAt
      }
    ]
  }
  ```

---

## Property Routes
**Base Path:** `/properties`  
**Controller:** `propertyController.js`  
**Route File:** `routes/adminRoutes.js`  
**Authentication:** Required

### List All Properties
- **URL:** `GET /properties`
- **Access:** Authenticated Admin Only
- **Controller Method:** `propertyController.listProperties`
- **Description:** Displays list of all rental properties
- **View:** `views/properties/index.ejs`
- **Response Data:**
  ```javascript
  {
    title: "Properties",
    admin: { _id, email, name },
    properties: [
      {
        _id, title, description, location, address,
        price, bedrooms, bathrooms, amenities,
        images, availability, createdAt
      }
    ],
    success: "Flash messages",
    error: "Flash messages"
  }
  ```

### Create Property Form
- **URL:** `GET /properties/create`
- **Access:** Authenticated Admin Only
- **Controller Method:** `propertyController.getCreateProperty`
- **Description:** Displays form to create new property
- **View:** `views/properties/create.ejs`
- **Response Data:**
  ```javascript
  {
    title: "Create Property",
    admin: { _id, email, name },
    error: "Flash messages"
  }
  ```

### Create Property Submit
- **URL:** `POST /properties/create`
- **Access:** Authenticated Admin Only
- **Controller Method:** `propertyController.postCreateProperty`
- **Description:** Creates a new rental property
- **Content-Type:** `multipart/form-data` (supports file uploads)
- **Request Body:**
  ```javascript
  {
    title: String (required),
    description: String (required),
    location: String (required),
    address: String (required),
    price: Number (required),
    bedrooms: Number,
    bathrooms: Number,
    amenities: String[] or String (comma-separated),
    ownerName: String,
    ownerEmail: String,
    ownerPhone: String,
    availability: Boolean,
    images: File[] (max 10 files, 10MB each)
  }
  ```
- **File Upload:** 
  - Field name: `images`
  - Max files: 10
  - Max size per file: 10MB
  - Allowed types: Images only (image/*)
  - Storage: `public/uploads/rentals/`
- **Success Response:** Redirects to `/properties` with success message
- **Error Response:** Redirects to `/properties/create` with error message

### Edit Property Form
- **URL:** `GET /properties/:id/edit`
- **Access:** Authenticated Admin Only
- **Controller Method:** `propertyController.getEditProperty`
- **Description:** Displays form to edit existing property
- **URL Parameters:**
  - `id`: Property MongoDB ObjectId
- **View:** `views/properties/edit.ejs`
- **Response Data:**
  ```javascript
  {
    title: "Edit Property",
    admin: { _id, email, name },
    property: { /* full property object */ },
    error: "Flash messages"
  }
  ```

### Update Property Submit
- **URL:** `POST /properties/:id/edit`
- **Access:** Authenticated Admin Only
- **Controller Method:** `propertyController.postEditProperty`
- **Description:** Updates an existing rental property
- **URL Parameters:**
  - `id`: Property MongoDB ObjectId
- **Content-Type:** `multipart/form-data`
- **Request Body:**
  ```javascript
  {
    title: String (required),
    description: String (required),
    location: String (required),
    address: String (required),
    price: Number (required),
    bedrooms: Number,
    bathrooms: Number,
    amenities: String[] or String,
    ownerName: String,
    ownerEmail: String,
    ownerPhone: String,
    availability: Boolean,
    existingImages: String[] (URLs of images to keep),
    images: File[] (new images to upload)
  }
  ```
- **Image Handling:**
  - Keeps images specified in `existingImages`
  - Deletes removed images from disk
  - Uploads new images to `public/uploads/rentals/`
- **Success Response:** Redirects to `/properties` with success message
- **Error Response:** Redirects to `/properties/:id/edit` with error message

### Delete Property
- **URL:** `POST /properties/:id/delete`
- **Access:** Authenticated Admin Only
- **Controller Method:** `propertyController.deleteProperty`
- **Description:** Deletes a property and its associated images
- **URL Parameters:**
  - `id`: Property MongoDB ObjectId
- **Side Effects:**
  - Deletes property document from MongoDB
  - Deletes all associated image files from disk
- **Success Response:** Redirects to `/properties` with success message
- **Error Response:** Redirects to `/properties` with error message

---

## User Routes
**Base Path:** `/users`  
**Controller:** `userController.js`  
**Route File:** `routes/adminRoutes.js`  
**Authentication:** Required

### List All Users
- **URL:** `GET /users`
- **Access:** Authenticated Admin Only
- **Controller Method:** `userController.listUsers`
- **Description:** Displays list of all registered users
- **View:** `views/users/index.ejs`
- **Response Data:**
  ```javascript
  {
    title: "Users",
    admin: { _id, email, name },
    users: [
      {
        _id, email, displayName, phoneNumber,
        profilePicture, createdAt, updatedAt
      }
    ],
    success: "Flash messages",
    error: "Flash messages"
  }
  ```

### View User Details
- **URL:** `GET /users/:id`
- **Access:** Authenticated Admin Only
- **Controller Method:** `userController.viewUser`
- **Description:** Displays detailed user information and booking history
- **URL Parameters:**
  - `id`: User MongoDB ObjectId
- **View:** `views/users/view.ejs`
- **Response Data:**
  ```javascript
  {
    title: "User Details",
    admin: { _id, email, name },
    user: {
      _id, email, displayName, phoneNumber,
      profilePicture, createdAt, updatedAt
    },
    bookings: [
      {
        id, propertyId, propertyTitle,
        checkIn, checkOut, status,
        totalPrice, createdAt
      }
    ],
    success: "Flash messages",
    error: "Flash messages"
  }
  ```

### Delete User
- **URL:** `POST /users/:id/delete`
- **Access:** Authenticated Admin Only
- **Controller Method:** `userController.deleteUser`
- **Description:** Deletes a user account from the system
- **URL Parameters:**
  - `id`: User MongoDB ObjectId
- **Side Effects:**
  - Deletes user document from MongoDB
  - Note: Associated bookings are NOT automatically deleted
- **Success Response:** Redirects to `/users` with success message
- **Error Response:** Redirects to `/users` with error message

---

## Booking Routes
**Base Path:** `/bookings`  
**Controller:** `bookingController.js`  
**Route File:** `routes/adminRoutes.js`  
**Authentication:** Required

### List All Bookings
- **URL:** `GET /bookings`
- **Access:** Authenticated Admin Only
- **Controller Method:** `bookingController.listBookings`
- **Description:** Displays list of all bookings with optional status filter
- **Query Parameters:**
  - `status`: Filter by booking status (optional)
    - Values: `all`, `pending`, `confirmed`, `cancelled`
- **View:** `views/bookings/index.ejs`
- **Response Data:**
  ```javascript
  {
    title: "Bookings",
    admin: { _id, email, name },
    bookings: [
      {
        id, propertyId, userId,
        propertyTitle, userName,
        checkIn, checkOut, guests,
        status, totalPrice, createdAt
      }
    ],
    currentFilter: String,
    success: "Flash messages",
    error: "Flash messages"
  }
  ```

### View Booking Details
- **URL:** `GET /bookings/:id`
- **Access:** Authenticated Admin Only
- **Controller Method:** `bookingController.viewBooking`
- **Description:** Displays detailed booking information
- **URL Parameters:**
  - `id`: Booking MongoDB ObjectId
- **View:** `views/bookings/view.ejs`
- **Response Data:**
  ```javascript
  {
    title: "Booking Details",
    admin: { _id, email, name },
    booking: {
      id, propertyId, userId,
      checkIn, checkOut, guests,
      status, totalPrice,
      specialRequests, cleaningService,
      airportPickup, earlyCheckIn,
      createdAt
    },
    property: {
      id, title, location, address,
      images: []
    },
    user: {
      id, displayName, email, phoneNumber
    },
    success: "Flash messages",
    error: "Flash messages"
  }
  ```

### Update Booking Status
- **URL:** `POST /bookings/:id/status`
- **Access:** Authenticated Admin Only
- **Controller Method:** `bookingController.updateBookingStatus`
- **Description:** Updates the status of a booking
- **URL Parameters:**
  - `id`: Booking MongoDB ObjectId
- **Request Body:**
  ```json
  {
    "status": "pending" | "confirmed" | "cancelled"
  }
  ```
- **Validation:**
  - Status must be one of: `pending`, `confirmed`, `cancelled`
- **Success Response:** Redirects to `/bookings/:id` with success message
- **Error Response:** Redirects to `/bookings/:id` with error message

---

## Middleware

### Authentication Middleware
**File:** `middleware/authMiddleware.js`

#### isAuthenticated
- **Description:** Protects routes from unauthenticated access
- **Usage:** Applied to all admin routes
- **Checks:**
  - Verifies `req.session.adminId` exists
  - Fetches admin data from MongoDB
  - Attaches admin object to `req.admin`
- **On Success:** Calls `next()` to proceed
- **On Failure:** 
  - Stores return URL in `req.session.returnTo`
  - Redirects to `/auth/login`

#### isNotAuthenticated
- **Description:** Prevents authenticated users from accessing login page
- **Usage:** Applied to login routes
- **Checks:**
  - Verifies `req.session.adminId` does NOT exist
- **On Success:** Calls `next()` to proceed (user can access login)
- **On Failure:** Redirects to dashboard (`/`)

---

## Models

### Admin Model
**File:** `models/Admin.js`  
**Collection:** `admins`

**Schema:**
```javascript
{
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed with bcrypt),
  createdAt: Date,
  updatedAt: Date
}
```

**Methods:**
- `comparePassword(candidatePassword)`: Compares plain text password with hashed password

### User Model
**File:** `models/User.js`  
**Collection:** `users`

**Schema:**
```javascript
{
  email: String (required, unique),
  displayName: String,
  phoneNumber: String,
  profilePicture: String (URL),
  createdAt: Date,
  updatedAt: Date
}
```

### Rental Model
**File:** `models/Rental.js`  
**Collection:** `rentals`

**Schema:**
```javascript
{
  title: String (required),
  description: String (required),
  location: String (required),
  address: String (required),
  price: Number (required),
  bedrooms: Number (default: 0),
  bathrooms: Number (default: 0),
  amenities: String[] (default: []),
  images: String[] (default: []),
  ownerName: String,
  ownerEmail: String,
  ownerPhone: String,
  availability: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Booking Model
**File:** `models/Booking.js`  
**Collection:** `bookings`

**Schema:**
```javascript
{
  propertyId: ObjectId (ref: 'Rental', required),
  userId: ObjectId (ref: 'User', required),
  checkIn: Date (required),
  checkOut: Date (required),
  guests: Number (default: 1),
  status: String (enum: ['pending', 'confirmed', 'cancelled'], default: 'pending'),
  totalPrice: Number (required),
  specialRequests: String,
  cleaningService: Boolean (default: false),
  airportPickup: Boolean (default: false),
  earlyCheckIn: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

---

## File Upload Configuration

### Multer Setup
**Location:** `routes/adminRoutes.js`

**Storage Configuration:**
```javascript
{
  destination: 'public/uploads/rentals/',
  filename: 'property-{timestamp}-{random}.{ext}'
}
```

**Upload Limits:**
- Max file size: 10MB per file
- Max files: 10 files per request
- Allowed types: Images only (`image/*`)

**Field Names:**
- `images`: For property image uploads

---

## Error Handling

### Flash Messages
The application uses `connect-flash` for session-based messaging:
- **Success messages:** `req.flash('success', 'Message')`
- **Error messages:** `req.flash('error', 'Message')`

### Error Responses
All controllers follow consistent error handling:
1. Log error to console
2. Set flash error message
3. Redirect to appropriate page

---

## Session Management

### Session Data
**Package:** `express-session`

**Stored Data:**
```javascript
{
  adminId: ObjectId,
  adminEmail: String,
  adminName: String,
  returnTo: String (optional, for redirect after login)
}
```

---

## Best Practices

### Security
1. All admin routes are protected by `isAuthenticated` middleware
2. Passwords are hashed using bcrypt before storage
3. File uploads are validated for type and size
4. Session-based authentication (not JWT for server-rendered app)

### File Management
1. Images are stored locally in `public/uploads/rentals/`
2. When properties are deleted, associated images are removed from disk
3. When properties are updated, unused images are deleted

### Database Queries
1. Use `.lean()` for read-only operations (better performance)
2. Use `.populate()` to join related collections
3. Sort by `createdAt: -1` for most recent first

### Validation
1. Required fields are validated before database operations
2. Enum values are validated for status fields
3. File types are validated during upload

---

## Environment Variables

Required environment variables in `.env`:
```env
# Server
PORT=3000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/sisterhood-rentals

# Session
SESSION_SECRET=your-secret-key-here

# Upload
UPLOAD_DIR=public/uploads/rentals
```

---

## Testing Routes

### Using cURL

**Login:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}' \
  -c cookies.txt
```

**List Properties (requires authentication):**
```bash
curl -X GET http://localhost:3000/properties \
  -b cookies.txt
```

**Create Property:**
```bash
curl -X POST http://localhost:3000/properties/create \
  -b cookies.txt \
  -F "title=Beach House" \
  -F "description=Beautiful beach house" \
  -F "location=Cairo" \
  -F "address=123 Beach St" \
  -F "price=1500" \
  -F "bedrooms=3" \
  -F "bathrooms=2" \
  -F "amenities=WiFi,Pool" \
  -F "images=@image1.jpg" \
  -F "images=@image2.jpg"
```

---

## Troubleshooting

### Common Issues

1. **"Property not found" error**
   - Verify the ObjectId is valid and exists in database
   - Check MongoDB connection

2. **Image upload fails**
   - Ensure `public/uploads/rentals/` directory exists
   - Check file size (max 10MB)
   - Verify file type is image

3. **Session not persisting**
   - Check `SESSION_SECRET` is set in environment
   - Verify session store is properly configured

4. **Redirect loop on login**
   - Clear browser cookies
   - Check `isAuthenticated` middleware logic

---

## Future Enhancements

### Suggested Improvements
1. **API Routes**: Add RESTful API endpoints for external integrations
2. **Bulk Operations**: Add bulk delete/update for properties and bookings
3. **Advanced Filtering**: Add date range and price filters
4. **Export Data**: Add CSV/Excel export functionality
5. **Email Notifications**: Send emails when booking status changes
6. **Image Optimization**: Compress images on upload
7. **Pagination**: Add pagination for large lists
8. **Search**: Add search functionality for properties and users
9. **Analytics**: Add charts and graphs for better insights
10. **Role-Based Access**: Add different admin roles with varying permissions

---

## Version History
- **v1.0.0** - Initial documentation (October 2025)

## Contact & Support
For issues or questions about the admin console routes:
- Review this documentation
- Check the controller files for implementation details
- Verify middleware configuration
- Check MongoDB connection and data

---

*Last Updated: October 2025*

