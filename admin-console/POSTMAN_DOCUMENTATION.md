# 📮 Postman API Documentation

## Base URL
```
http://localhost:3000
```

## 🔐 Authentication

All `/api/admin/*` routes require authentication via session cookies. Make sure to:
1. Enable "Send cookies" in Postman
2. Login first to establish session
3. Cookies will be automatically sent with subsequent requests

---

## 📚 Collections Overview

1. **Authentication** - User login, registration, Google OAuth
2. **Properties (Public)** - Public property listings
3. **Properties (Admin)** - CRUD operations for properties
4. **Users (Admin)** - User management
5. **Bookings (Admin)** - Booking management
6. **Dashboard (Admin)** - Statistics and analytics

---

# 🔑 1. Authentication Collection

## 1.1 Register with Email/Password

**POST** `/api/auth/register`

Register a new user with email and password (stored in MongoDB).

### Request Body (JSON)
```json
{
  "email": "user@example.com",
  "password": "password123",
  "displayName": "John Doe",
  "phoneNumber": "+1234567890"
}
```

### Response (201 Created)
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "displayName": "John Doe",
    "phoneNumber": "+1234567890",
    "photoURL": "",
    "role": "user",
    "authProvider": "email"
  }
}
```

### Validation Rules
- Email: Required, valid email format, unique
- Password: Required, minimum 8 characters
- DisplayName: Required

---

## 1.2 Login with Email/Password

**POST** `/api/auth/login`

Authenticate with email and password.

### Request Body (JSON)
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "message": "Logged in successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "displayName": "John Doe",
    "phoneNumber": "+1234567890",
    "photoURL": "",
    "role": "user",
    "authProvider": "email"
  }
}
```

### Error Response (401 Unauthorized)
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

## 1.3 Google Sign-In

**POST** `/api/auth/google`

Authenticate with Google OAuth (requires Firebase ID token).

### Headers
```
Authorization: Bearer <firebase_id_token>
```

### Response (200 OK)
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

---

## 1.4 Verify Session

**GET** `/api/auth/verify`

Check if current session is valid.

### Response (200 OK)
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

### Error Response (401 Unauthorized)
```json
{
  "success": false,
  "message": "Not authenticated"
}
```

---

## 1.5 Get Current User

**GET** `/api/auth/me`

Get detailed information about current authenticated user.

### Response (200 OK)
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
    "createdAt": "2024-01-15T10:30:45.123Z"
  }
}
```

---

## 1.6 Logout

**POST** `/api/auth/logout`

Destroy current session and logout user.

### Response (200 OK)
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 1.7 Update Profile

**PUT** `/api/auth/profile`

Update current user's profile information.

### Request Body (JSON)
```json
{
  "displayName": "Jane Doe",
  "phoneNumber": "+9876543210",
  "photoURL": "https://example.com/photo.jpg"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "displayName": "Jane Doe",
    "phoneNumber": "+9876543210",
    "photoURL": "https://example.com/photo.jpg",
    "role": "user"
  }
}
```

---

## 1.8 Change Password

**POST** `/api/auth/change-password`

Change password for email/password users (not available for Google users).

### Request Body (JSON)
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Error Response (401 Unauthorized)
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

---

# 🏠 2. Properties (Public) Collection

## 2.1 Get All Properties (Simple)

**GET** `/api/properties`

Get all properties without filters (simple endpoint).

### Response (200 OK)
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Luxury Apartment in Cairo",
    "description": "Beautiful 3-bedroom apartment...",
    "location": "Cairo",
    "address": "123 Nile Street, Cairo",
    "price": 1500,
    "bedrooms": 3,
    "bathrooms": 2,
    "amenities": ["WiFi", "Pool", "Gym"],
    "images": ["/uploads/rentals/property-123.jpg"],
    "availability": true,
    "ownerName": "Admin",
    "ownerEmail": "admin@example.com",
    "ownerPhone": "+201234567890",
    "createdAt": "2024-01-15T10:30:45.123Z",
    "updatedAt": "2024-01-15T10:30:45.123Z"
  }
]
```

---

## 2.2 Get Public Properties (With Filters)

**GET** `/api/public/properties`

Get available properties with filtering and pagination.

### Query Parameters
- `location` (string) - Filter by location (case-insensitive)
- `minPrice` (number) - Minimum price
- `maxPrice` (number) - Maximum price
- `bedrooms` (number) - Number of bedrooms
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 50)

