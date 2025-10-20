# Admin Console Route Map

## Visual Route Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        Admin Console Server                              │
│                      http://localhost:3000                               │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    │   app.js        │
                    │   Express App   │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐  ┌───────────────┐  ┌──────────────────┐
│  authRoutes   │  │  adminRoutes  │  │   apiRoutes      │
│   /auth/*     │  │      /*       │  │    /api/*        │
└───────┬───────┘  └───────┬───────┘  └────────┬─────────┘
        │                  │                    │
        │                  │                    │
┌───────┴───────┐  ┌───────┴───────┐  ┌────────┴─────────┐
│               │  │               │  │                  │
│  Public       │  │  Protected    │  │  Protected       │
│  Routes       │  │  by           │  │  by              │
│               │  │  isAuth       │  │  isAuth          │
└───────┬───────┘  └───────┬───────┘  └────────┬─────────┘
        │                  │                    │
        │                  │                    │
        ▼                  ▼                    ▼
```

---

## 🔐 Authentication Routes (`/auth`)

**File:** `routes/authRoutes.js`  
**Controller:** `authController.js`

```
/auth
  │
  ├── GET  /login      [Public] ──→ Show login page
  │                                   └─→ views/auth/login.ejs
  │
  ├── POST /login      [Public] ──→ Handle authentication
  │                                   ├─→ Validate credentials
  │                                   ├─→ Create session
  │                                   └─→ Redirect to dashboard
  │
  └── GET  /logout     [Public] ──→ Destroy session
                                      └─→ Redirect to login
```

---

## 📊 Dashboard Routes (`/`)

### Web Interface
**File:** `routes/adminRoutes.js`  
**Controller:** `dashboardController.js`

```
/
  │
  └── GET  /           [Protected] ──→ Dashboard page
                                        ├─→ Fetch statistics
                                        ├─→ Fetch recent bookings
                                        └─→ views/dashboard.ejs
```

### API Interface
**File:** `routes/apiRoutes.js`

```
/api/dashboard
  │
  ├── GET  /stats                [Protected] ──→ Statistics JSON
  │                                               └─→ { totalProperties, totalUsers, ... }
  │
  └── GET  /recent-bookings      [Protected] ──→ Recent bookings JSON
                                                  └─→ [ { booking1 }, { booking2 }, ... ]
```

---

## 🏠 Property Routes

### Web Interface (`/properties`)
**File:** `routes/adminRoutes.js`  
**Controller:** `propertyController.js`

```
/properties
  │
  ├── GET  /                     [Protected] ──→ List all properties
  │                                               └─→ views/properties/index.ejs
  │
  ├── GET  /create               [Protected] ──→ Create form
  │                                               └─→ views/properties/create.ejs
  │
  ├── POST /create               [Protected] ──→ Submit new property
  │   │                                           ├─→ Upload images (multer)
  │   │                                           ├─→ Save to database
  │   │                                           └─→ Redirect to /properties
  │   │
  │   └── FormData:
  │         - title, description, location, address
  │         - price, bedrooms, bathrooms, amenities
  │         - images[] (max 10, 10MB each)
  │
  ├── GET  /:id/edit             [Protected] ──→ Edit form
  │                                               ├─→ Fetch property
  │                                               └─→ views/properties/edit.ejs
  │
  ├── POST /:id/edit             [Protected] ──→ Update property
  │   │                                           ├─→ Handle image updates
  │   │                                           ├─→ Delete removed images
  │   │                                           ├─→ Update database
  │   │                                           └─→ Redirect to /properties
  │   │
  │   └── FormData:
  │         - Same as create
  │         - existingImages[] (images to keep)
  │
  └── POST /:id/delete           [Protected] ──→ Delete property
                                                  ├─→ Delete images from disk
                                                  ├─→ Delete from database
                                                  └─→ Redirect to /properties
```

### API Interface (`/api/properties`)
**File:** `routes/apiRoutes.js`

```
/api/properties
  │
  ├── GET  /                     [Protected] ──→ List properties JSON
  │   │                                           └─→ { success, data[], pagination }
  │   │
  │   └── Query params:
  │         - page, limit (pagination)
  │         - availability, location (filters)
  │         - minPrice, maxPrice (price range)
  │
  ├── GET  /:id                  [Protected] ──→ Get property JSON
  │                                               └─→ { success, data: {...} }
  │
  ├── POST /                     [Protected] ──→ Create property JSON
  │   │                                           └─→ { success, message, data }
  │   │
  │   └── FormData: (same as web interface)
  │
  ├── PUT  /:id                  [Protected] ──→ Update property JSON
  │   │                                           └─→ { success, message, data }
  │   │
  │   └── FormData: (same as web interface)
  │
  └── DELETE /:id                [Protected] ──→ Delete property JSON
                                                  └─→ { success, message }
```

---

## 👥 User Routes

### Web Interface (`/users`)
**File:** `routes/adminRoutes.js`  
**Controller:** `userController.js`

```
/users
  │
  ├── GET  /                     [Protected] ──→ List all users
  │                                               └─→ views/users/index.ejs
  │
  ├── GET  /:id                  [Protected] ──→ View user details
  │                                               ├─→ Fetch user
  │                                               ├─→ Fetch user's bookings
  │                                               └─→ views/users/view.ejs
  │
  └── POST /:id/delete           [Protected] ──→ Delete user
                                                  ├─→ Delete from database
                                                  └─→ Redirect to /users
```

### API Interface (`/api/users`)
**File:** `routes/apiRoutes.js`

```
/api/users
  │
  ├── GET  /                     [Protected] ──→ List users JSON
  │   │                                           └─→ { success, data[], pagination }
  │   │
  │   └── Query params:
  │         - page, limit (pagination)
  │         - search (by email or name)
  │
  ├── GET  /:id                  [Protected] ──→ Get user JSON
  │                                               └─→ { success, data: { user, bookings[] } }
  │
  └── DELETE /:id                [Protected] ──→ Delete user JSON
                                                  └─→ { success, message }
```

---

## 📅 Booking Routes

### Web Interface (`/bookings`)
**File:** `routes/adminRoutes.js`  
**Controller:** `bookingController.js`

```
/bookings
  │
  ├── GET  /                     [Protected] ──→ List all bookings
  │   │                                           └─→ views/bookings/index.ejs
  │   │
  │   └── Query params:
  │         - status (pending/confirmed/cancelled/all)
  │
  ├── GET  /:id                  [Protected] ──→ View booking details
  │                                               ├─→ Fetch booking
  │                                               ├─→ Populate property & user
  │                                               └─→ views/bookings/view.ejs
  │
  └── POST /:id/status           [Protected] ──→ Update booking status
      │                                           ├─→ Validate status
      │                                           ├─→ Update database
      │                                           └─→ Redirect to /bookings/:id
      │
      └── Body: { status: "pending" | "confirmed" | "cancelled" }
```

### API Interface (`/api/bookings`)
**File:** `routes/apiRoutes.js`

```
/api/bookings
  │
  ├── GET  /                     [Protected] ──→ List bookings JSON
  │   │                                           └─→ { success, data[], pagination }
  │   │
  │   └── Query params:
  │         - page, limit (pagination)
  │         - status (filter)
  │         - propertyId, userId (filters)
  │
  ├── GET  /:id                  [Protected] ──→ Get booking JSON
  │                                               └─→ { success, data: {...} }
  │
  ├── PATCH /:id/status          [Protected] ──→ Update status JSON
  │   │                                           └─→ { success, message, data }
  │   │
  │   └── JSON Body: { status: "pending" | "confirmed" | "cancelled" }
  │
  └── DELETE /:id                [Protected] ──→ Delete booking JSON
                                                  └─→ { success, message }
```

---

## 🔒 Middleware Flow

### Authentication Flow

```
Request
  │
  ├─→ /auth/login              (Skip auth check)
  │     │
  │     ├─→ isNotAuthenticated
  │     │     │
  │     │     ├─→ Is logged in? → Redirect to /
  │     │     └─→ Not logged in? → Continue
  │     │
  │     └─→ Controller
  │
  └─→ Any other route          (Require auth)
        │
        ├─→ isAuthenticated
        │     │
        │     ├─→ Has session? → Continue
        │     │     │
        │     │     ├─→ Fetch admin from DB
        │     │     └─→ Attach to req.admin
        │     │
        │     └─→ No session? → Redirect to /auth/login
        │
        └─→ Controller
```

### File Upload Flow (Properties)

```
POST /properties/create
  │
  ├─→ isAuthenticated
  │
  ├─→ multer.array('images', 10)
  │     │
  │     ├─→ Validate file type (images only)
  │     ├─→ Validate file size (max 10MB)
  │     ├─→ Save to public/uploads/rentals/
  │     └─→ Attach files to req.files
  │
  └─→ propertyController.postCreateProperty
        │
        ├─→ Process form data
        ├─→ Get image paths from req.files
        ├─→ Save to database
        └─→ Redirect or return JSON
```

---

## 📦 Data Flow

### Creating a Property

```
1. Client Request
   └─→ POST /properties/create
       └─→ FormData with images

2. Server Processing
   ├─→ Authentication middleware
   ├─→ Multer (file upload)
   │   └─→ Saves files to disk
   ├─→ Controller
   │   ├─→ Validate input
   │   ├─→ Process data
   │   └─→ Create Rental document
   └─→ MongoDB
       └─→ Save document

3. Response
   ├─→ Web: Redirect to /properties
   └─→ API: JSON { success, data }
```

### Viewing Bookings

```
1. Client Request
   └─→ GET /bookings?status=confirmed

2. Server Processing
   ├─→ Authentication middleware
   ├─→ Controller
   │   ├─→ Build query from params
   │   ├─→ Fetch from MongoDB
   │   │   └─→ Populate property & user
   │   └─→ Format data
   └─→ Response

3. Response
   ├─→ Web: Render EJS template
   └─→ API: JSON { success, data[], pagination }
```

---

## 🗄️ Database Collections

```
MongoDB: rental-admin
  │
  ├─→ admins
  │     └─→ { _id, name, email, password (hashed), createdAt }
  │
  ├─→ users
  │     └─→ { _id, email, displayName, phoneNumber, profilePicture, createdAt }
  │
  ├─→ rentals (properties)
  │     └─→ { _id, title, description, location, address, price,
  │            bedrooms, bathrooms, amenities[], images[],
  │            ownerName, ownerEmail, ownerPhone, availability, createdAt }
  │
  └─→ bookings
        └─→ { _id, propertyId (ref), userId (ref), checkIn, checkOut,
               guests, status, totalPrice, specialRequests,
               cleaningService, airportPickup, earlyCheckIn, createdAt }
```

---

## 📁 File Structure

```
admin-console/
├── app.js                              # Main application
│   ├─→ Loads routes
│   ├─→ Configures middleware
│   └─→ Starts server
│
├── routes/
│   ├── authRoutes.js                  # /auth/*
│   ├── adminRoutes.js                 # /* (web interface)
│   └── apiRoutes.js                   # /api/* (REST API)
│
├── controllers/
│   ├── authController.js              # Login/Logout
│   ├── dashboardController.js         # Dashboard logic
│   ├── propertyController.js          # Property CRUD
│   ├── userController.js              # User management
│   └── bookingController.js           # Booking management
│
├── middleware/
│   └── authMiddleware.js              # Authentication checks
│
├── models/
│   ├── Admin.js                       # Admin schema
│   ├── User.js                        # User schema
│   ├── Rental.js                      # Property schema
│   └── Booking.js                     # Booking schema
│
├── views/                             # EJS templates
│   ├── auth/
│   │   └── login.ejs
│   ├── dashboard.ejs
│   ├── properties/
│   │   ├── index.ejs
│   │   ├── create.ejs
│   │   └── edit.ejs
│   ├── users/
│   │   ├── index.ejs
│   │   └── view.ejs
│   ├── bookings/
│   │   ├── index.ejs
│   │   └── view.ejs
│   └── partials/
│       ├── header.ejs
│       └── footer.ejs
│
└── public/
    ├── css/
    │   └── style.css
    └── uploads/
        └── rentals/                   # Property images
            └── property-*.jpg
```

---

## 🚀 Request Examples

### Example 1: Web Interface - Create Property

```
Browser → POST /properties/create
          FormData:
            - title: "Beach House"
            - price: 1500
            - images: [file1.jpg, file2.jpg]
               ↓
          isAuthenticated ✓
               ↓
          multer (save images)
               ↓
          propertyController.postCreateProperty
               ↓
          Save to MongoDB
               ↓
          302 Redirect → /properties
```

### Example 2: API - List Users

```
Client → GET /api/users?page=1&limit=10&search=john
            ↓
         isAuthenticated ✓
            ↓
         Build query
            ↓
         User.find(query).skip().limit()
            ↓
         JSON Response:
         {
           "success": true,
           "data": [ {...}, {...} ],
           "pagination": { page: 1, total: 42, ... }
         }
```

### Example 3: Update Booking Status

```
Client → PATCH /api/bookings/123/status
         JSON: { "status": "confirmed" }
            ↓
         isAuthenticated ✓
            ↓
         Validate status ✓
            ↓
         Booking.findByIdAndUpdate(123, { status: "confirmed" })
            ↓
         JSON Response:
         {
           "success": true,
           "message": "Booking status updated to confirmed",
           "data": { ...updated booking... }
         }
```

---

## 🔄 Complete Request/Response Cycle

```
┌──────────────┐
│   Client     │
└──────┬───────┘
       │ HTTP Request
       ▼
┌──────────────────────────────┐
│   Express App (app.js)       │
│   Port: 3000                 │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│   Route Matching             │
│   /auth/*    → authRoutes    │
│   /api/*     → apiRoutes     │
│   /*         → adminRoutes   │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│   Middleware Stack           │
│   1. CORS                    │
│   2. Body Parser             │
│   3. Session                 │
│   4. Flash Messages          │
│   5. Authentication          │
│   6. Multer (if upload)      │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│   Controller Function        │
│   - Process request          │
│   - Interact with database   │
│   - Format response          │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│   Database (MongoDB)         │
│   - Query/Update data        │
│   - Return results           │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│   Response Generation        │
│   Web:  EJS Template → HTML  │
│   API:  Data → JSON          │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────┐
│   Client     │
│   (Response) │
└──────────────┘
```

---

**This route map provides a complete visual overview of all routes, their flow, and how they interact with the system.**

*Last Updated: October 2025*

