# Admin Console REST API Documentation

## Overview
This REST API provides programmatic access to the Sisterhood Style Rentals Admin Console. All endpoints return JSON responses and require authentication.

**Base URL:** `http://localhost:3000/api`

**Authentication:** Session-based (login first to get session cookie)

---

## Table of Contents
1. [Authentication](#authentication)
2. [Response Format](#response-format)
3. [Dashboard Endpoints](#dashboard-endpoints)
4. [Property Endpoints](#property-endpoints)
5. [User Endpoints](#user-endpoints)
6. [Booking Endpoints](#booking-endpoints)
7. [Error Codes](#error-codes)
8. [Example Requests](#example-requests)

---

## Authentication

### Login
Before using the API, you must authenticate:

```bash
POST /auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "yourpassword"
}
```

Save the session cookie from the response for subsequent requests.

---

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message description"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [ /* array of items */ ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "pages": 5
  }
}
```

---

## Dashboard Endpoints

### Get Dashboard Statistics
Get overall statistics for the dashboard.

**Endpoint:** `GET /api/dashboard/stats`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalProperties": 25,
    "totalUsers": 150,
    "totalBookings": 342,
    "pendingBookings": 12,
    "confirmedBookings": 298,
    "cancelledBookings": 32,
    "totalRevenue": 125000
  }
}
```

### Get Recent Bookings
Get most recent bookings for dashboard display.

**Endpoint:** `GET /api/dashboard/recent-bookings`

**Query Parameters:**
- `limit` (optional, default: 5) - Number of bookings to return

**Example:** `GET /api/dashboard/recent-bookings?limit=10`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "60d5ec49f1b2c8b1f8e4e1a1",
      "propertyId": {
        "_id": "60d5ec49f1b2c8b1f8e4e1a2",
        "title": "Beach House"
      },
      "userId": {
        "_id": "60d5ec49f1b2c8b1f8e4e1a3",
        "displayName": "John Doe",
        "email": "john@example.com"
      },
      "checkIn": "2025-11-01T00:00:00.000Z",
      "checkOut": "2025-11-05T00:00:00.000Z",
      "status": "confirmed",
      "totalPrice": 3000,
      "createdAt": "2025-10-11T10:30:00.000Z"
    }
  ]
}
```

---

## Property Endpoints

### List All Properties
Get all properties with optional filters and pagination.

**Endpoint:** `GET /api/properties`

**Query Parameters:**
- `availability` (optional) - Filter by availability (true/false)
- `location` (optional) - Filter by location (case-insensitive search)
- `minPrice` (optional) - Minimum price filter
- `maxPrice` (optional) - Maximum price filter
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Items per page

**Example:** `GET /api/properties?availability=true&location=Cairo&page=1&limit=10`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "60d5ec49f1b2c8b1f8e4e1a2",
      "title": "Beach House",
      "description": "Beautiful beach house with ocean view",
      "location": "Cairo",
      "address": "123 Beach Street",
      "price": 1500,
      "bedrooms": 3,
      "bathrooms": 2,
      "amenities": ["WiFi", "Pool", "Parking"],
      "images": ["/uploads/rentals/property-1234567890.jpg"],
      "availability": true,
      "createdAt": "2025-10-01T10:00:00.000Z"
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

### Get Single Property
Get details of a specific property.

**Endpoint:** `GET /api/properties/:id`

**Example:** `GET /api/properties/60d5ec49f1b2c8b1f8e4e1a2`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c8b1f8e4e1a2",
    "title": "Beach House",
    "description": "Beautiful beach house with ocean view",
    "location": "Cairo",
    "address": "123 Beach Street",
    "price": 1500,
    "bedrooms": 3,
    "bathrooms": 2,
    "amenities": ["WiFi", "Pool", "Parking"],
    "images": ["/uploads/rentals/property-1234567890.jpg"],
    "ownerName": "Admin",
    "ownerEmail": "admin@example.com",
    "ownerPhone": "+20123456789",
    "availability": true,
    "createdAt": "2025-10-01T10:00:00.000Z",
    "updatedAt": "2025-10-11T10:00:00.000Z"
  }
}
```

### Create Property
Create a new property.

**Endpoint:** `POST /api/properties`

**Content-Type:** `multipart/form-data`

**Form Data:**
- `title` (required) - Property title
- `description` (required) - Property description
- `location` (required) - Property location
- `address` (required) - Property address
- `price` (required) - Price per night
- `bedrooms` (optional) - Number of bedrooms
- `bathrooms` (optional) - Number of bathrooms
- `amenities` (optional) - Comma-separated string or array
- `ownerName` (optional) - Owner name
- `ownerEmail` (optional) - Owner email
- `ownerPhone` (optional) - Owner phone
- `availability` (optional) - true/false
- `images` (optional) - Up to 10 image files

**Example using cURL:**
```bash
curl -X POST http://localhost:3000/api/properties \
  -b cookies.txt \
  -F "title=Beach House" \
  -F "description=Beautiful beach house" \
  -F "location=Cairo" \
  -F "address=123 Beach St" \
  -F "price=1500" \
  -F "bedrooms=3" \
  -F "bathrooms=2" \
  -F "amenities=WiFi,Pool,Parking" \
  -F "images=@image1.jpg" \
  -F "images=@image2.jpg"
```

**Response:**
```json
{
  "success": true,
  "message": "Property created successfully",
  "data": {
    "_id": "60d5ec49f1b2c8b1f8e4e1a2",
    "title": "Beach House",
    "price": 1500,
    /* ... full property object ... */
  }
}
```

### Update Property
Update an existing property.

**Endpoint:** `PUT /api/properties/:id`

**Content-Type:** `multipart/form-data`

**Form Data:** Same as Create Property, plus:
- `existingImages` (optional) - Array of image URLs to keep

**Example:** `PUT /api/properties/60d5ec49f1b2c8b1f8e4e1a2`

**Response:**
```json
{
  "success": true,
  "message": "Property updated successfully",
  "data": {
    /* updated property object */
  }
}
```

### Delete Property
Delete a property and its images.

**Endpoint:** `DELETE /api/properties/:id`

**Example:** `DELETE /api/properties/60d5ec49f1b2c8b1f8e4e1a2`

**Response:**
```json
{
  "success": true,
  "message": "Property deleted successfully"
}
```

---

## User Endpoints

### List All Users
Get all users with pagination and search.

**Endpoint:** `GET /api/users`

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Items per page
- `search` (optional) - Search by email or name

**Example:** `GET /api/users?search=john&page=1&limit=20`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "60d5ec49f1b2c8b1f8e4e1a3",
      "email": "john@example.com",
      "displayName": "John Doe",
      "phoneNumber": "+20123456789",
      "profilePicture": "https://...",
      "createdAt": "2025-09-01T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

### Get Single User
Get user details with booking history.

**Endpoint:** `GET /api/users/:id`

**Example:** `GET /api/users/60d5ec49f1b2c8b1f8e4e1a3`

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "60d5ec49f1b2c8b1f8e4e1a3",
      "email": "john@example.com",
      "displayName": "John Doe",
      "phoneNumber": "+20123456789",
      "createdAt": "2025-09-01T10:00:00.000Z"
    },
    "bookings": [
      {
        "_id": "60d5ec49f1b2c8b1f8e4e1a1",
        "propertyId": {
          "_id": "60d5ec49f1b2c8b1f8e4e1a2",
          "title": "Beach House"
        },
        "checkIn": "2025-11-01T00:00:00.000Z",
        "checkOut": "2025-11-05T00:00:00.000Z",
        "status": "confirmed",
        "totalPrice": 3000
      }
    ]
  }
}
```

### Delete User
Delete a user account.

**Endpoint:** `DELETE /api/users/:id`

**Example:** `DELETE /api/users/60d5ec49f1b2c8b1f8e4e1a3`

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## Booking Endpoints

### List All Bookings
Get all bookings with filters and pagination.

**Endpoint:** `GET /api/bookings`

**Query Parameters:**
- `status` (optional) - Filter by status (pending/confirmed/cancelled/all)
- `propertyId` (optional) - Filter by property ID
- `userId` (optional) - Filter by user ID
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Items per page

**Example:** `GET /api/bookings?status=confirmed&page=1&limit=10`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "60d5ec49f1b2c8b1f8e4e1a1",
      "propertyId": {
        "_id": "60d5ec49f1b2c8b1f8e4e1a2",
        "title": "Beach House"
      },
      "userId": {
        "_id": "60d5ec49f1b2c8b1f8e4e1a3",
        "displayName": "John Doe",
        "email": "john@example.com"
      },
      "checkIn": "2025-11-01T00:00:00.000Z",
      "checkOut": "2025-11-05T00:00:00.000Z",
      "guests": 2,
      "status": "confirmed",
      "totalPrice": 3000,
      "specialRequests": "Early check-in please",
      "cleaningService": true,
      "airportPickup": false,
      "earlyCheckIn": true,
      "createdAt": "2025-10-11T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 298,
    "pages": 30
  }
}
```