### Example Request
```
GET /api/public/properties?location=Cairo&minPrice=1000&maxPrice=2000&bedrooms=3&page=1&limit=10
```

### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "id": "507f1f77bcf86cd799439011",
      "title": "Luxury Apartment in Cairo",
      "description": "Beautiful 3-bedroom apartment...",
      "location": "Cairo",
      "address": "123 Nile Street, Cairo",
      "price": 1500,
      "bedrooms": 3,
      "bathrooms": 2,
      "amenities": ["WiFi", "Pool", "Gym"],
      "images": ["/uploads/rentals/property-123.jpg"],
      "availability": true,
      "createdAt": "2024-01-15T10:30:45.123Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

---

## 2.3 Get Single Public Property

**GET** `/api/public/properties/:id`

Get details of a single property by ID.

### Parameters
- `id` (path) - Property MongoDB ObjectId

### Example Request
```
GET /api/public/properties/507f1f77bcf86cd799439011
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "id": "507f1f77bcf86cd799439011",
    "title": "Luxury Apartment in Cairo",
    "description": "Beautiful 3-bedroom apartment...",
    "location": "Cairo",
    "address": "123 Nile Street, Cairo",
    "price": 1500,
    "bedrooms": 3,
    "bathrooms": 2,
    "amenities": ["WiFi", "Pool", "Gym"],
    "images": ["/uploads/rentals/property-123.jpg"],
    "availability": true,
    "ownerName": "Admin",
    "ownerEmail": "admin@example.com",
    "ownerPhone": "+201234567890",
    "createdAt": "2024-01-15T10:30:45.123Z"
  }
}
```

### Error Response (404 Not Found)
```json
{
  "success": false,
  "error": "Property not found"
}
```

---

# 🏢 3. Properties (Admin) Collection

**🔒 Requires Authentication**

## 3.1 List All Properties (Admin)

**GET** `/api/admin/properties`

Get all properties with admin filters and pagination.

### Query Parameters
- `availability` (boolean) - Filter by availability (true/false)
- `location` (string) - Filter by location
- `minPrice` (number) - Minimum price
- `maxPrice` (number) - Maximum price
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 10)

### Example Request
```
GET /api/admin/properties?availability=true&page=1&limit=10
```

### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Luxury Apartment in Cairo",
      "description": "Beautiful 3-bedroom apartment...",
      "location": "Cairo",
      "address": "123 Nile Street, Cairo",
      "price": 1500,
      "bedrooms": 3,
      "bathrooms": 2,
      "amenities": ["WiFi", "Pool", "Gym"],
      "images": ["/uploads/rentals/property-123.jpg"],
      "availability": true,
      "ownerName": "Admin",
      "ownerEmail": "admin@example.com",
      "ownerPhone": "+201234567890",
      "createdAt": "2024-01-15T10:30:45.123Z",
      "updatedAt": "2024-01-15T10:30:45.123Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

---

## 3.2 Get Single Property (Admin)

**GET** `/api/admin/properties/:id`

Get details of a single property (admin view).

