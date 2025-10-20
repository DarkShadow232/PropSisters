# Admin Console Routes - Quick Reference

## Authentication Routes (`/auth`)
| Method | Path | Controller | Description |
|--------|------|------------|-------------|
| GET | `/auth/login` | `authController.getLogin` | Show login page |
| POST | `/auth/login` | `authController.postLogin` | Handle login |
| GET | `/auth/logout` | `authController.logout` | Logout admin |

## Dashboard Routes (`/`)
| Method | Path | Controller | Description |
|--------|------|------------|-------------|
| GET | `/` | `dashboardController.getDashboard` | Show dashboard with stats |

## Property Routes (`/properties`)
| Method | Path | Controller | Description |
|--------|------|------------|-------------|
| GET | `/properties` | `propertyController.listProperties` | List all properties |
| GET | `/properties/create` | `propertyController.getCreateProperty` | Show create form |
| POST | `/properties/create` | `propertyController.postCreateProperty` | Create new property |
| GET | `/properties/:id/edit` | `propertyController.getEditProperty` | Show edit form |
| POST | `/properties/:id/edit` | `propertyController.postEditProperty` | Update property |
| POST | `/properties/:id/delete` | `propertyController.deleteProperty` | Delete property |

## User Routes (`/users`)
| Method | Path | Controller | Description |
|--------|------|------------|-------------|
| GET | `/users` | `userController.listUsers` | List all users |
| GET | `/users/:id` | `userController.viewUser` | View user details |
| POST | `/users/:id/delete` | `userController.deleteUser` | Delete user |

## Booking Routes (`/bookings`)
| Method | Path | Controller | Description |
|--------|------|------------|-------------|
| GET | `/bookings` | `bookingController.listBookings` | List all bookings (with filter) |
| GET | `/bookings/:id` | `bookingController.viewBooking` | View booking details |
| POST | `/bookings/:id/status` | `bookingController.updateBookingStatus` | Update booking status |

---

## Query Parameters

### Bookings List
- `?status=pending` - Filter pending bookings
- `?status=confirmed` - Filter confirmed bookings
- `?status=cancelled` - Filter cancelled bookings
- `?status=all` - Show all bookings (default)

---

## Request Body Examples

### Login
```json
{
  "email": "admin@example.com",
  "password": "yourpassword"
}
```

### Create/Update Property
```javascript
// FormData (multipart/form-data)
{
  title: "Beach House",
  description: "Beautiful beach house with ocean view",
  location: "Cairo",
  address: "123 Beach Street",
  price: 1500,
  bedrooms: 3,
  bathrooms: 2,
  amenities: "WiFi,Pool,Parking",
  ownerName: "John Doe",
  ownerEmail: "owner@example.com",
  ownerPhone: "+20123456789",
  availability: true,
  images: [File, File, ...] // Max 10 files, 10MB each
}
```

### Update Booking Status
```json
{
  "status": "confirmed" // or "pending", "cancelled"
}
```

---

## Response Types

| Route Type | Response | Content-Type |
|------------|----------|--------------|
| Authentication | Redirect | text/html |
| Dashboard | HTML Page | text/html |
| Properties | HTML Page | text/html |
| Users | HTML Page | text/html |
| Bookings | HTML Page | text/html |

---

## Authentication

All routes except `/auth/login` and `/auth/logout` require authentication.

**Session-based authentication:**
- Login sets session cookies
- All requests must include session cookie
- Logout destroys session

---

## Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 302 | Redirect (after POST operations) |
| 401 | Unauthorized (not logged in) |
| 404 | Not found |
| 500 | Server error |

---

## File Upload Limits

- **Max files per request:** 10
- **Max file size:** 10MB per file
- **Allowed types:** Images only (jpeg, jpg, png, gif, webp)
- **Field name:** `images`

---

## Flash Messages

Success and error messages are displayed using flash messages:
- Green banner: Success
- Red banner: Error

Messages are session-based and auto-dismiss after display.

