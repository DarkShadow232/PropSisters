# Routes Structure

This directory contains all the API routes for the admin console, now organized by entity for better maintainability.

## Files Overview

### Core Route Files

#### `apiRoutes.js` (Main Router)
- **Purpose**: Main entry point that aggregates all entity routes
- **Features**: 
  - Imports and mounts all entity-specific routes
  - Handles authentication middleware for admin routes
  - Provides both public and admin route mounting

#### `authRoutes.js`
- **Purpose**: Authentication-related routes
- **Routes**:
  - `GET /login` - Login page
  - `POST /login` - Login submission
  - `GET /logout` - Logout

#### `adminRoutes.js`
- **Purpose**: Admin console view routes (EJS templates)
- **Routes**:
  - Dashboard views
  - Property management views
  - User management views
  - Booking management views

---

## Entity-Specific API Routes

### `propertyRoutes.js`
**Properties CRUD operations**

#### Public Routes (No Auth Required)
- `GET /api/properties` - Get all properties (simple)
- `GET /api/public/properties` - Get available properties with filters
- `GET /api/public/properties/:id` - Get single property

#### Admin Routes (Auth Required)
- `GET /api/admin/properties` - List all properties with filters
- `GET /api/admin/properties/:id` - Get single property
- `POST /api/admin/properties` - Create new property (with image upload)
- `PUT /api/admin/properties/:id` - Update property (with image upload)
- `DELETE /api/admin/properties/:id` - Delete property

**Features**:
- Multer file upload handling for property images
- Image deletion on property update/delete
- Query filtering (location, price range, bedrooms, availability)
- Pagination support

---

### `userRoutes.js`
**User management operations**

#### Admin Routes (Auth Required)
- `GET /api/admin/users` - List all users with pagination
- `GET /api/admin/users/:id` - Get user details with bookings
- `DELETE /api/admin/users/:id` - Delete user

**Features**:
- Search functionality (email, display name)
- Pagination support
- User bookings included in detail view

---

### `bookingRoutes.js`
**Booking management operations**

#### Admin Routes (Auth Required)
- `GET /api/admin/bookings` - List all bookings with filters
- `GET /api/admin/bookings/:id` - Get booking details
- `PATCH /api/admin/bookings/:id/status` - Update booking status
- `DELETE /api/admin/bookings/:id` - Delete booking

**Features**:
- Status filtering (pending, confirmed, cancelled)
- Property and user filtering
- Pagination support
- Population of related property and user data

---

### `dashboardRoutes.js`
**Dashboard statistics and overview**

#### Admin Routes (Auth Required)
- `GET /api/admin/dashboard/stats` - Get dashboard statistics
- `GET /api/admin/dashboard/recent-bookings` - Get recent bookings

**Features**:
- Aggregated statistics (total properties, users, bookings)
- Revenue calculations
- Booking status breakdown
- Recent activity feed

---

## Route Mounting Structure

```
/api
├── /properties (public) → propertyRoutes
├── /public/properties → propertyRoutes
└── /admin (auth required)
    ├── /dashboard → dashboardRoutes
    ├── /properties → propertyRoutes
    ├── /users → userRoutes
    └── /bookings → bookingRoutes
```

## Authentication

- **Public routes**: No authentication required
- **Admin routes**: Protected by `isAuthenticated` middleware
- Middleware applied at `/api/admin` level for all admin routes

## Usage in app.js

```javascript
const apiRoutes = require('./routes/apiRoutes');
app.use('/api', apiRoutes);
```

This single import gives access to all API routes with proper authentication and organization.

## Benefits of This Structure

1. **Separation of Concerns**: Each entity has its own file
2. **Maintainability**: Easy to locate and modify specific routes
3. **Scalability**: Simple to add new entities or routes
4. **Reusability**: Route modules can be independently tested
5. **Clean Code**: Reduced file size, better readability
6. **Clear Organization**: Logical grouping of related functionality