### Parameters
- `id` (path) - Property MongoDB ObjectId

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Luxury Apartment in Cairo",
    "description": "Beautiful 3-bedroom apartment...",
    "location": "Cairo",
    "address": "123 Nile Street, Cairo",
    "price": 1500,
    "bedrooms": 3,
    "bathrooms": 2,
    "amenities": ["WiFi", "Pool", "Gym"],
    "images": ["/uploads/rentals/property-123.jpg"],
    "availability": true,
    "ownerName": "Admin",
    "ownerEmail": "admin@example.com",
    "ownerPhone": "+201234567890",
    "createdAt": "2024-01-15T10:30:45.123Z",
    "updatedAt": "2024-01-15T10:30:45.123Z"
  }
}
```

---

## 3.3 Create Property

**POST** `/api/admin/properties`

Create a new property with image upload.

### Content-Type
```
multipart/form-data
```

### Form Data Fields
- `title` (text, required) - Property title
- `description` (text, required) - Property description
- `location` (text, required) - Location/city
- `address` (text, required) - Full address
- `price` (number, required) - Price per night/month
- `bedrooms` (number) - Number of bedrooms
- `bathrooms` (number) - Number of bathrooms
- `amenities` (text) - Comma-separated amenities
- `ownerName` (text) - Owner name
- `ownerEmail` (text) - Owner email
- `ownerPhone` (text) - Owner phone
- `availability` (boolean) - Availability status
- `images` (file[]) - Property images (max 10, max 10MB each)

### Example Form Data
```
title: Luxury Apartment in Cairo
description: Beautiful 3-bedroom apartment with Nile view
location: Cairo
address: 123 Nile Street, Cairo, Egypt
price: 1500
bedrooms: 3
bathrooms: 2
amenities: WiFi,Pool,Gym,Parking
ownerName: John Doe
ownerEmail: owner@example.com
ownerPhone: +201234567890
availability: true
images: [file1.jpg, file2.jpg]
```

### Response (201 Created)
```json
{
  "success": true,
  "message": "Property created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Luxury Apartment in Cairo",
    "description": "Beautiful 3-bedroom apartment...",
    "location": "Cairo",
    "address": "123 Nile Street, Cairo",
    "price": 1500,
    "bedrooms": 3,
    "bathrooms": 2,
    "amenities": ["WiFi", "Pool", "Gym", "Parking"],
    "images": [
      "/uploads/rentals/property-1234567890-123456789.jpg",
      "/uploads/rentals/property-1234567890-987654321.jpg"
    ],
    "availability": true,
    "ownerName": "John Doe",
    "ownerEmail": "owner@example.com",
    "ownerPhone": "+201234567890",
    "createdAt": "2024-01-15T10:30:45.123Z",
    "updatedAt": "2024-01-15T10:30:45.123Z"
  }
}
```

---

## 3.4 Update Property

**PUT** `/api/admin/properties/:id`

Update an existing property.

### Parameters
- `id` (path) - Property MongoDB ObjectId

### Content-Type
```
multipart/form-data
```

### Form Data Fields (All Optional)
- `title` (text) - Property title
- `description` (text) - Property description
- `location` (text) - Location/city
- `address` (text) - Full address
- `price` (number) - Price per night/month
- `bedrooms` (number) - Number of bedrooms
- `bathrooms` (number) - Number of bathrooms
- `amenities` (text) - Comma-separated amenities
- `ownerName` (text) - Owner name
- `ownerEmail` (text) - Owner email
- `ownerPhone` (text) - Owner phone
- `availability` (boolean) - Availability status
- `existingImages` (text[]) - Array of existing image URLs to keep
- `images` (file[]) - New property images to add

### Response (200 OK)
```json
{
  "success": true,
  "message": "Property updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Updated Luxury Apartment",
    "description": "Updated description...",
    "location": "Cairo",
    "price": 1800,
    "bedrooms": 4,
    "bathrooms": 3,
    "amenities": ["WiFi", "Pool", "Gym", "Parking", "AC"],
    "images": [
      "/uploads/rentals/property-new-123.jpg"
    ],
    "availability": true,
    "updatedAt": "2024-01-15T12:00:00.000Z"
  }
}
```

---

## 3.5 Delete Property

**DELETE** `/api/admin/properties/:id`

Delete a property and its associated images.

### Parameters
- `id` (path) - Property MongoDB ObjectId

### Response (200 OK)
```json
{
  "success": true,
  "message": "Property deleted successfully"
}
```

### Error Response (404 Not Found)
```json
{
  "success": false,
  "error": "Property not found"
}
```

---

# 👥 4. Users (Admin) Collection

**🔒 Requires Authentication**

## 4.1 List All Users

**GET** `/api/admin/users`

Get all users with search and pagination.

### Query Parameters
- `search` (string) - Search by email or display name
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 10)

### Example Request
```
GET /api/admin/users?search=john&page=1&limit=10
```

### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "googleId": null,
      "email": "john@example.com",
      "displayName": "John Doe",
      "phoneNumber": "+1234567890",
      "photoURL": "",
      "role": "user",
      "authProvider": "email",
      "isEmailVerified": false,
      "createdAt": "2024-01-15T10:30:45.123Z",
      "updatedAt": "2024-01-15T10:30:45.123Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

---

## 4.2 Get Single User with Bookings

**GET** `/api/admin/users/:id`

Get user details including their bookings.

### Parameters
- `id` (path) - User MongoDB ObjectId

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "john@example.com",
      "displayName": "John Doe",
      "phoneNumber": "+1234567890",
      "role": "user",
      "authProvider": "email",
      "createdAt": "2024-01-15T10:30:45.123Z"
    },
    "bookings": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "propertyId": {
          "_id": "507f1f77bcf86cd799439013",
          "title": "Luxury Apartment in Cairo"
        },
        "userId": "507f1f77bcf86cd799439011",
        "checkIn": "2024-02-01T00:00:00.000Z",
        "checkOut": "2024-02-05T00:00:00.000Z",
        "totalPrice": 6000,
        "status": "confirmed",
        "createdAt": "2024-01-15T10:30:45.123Z"
      }
    ]
  }
}
```