### Get Single Booking
Get detailed booking information.

**Endpoint:** `GET /api/bookings/:id`

**Example:** `GET /api/bookings/60d5ec49f1b2c8b1f8e4e1a1`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c8b1f8e4e1a1",
    "propertyId": {
      /* full property object */
    },
    "userId": {
      /* full user object */
    },
    "checkIn": "2025-11-01T00:00:00.000Z",
    "checkOut": "2025-11-05T00:00:00.000Z",
    "guests": 2,
    "status": "confirmed",
    "totalPrice": 3000,
    "specialRequests": "Early check-in please",
    "cleaningService": true,
    "airportPickup": false,
    "earlyCheckIn": true,
    "createdAt": "2025-10-11T10:30:00.000Z"
  }
}
```

### Update Booking Status
Update the status of a booking.

**Endpoint:** `PATCH /api/bookings/:id/status`

**Content-Type:** `application/json`

**Request Body:**
```json
{
  "status": "confirmed"
}
```

**Valid statuses:** `pending`, `confirmed`, `cancelled`

**Example:** `PATCH /api/bookings/60d5ec49f1b2c8b1f8e4e1a1/status`

**Response:**
```json
{
  "success": true,
  "message": "Booking status updated to confirmed",
  "data": {
    /* updated booking object */
  }
}
```

### Delete Booking
Delete a booking.

**Endpoint:** `DELETE /api/bookings/:id`

**Example:** `DELETE /api/bookings/60d5ec49f1b2c8b1f8e4e1a1`

**Response:**
```json
{
  "success": true,
  "message": "Booking deleted successfully"
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created successfully |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Not logged in |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

---

## Example Requests

### JavaScript (Fetch API)

```javascript
// Login first
const loginResponse = await fetch('http://localhost:3000/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'yourpassword'
  }),
  credentials: 'include' // Important for session cookies
});

// Get properties
const propertiesResponse = await fetch('http://localhost:3000/api/properties?page=1&limit=10', {
  credentials: 'include' // Include session cookie
});

const data = await propertiesResponse.json();
console.log(data);

// Create property with FormData
const formData = new FormData();
formData.append('title', 'Beach House');
formData.append('description', 'Beautiful beach house');
formData.append('location', 'Cairo');
formData.append('address', '123 Beach St');
formData.append('price', '1500');
formData.append('images', fileInput.files[0]);

const createResponse = await fetch('http://localhost:3000/api/properties', {
  method: 'POST',
  body: formData,
  credentials: 'include'
});

// Update booking status
const updateResponse = await fetch('http://localhost:3000/api/bookings/60d5ec49f1b2c8b1f8e4e1a1/status', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    status: 'confirmed'
  }),
  credentials: 'include'
});
```

### Python (Requests)

```python
import requests

# Login
session = requests.Session()
login_response = session.post('http://localhost:3000/auth/login', json={
    'email': 'admin@example.com',
    'password': 'yourpassword'
})

# Get dashboard stats
stats_response = session.get('http://localhost:3000/api/dashboard/stats')
stats = stats_response.json()
print(stats)

# Get properties
properties_response = session.get('http://localhost:3000/api/properties', params={
    'page': 1,
    'limit': 10,
    'availability': 'true'
})
properties = properties_response.json()

# Create property with file upload
files = {
    'images': open('house1.jpg', 'rb')
}
data = {
    'title': 'Beach House',
    'description': 'Beautiful beach house',
    'location': 'Cairo',
    'address': '123 Beach St',
    'price': 1500,
    'bedrooms': 3,
    'bathrooms': 2,
    'amenities': 'WiFi,Pool,Parking'
}
create_response = session.post('http://localhost:3000/api/properties', 
                                files=files, data=data)

# Update booking status
update_response = session.patch('http://localhost:3000/api/bookings/60d5ec49f1b2c8b1f8e4e1a1/status',
                                json={'status': 'confirmed'})
```

### cURL

```bash
# Login and save cookies
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"yourpassword"}' \
  -c cookies.txt

# Get dashboard stats
curl -X GET http://localhost:3000/api/dashboard/stats \
  -b cookies.txt

# Get properties with filters
curl -X GET "http://localhost:3000/api/properties?availability=true&page=1&limit=10" \
  -b cookies.txt

# Create property
curl -X POST http://localhost:3000/api/properties \
  -b cookies.txt \
  -F "title=Beach House" \
  -F "description=Beautiful beach house" \
  -F "location=Cairo" \
  -F "address=123 Beach St" \
  -F "price=1500" \
  -F "images=@house1.jpg"

# Update booking status
curl -X PATCH http://localhost:3000/api/bookings/60d5ec49f1b2c8b1f8e4e1a1/status \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{"status":"confirmed"}'

# Delete property
curl -X DELETE http://localhost:3000/api/properties/60d5ec49f1b2c8b1f8e4e1a2 \
  -b cookies.txt
```

---

## Rate Limiting

Currently, there is no rate limiting implemented. Consider adding rate limiting in production:

```javascript
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', apiLimiter);
```

---

## CORS Configuration

For cross-origin requests, configure CORS in `app.js`:

```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://your-frontend-domain.com',
  credentials: true
}));
```

---

## Testing with Postman

1. Import the API endpoints into Postman
2. Create a Collection for "Admin Console API"
3. Use Tests tab to save cookies:
   ```javascript
   pm.test("Status code is 200", function () {
       pm.response.to.have.status(200);
   });
   ```
4. Enable cookie jar in Postman settings

---

## Security Considerations

1. **Always use HTTPS in production**
2. **Enable CSRF protection** for state-changing operations
3. **Implement rate limiting** to prevent abuse
4. **Validate and sanitize** all user inputs
5. **Use strong session secrets**
6. **Set proper CORS policies**
7. **Keep dependencies updated**

---

*Last Updated: October 2025*