---

## 4.3 Delete User

**DELETE** `/api/admin/users/:id`

Delete a user from the system.

### Parameters
- `id` (path) - User MongoDB ObjectId

### Response (200 OK)
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

# 📅 5. Bookings (Admin) Collection

**🔒 Requires Authentication**

## 5.1 List All Bookings

**GET** `/api/admin/bookings`

Get all bookings with filters and pagination.

### Query Parameters
- `status` (string) - Filter by status (pending|confirmed|cancelled|all)
- `propertyId` (string) - Filter by property ID
- `userId` (string) - Filter by user ID
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 10)

### Example Request
```
GET /api/admin/bookings?status=confirmed&page=1&limit=10
```

### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "propertyId": {
        "_id": "507f1f77bcf86cd799439013",
        "title": "Luxury Apartment in Cairo"
      },
      "userId": {
        "_id": "507f1f77bcf86cd799439011",
        "displayName": "John Doe",
        "email": "john@example.com"
      },
      "checkIn": "2024-02-01T00:00:00.000Z",
      "checkOut": "2024-02-05T00:00:00.000Z",
      "guests": 4,
      "totalPrice": 6000,
      "status": "confirmed",
      "createdAt": "2024-01-15T10:30:45.123Z",
      "updatedAt": "2024-01-15T10:30:45.123Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

---

## 5.2 Get Single Booking

**GET** `/api/admin/bookings/:id`

Get detailed information about a specific booking.

### Parameters
- `id` (path) - Booking MongoDB ObjectId

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "propertyId": {
      "_id": "507f1f77bcf86cd799439013",
      "title": "Luxury Apartment in Cairo",
      "location": "Cairo",
      "price": 1500,
      "images": ["/uploads/rentals/property-123.jpg"]
    },
    "userId": {
      "_id": "507f1f77bcf86cd799439011",
      "displayName": "John Doe",
      "email": "john@example.com",
      "phoneNumber": "+1234567890"
    },
    "checkIn": "2024-02-01T00:00:00.000Z",
    "checkOut": "2024-02-05T00:00:00.000Z",
    "guests": 4,
    "totalPrice": 6000,
    "status": "confirmed",
    "createdAt": "2024-01-15T10:30:45.123Z",
    "updatedAt": "2024-01-15T10:30:45.123Z"
  }
}
```

---

## 5.3 Update Booking Status

**PATCH** `/api/admin/bookings/:id/status`

Update the status of a booking.

### Parameters
- `id` (path) - Booking MongoDB ObjectId

### Request Body (JSON)
```json
{
  "status": "confirmed"
}
```

### Valid Status Values
- `pending`
- `confirmed`
- `cancelled`

### Response (200 OK)
```json
{
  "success": true,
  "message": "Booking status updated to confirmed",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "propertyId": {
      "_id": "507f1f77bcf86cd799439013",
      "title": "Luxury Apartment in Cairo"
    },
    "userId": {
      "_id": "507f1f77bcf86cd799439011",
      "displayName": "John Doe",
      "email": "john@example.com"
    },
    "status": "confirmed",
    "updatedAt": "2024-01-15T12:00:00.000Z"
  }
}
```

---

## 5.4 Delete Booking

**DELETE** `/api/admin/bookings/:id`

Delete a booking from the system.

### Parameters
- `id` (path) - Booking MongoDB ObjectId

### Response (200 OK)
```json
{
  "success": true,
  "message": "Booking deleted successfully"
}
```

---

# 📊 6. Dashboard (Admin) Collection

**🔒 Requires Authentication**

## 6.1 Get Dashboard Statistics

**GET** `/api/admin/dashboard/stats`

Get comprehensive statistics for the admin dashboard.

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "totalProperties": 50,
    "totalUsers": 100,
    "totalBookings": 250,
    "pendingBookings": 15,
    "confirmedBookings": 200,
    "cancelledBookings": 35,
    "totalRevenue": 375000
  }
}
```

---

## 6.2 Get Recent Bookings

**GET** `/api/admin/dashboard/recent-bookings`

Get most recent bookings for dashboard overview.

### Query Parameters
- `limit` (number) - Number of bookings to return (default: 5)

### Example Request
```
GET /api/admin/dashboard/recent-bookings?limit=10
```

### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "propertyId": {
        "_id": "507f1f77bcf86cd799439013",
        "title": "Luxury Apartment in Cairo"
      },
      "userId": {
        "_id": "507f1f77bcf86cd799439011",
        "displayName": "John Doe",
        "email": "john@example.com"
      },
      "checkIn": "2024-02-01T00:00:00.000Z",
      "checkOut": "2024-02-05T00:00:00.000Z",
      "totalPrice": 6000,
      "status": "pending",
      "createdAt": "2024-01-15T10:30:45.123Z"
    }
  ]
}
```

---

# 📝 Common Response Codes

## Success Codes
- `200 OK` - Request succeeded
- `201 Created` - Resource created successfully

## Client Error Codes
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Authenticated but no permission
- `404 Not Found` - Resource not found

## Server Error Codes
- `500 Internal Server Error` - Server error

---

# 🔧 Postman Setup Instructions

## 1. Create New Collection

1. Open Postman
2. Click "New" → "Collection"
3. Name it "Sisterhood Style Rentals API"

## 2. Set Collection Variables

1. Click on your collection
2. Go to "Variables" tab
3. Add these variables:

| Variable | Initial Value | Current Value |
|----------|--------------|---------------|
| baseUrl | http://localhost:3000 | http://localhost:3000 |

## 3. Configure Cookie Management

For authentication to work:

1. Go to Settings (⚙️ icon)
2. Enable "Automatically follow redirects"
3. Enable "Send cookies"
4. Disable "SSL certificate verification" (for localhost only)

## 4. Authentication Flow

### Step 1: Register or Login
```
POST {{baseUrl}}/api/auth/register
or
POST {{baseUrl}}/api/auth/login
```

### Step 2: Session Cookie Saved
Postman automatically saves the session cookie

### Step 3: Make Authenticated Requests
All subsequent requests to `/api/admin/*` will include the session cookie

## 5. Testing Workflow

### Scenario 1: User Registration & Profile Update
1. POST `/api/auth/register` - Create account
2. GET `/api/auth/me` - Verify account created
3. PUT `/api/auth/profile` - Update profile
4. POST `/api/auth/change-password` - Change password
5. POST `/api/auth/logout` - Logout

### Scenario 2: Property Management
1. POST `/api/auth/login` - Login
2. POST `/api/admin/properties` - Create property
3. GET `/api/admin/properties` - List properties
4. PUT `/api/admin/properties/:id` - Update property
5. DELETE `/api/admin/properties/:id` - Delete property

### Scenario 3: Booking Management
1. GET `/api/admin/bookings?status=pending` - Get pending bookings
2. PATCH `/api/admin/bookings/:id/status` - Confirm booking
3. GET `/api/admin/dashboard/stats` - View updated stats

---

# 🧪 Example Test Scripts

## Auto-Save User ID After Login

Add to Tests tab of login request:

```javascript
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.collectionVariables.set("userId", jsonData.user.id);
    console.log("User ID saved:", jsonData.user.id);
}
```

## Auto-Save Property ID After Creation

Add to Tests tab of create property request:

```javascript
if (pm.response.code === 201) {
    const jsonData = pm.response.json();
    pm.collectionVariables.set("propertyId", jsonData.data._id);
    console.log("Property ID saved:", jsonData.data._id);
}
```

## Verify Response Status

Add to Tests tab of any request:

```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has success property", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('success');
    pm.expect(jsonData.success).to.be.true;
});
```

---

# 📋 Import/Export

## Export Collection

1. Click "..." on your collection
2. Click "Export"
3. Choose "Collection v2.1"
4. Save as `Sisterhood_Style_Rentals_API.postman_collection.json`

## Share with Team

Send the exported JSON file to team members who can import it into their Postman.

---

# 🔒 Security Notes

1. **Never commit credentials** - Don't save passwords in Postman
2. **Use environment variables** - For sensitive data
3. **HTTPS in production** - Always use HTTPS for production API
4. **Token expiration** - Sessions expire after 7 days
5. **Rate limiting** - Consider adding rate limiting in production

---

# 📚 Additional Resources

- Backend Documentation: See `admin-console/routes/ROUTES_STRUCTURE.md`
- MongoDB Schema: See `admin-console/DATA_SCHEMA_REFERENCE.md`
- Authentication Guide: See `MONGODB_FIRST_AUTH.md`

---

**Created:** January 2024  
**API Version:** 1.0  
**Base URL:** http://localhost:3000

