# Updated Implementation Plan: Full MongoDB Synchronization

## Executive Summary
This plan addresses three critical requirements:
1. **Frontend Dynamic Data**: Make all property cards load dynamically from MongoDB
2. **Admin Panel Fixes**: Fix edit/delete redirecting to login page
3. **Full Synchronization**: Ensure admin changes immediately reflect on frontend

---

## Current Architecture Analysis

### Admin Console (Backend)
- **Framework**: Express.js with EJS templates
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Express-session with MongoStore
- **Location**: `admin-console/` directory
- **Port**: 3000 (default)

### Frontend
- **Framework**: React with TypeScript
- **Current Data Source**: Hardcoded in `src/data/rentalData.ts`
- **API Integration**: Currently uses Firebase (but data is hardcoded)
- **Port**: 5173 (Vite dev server)

### Identified Issues

#### Issue 1: Frontend Using Hardcoded Data
- **File**: `src/data/rentalData.ts` contains static apartment data
- **File**: `src/pages/RentalsPage.tsx` imports from `rentalData.ts` (line 11)
- **Problem**: Changes in MongoDB don't reflect on frontend
- **Impact**: No dynamic data loading

#### Issue 2: Admin Edit/Delete Redirects to Login
- **Root Cause 1**: EJS template uses `property.id` instead of `property._id`
  - File: `admin-console/views/properties/index.ejs` (lines 79, 82)
  - MongoDB documents use `_id`, not `id`
  - Links become `/properties/undefined/edit`
  
- **Root Cause 2**: API routes require authentication for ALL endpoints
  - File: `admin-console/routes/apiRoutes.js` (line 39)
  - `router.use(isAuthenticated)` blocks public access
  - Frontend can't fetch public property data

#### Issue 3: No Real-time Synchronization
- Frontend doesn't poll or subscribe to MongoDB changes
- Admin changes require manual page refresh on frontend

---

## Detailed Implementation Plan

### Phase 1: Fix Admin Panel (High Priority)

#### Task 1.1: Fix MongoDB ID References in EJS Templates
**Problem**: EJS templates use `property.id` but MongoDB uses `_id`

**Files to Update**:
1. `admin-console/views/properties/index.ejs`
2. `admin-console/views/properties/edit.ejs` (if exists)
3. `admin-console/views/bookings/index.ejs`
4. `admin-console/views/bookings/view.ejs`

**Changes Required**:
```ejs
<!-- BEFORE (Line 79) -->
<a href="/properties/<%= property.id %>/edit" class="btn btn-outline-primary">

<!-- AFTER -->
<a href="/properties/<%= property._id %>/edit" class="btn btn-outline-primary">

<!-- BEFORE (Line 82) -->
<form action="/properties/<%= property.id %>/delete" method="POST">

<!-- AFTER -->
<form action="/properties/<%= property._id %>/delete" method="POST">
```

**Why This Works**:
- Mongoose documents have `_id` field by default
- Using `.lean()` in controllers preserves `_id` field
- Routes expect MongoDB ObjectId format

#### Task 1.2: Verify Session Configuration
**File**: `admin-console/app.js`

**Current Settings (Lines 36-49)**:
```javascript
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/rental-admin',
    touchAfter: 24 * 3600
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}));
```

**Verification Checklist**:
- ✅ Session stored in MongoDB (persistent)
- ✅ Cookie lasts 7 days
- ✅ httpOnly prevents XSS attacks
- ⚠️ **Action Required**: Ensure `.env` file has `SESSION_SECRET` set

**Additional Debugging**:
Add session debugging middleware after session setup:
```javascript
// Add after session middleware
app.use((req, res, next) => {
  console.log('Session ID:', req.sessionID);
  console.log('Session Data:', req.session);
  next();
});
```

#### Task 1.3: Add MongoDB ID Serialization
**Problem**: Controllers use `.lean()` which returns plain objects

**Solution**: Add ID mapping in controllers

**File**: `admin-console/controllers/propertyController.js`

**Update** (Line 6-11):
```javascript
// BEFORE
exports.listProperties = async (req, res) => {
  try {
    const properties = await Rental.find()
      .sort({ createdAt: -1 })
      .lean();

// AFTER
exports.listProperties = async (req, res) => {
  try {
    const properties = await Rental.find()
      .sort({ createdAt: -1 })
      .lean()
      .then(props => props.map(p => ({ ...p, id: p._id.toString() })));
```

**Alternative**: Use virtuals in Mongoose schema

**File**: `admin-console/models/Rental.js`

**Add after schema definition** (after line 69):
```javascript
// Add virtual for id
rentalSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    return ret;
  }
});

rentalSchema.set('toObject', { virtuals: true });
```

---

### Phase 2: Create Public API Endpoints

#### Task 2.1: Separate Public and Admin API Routes

**Current Problem**: All API routes require authentication (line 39 in `apiRoutes.js`)

**Solution**: Split routes into public and authenticated sections

**File**: `admin-console/routes/apiRoutes.js`

**Implementation**:
```javascript
// REMOVE this line (currently line 39):
// router.use(isAuthenticated);

// CREATE two route groups:

// ==================== PUBLIC API (No Auth Required) ====================

/**
 * GET /api/public/properties
 * Get all available properties (public access)
 */
router.get('/public/properties', async (req, res) => {
  try {
    const { location, minPrice, maxPrice, bedrooms, page = 1, limit = 20 } = req.query;
    
    const query = { availability: true }; // Only show available properties
    if (location) query.location = new RegExp(location, 'i');
    if (bedrooms) query.bedrooms = parseInt(bedrooms);
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [properties, total] = await Promise.all([
      Rental.find(query)
        .select('-__v') // Exclude version key
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean()
        .then(props => props.map(p => ({ ...p, id: p._id.toString() }))),
      Rental.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: properties,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Public properties error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch properties'
    });
  }
});

/**
 * GET /api/public/properties/:id
 * Get single property by ID (public access)
 */
router.get('/public/properties/:id', async (req, res) => {
  try {
    const property = await Rental.findById(req.params.id)
      .select('-__v')
      .lean()
      .then(p => p ? { ...p, id: p._id.toString() } : null);
    
    if (!property || !property.availability) {
      return res.status(404).json({
        success: false,
        error: 'Property not found or unavailable'
      });
    }

    res.json({
      success: true,
      data: property
    });
  } catch (error) {
    console.error('Get public property error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch property'
    });
  }
});

// ==================== ADMIN API (Auth Required) ====================
// Apply authentication middleware ONLY to admin routes
const adminRouter = express.Router();
adminRouter.use(isAuthenticated);

// Move all existing authenticated routes to adminRouter
// Dashboard, Properties CRUD, Users, Bookings, etc.

adminRouter.get('/dashboard/stats', async (req, res) => {
  // ... existing dashboard stats code
});

// ... all other admin routes

// Mount admin router
router.use('/admin', adminRouter);
```

**Result**:
- Public endpoints: `/api/public/properties`, `/api/public/properties/:id`
- Admin endpoints: `/api/admin/dashboard/stats`, `/api/admin/properties`, etc.
- Frontend can fetch without authentication
- Admin panel uses authenticated endpoints

#### Task 2.2: Enable CORS for Frontend Requests

**File**: `admin-console/app.js`

**Current CORS** (Lines 24-27):
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

**Verification**:
- ✅ Already configured for React dev server (port 5173)
- ⚠️ **Action Required**: Update `.env` with production frontend URL

**Production Configuration**:
```env
FRONTEND_URL=https://your-production-domain.com
```

---

### Phase 3: Update Frontend to Use MongoDB API

#### Task 3.1: Create MongoDB Property Service

**File**: `src/services/mongoPropertyService.ts` (CREATE NEW)

```typescript
// MongoDB Property Service
// Fetches property data from MongoDB via Express API

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface MongoProperty {
  _id: string;
  id: string;
  title: string;
  description: string;
  location: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  availability: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFilters {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  page?: number;
  limit?: number;
}

export interface PropertyResponse {
  success: boolean;
  data: MongoProperty[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Fetch all properties from MongoDB
 */
export const fetchPropertiesFromMongo = async (
  filters?: PropertyFilters
): Promise<PropertyResponse> => {
  try {
    const params = new URLSearchParams();
    if (filters?.location) params.append('location', filters.location);
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.bedrooms) params.append('bedrooms', filters.bedrooms.toString());
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await fetch(
      `${API_BASE_URL}/public/properties?${params.toString()}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching properties from MongoDB:', error);
    throw error;
  }
};

/**
 * Fetch single property by ID from MongoDB
 */
export const fetchPropertyByIdFromMongo = async (
  propertyId: string
): Promise<MongoProperty | null> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/public/properties/${propertyId}`
    );
    
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error('Error fetching property from MongoDB:', error);
    throw error;
  }
};

/**
 * Convert MongoDB property to frontend Apartment format
 */
export const convertMongoToApartment = (mongoProp: MongoProperty): any => {
  return {
    id: parseInt(mongoProp.id) || mongoProp._id,
    title: mongoProp.title,
    location: mongoProp.location,
    price: mongoProp.price,
    bedrooms: mongoProp.bedrooms,
    bathrooms: mongoProp.bathrooms,
    image: mongoProp.images?.[0] || '/placeholder.svg',
    images: mongoProp.images || [],
    amenities: mongoProp.amenities || [],
    description: mongoProp.description,
    availability: mongoProp.availability,
    owner: {
      name: mongoProp.ownerName || 'Property Sisters',
      phone: mongoProp.ownerPhone || '+201000474991',
      email: mongoProp.ownerEmail || 'info@propsisters.eg',
      responseTime: 'Usually responds within 1 hour',
      rating: 4.8,
    },
    reviews: [], // Can be populated from separate collection
    housekeepingOptions: [
      { service: 'Basic Cleaning', price: 2000, description: 'Vacuuming, dusting, bathroom cleaning' },
      { service: 'Deep Clean', price: 5000, description: 'Basic cleaning plus kitchen deep clean' },
      { service: 'Laundry Service', price: 1500, description: 'Washing and folding of linens' },
    ],
    googleAddress: mongoProp.address,
    googleMapsUrl: '', // Can be generated from address
    coordinates: { latitude: 0, longitude: 0 }, // Can be added to schema
  };
};
```

#### Task 3.2: Update RentalsPage to Use MongoDB

**File**: `src/pages/RentalsPage.tsx`

**Changes**:
```typescript
// BEFORE (Lines 11-12)
import { rentals } from "@/data/rentalData";
import { Apartment } from "@/data/rentalData";

// AFTER
import { Apartment } from "@/data/rentalData";
import { 
  fetchPropertiesFromMongo, 
  convertMongoToApartment 
} from "@/services/mongoPropertyService";

// ADD state for properties
const [properties, setProperties] = useState<Apartment[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

// ADD useEffect to fetch properties
useEffect(() => {
  const loadProperties = async () => {
    try {
      setLoading(true);
      const response = await fetchPropertiesFromMongo({ limit: 50 });
      const apartments = response.data.map(convertMongoToApartment);
      setProperties(apartments);
      setError(null);
    } catch (err) {
      console.error('Failed to load properties:', err);
      setError('Failed to load properties. Please try again later.');
      // Fallback to hardcoded data for development
      // setProperties(rentals);
    } finally {
      setLoading(false);
    }
  };

  loadProperties();
}, []);

// REPLACE references to 'rentals' with 'properties'
// Line 32: const limitedRentals = rentals.slice(0, 10);
const limitedRentals = properties;

// ADD loading and error states to JSX
if (loading) {
  return (
    <div className="bg-beige-50 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-foreground/70">Loading properties...</p>
      </div>
    </div>
  );
}

if (error) {
  return (
    <div className="bg-beige-50 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    </div>
  );
}
```

#### Task 3.3: Update Other Frontend Components

**Files to Update**:
1. `src/pages/RentalDetailsPage.tsx` - Fetch single property by ID
2. `src/pages/HomePage.tsx` - Show featured properties from MongoDB
3. `src/components/rentals/ApartmentCard.tsx` - Handle MongoDB property format
4. Any other components that import from `rentalData.ts`

#### Task 3.4: Create Environment Configuration

**File**: `.env.local` (CREATE NEW in root directory)

```env
# MongoDB API Configuration
VITE_API_URL=http://localhost:3000/api

# Production
# VITE_API_URL=https://your-backend-domain.com/api
```

**File**: `src/config/env.ts` (UPDATE OR CREATE)

```typescript
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  frontendUrl: import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173',
};
```

---

### Phase 4: Image Path Handling

#### Task 4.1: Serve Static Images from Admin Console

**File**: `admin-console/app.js`

**Current** (Line 33):
```javascript
app.use(express.static(path.join(__dirname, 'public')));
```

**Issue**: Frontend requests images from React app, not Express server

**Solution 1: Proxy Images in Vite** (Development)

**File**: `vite.config.ts`

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/uploads': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
```

**Solution 2: Update Image URLs in Frontend**

**File**: `src/services/mongoPropertyService.ts`

```typescript
const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';

export const getImageUrl = (imagePath: string): string => {
  if (imagePath.startsWith('http')) return imagePath;
  return `${BASE_URL}${imagePath}`;
};

// Use in convertMongoToApartment:
images: mongoProp.images?.map(getImageUrl) || [],
```

---

### Phase 5: Real-time Synchronization

#### Task 5.1: Implement Polling in Frontend

**File**: `src/hooks/useProperties.ts` (CREATE NEW)

```typescript
import { useState, useEffect, useCallback } from 'react';
import { fetchPropertiesFromMongo, convertMongoToApartment } from '@/services/mongoPropertyService';
import type { Apartment } from '@/data/rentalData';

export const useProperties = (pollInterval: number = 30000) => {
  const [properties, setProperties] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchPropertiesFromMongo({ limit: 100 });
      const apartments = response.data.map(convertMongoToApartment);
      setProperties(apartments);
      setLastFetch(new Date());
      setError(null);
    } catch (err) {
      console.error('Failed to fetch properties:', err);
      setError('Failed to load properties');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    
    // Poll for updates
    const interval = setInterval(fetchData, pollInterval);
    
    return () => clearInterval(interval);
  }, [fetchData, pollInterval]);

  return { properties, loading, error, lastFetch, refetch: fetchData };
};
```

**Usage**:
```typescript
// In RentalsPage.tsx
const { properties, loading, error, refetch } = useProperties(30000); // Poll every 30s
```

#### Task 5.2: Add Manual Refresh Button

```typescript
<Button onClick={refetch} variant="outline">
  <RefreshIcon className="mr-2" />
  Refresh Properties
</Button>
```

---

## Implementation Checklist

### Backend (Admin Console)

- [ ] **Fix EJS Templates**
  - [ ] Update `admin-console/views/properties/index.ejs` (`property._id` instead of `property.id`)
  - [ ] Update `admin-console/views/bookings/index.ejs`
  - [ ] Update any other templates using `.id`

- [ ] **Update API Routes**
  - [ ] Create public API endpoints in `admin-console/routes/apiRoutes.js`
  - [ ] Move authenticated routes to `/api/admin/*`
  - [ ] Keep public routes at `/api/public/*`
  - [ ] Test public endpoints without authentication

- [ ] **Session Configuration**
  - [ ] Create `.env` file in `admin-console/`
  - [ ] Set `SESSION_SECRET` environment variable
  - [ ] Set `MONGODB_URI` environment variable
  - [ ] Test session persistence

- [ ] **MongoDB Model Updates**
  - [ ] Add virtual `id` field to Rental schema
  - [ ] Ensure `_id` is serialized correctly
  - [ ] Test with Postman/Thunder Client

### Frontend (React)

- [ ] **Create Services**
  - [ ] Create `src/services/mongoPropertyService.ts`
  - [ ] Add fetch functions for properties
  - [ ] Add data conversion utilities
  - [ ] Handle image URL transformation

- [ ] **Update Components**
  - [ ] Update `src/pages/RentalsPage.tsx` to use MongoDB
  - [ ] Update `src/pages/RentalDetailsPage.tsx`
  - [ ] Update `src/pages/HomePage.tsx`
  - [ ] Add loading states
  - [ ] Add error handling

- [ ] **Create Hooks**
  - [ ] Create `src/hooks/useProperties.ts`
  - [ ] Implement polling mechanism
  - [ ] Add manual refresh capability

- [ ] **Configuration**
  - [ ] Create `.env.local` file
  - [ ] Set `VITE_API_URL`
  - [ ] Update `vite.config.ts` with proxy

- [ ] **Testing**
  - [ ] Test property listing
  - [ ] Test property details
  - [ ] Test filters and search
  - [ ] Test image loading
  - [ ] Test error states

### Integration Testing

- [ ] **Admin Panel**
  - [ ] Test login
  - [ ] Test property create
  - [ ] Test property edit
  - [ ] Test property delete
  - [ ] Verify no redirect issues

- [ ] **Frontend**
  - [ ] Verify properties load from MongoDB
  - [ ] Test pagination
  - [ ] Test filters
  - [ ] Verify images display correctly

- [ ] **Synchronization**
  - [ ] Create property in admin panel
  - [ ] Verify it appears on frontend (within 30s or after refresh)
  - [ ] Update property in admin panel
  - [ ] Verify changes appear on frontend
  - [ ] Delete property in admin panel
  - [ ] Verify it disappears from frontend

---

## Environment Setup Guide

### Admin Console `.env`

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
FRONTEND_URL=http://localhost:5173

# Production Frontend URL (uncomment in production)
# FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend `.env.local`

Create `.env.local` in root directory:

```env
# Backend API URL
VITE_API_URL=http://localhost:3000/api

# Production (uncomment in production)
# VITE_API_URL=https://your-backend-domain.com/api
```

---

## Testing Procedures

### 1. Test Admin Login and Property Management

```bash
# Start admin console
cd admin-console
npm run dev

# Visit http://localhost:3000/auth/login
# Login with admin credentials
# Navigate to Properties
# Click "Edit" on a property - should NOT redirect to login
# Click "Delete" on a property - should work correctly
```

### 2. Test Public API Endpoints

```bash
# Test with curl or Postman

# Get all properties (no auth required)
curl http://localhost:3000/api/public/properties

# Get single property (no auth required)
curl http://localhost:3000/api/public/properties/[PROPERTY_ID]

# Should return property data without authentication
```

### 3. Test Frontend Integration

```bash
# Start frontend
npm run dev

# Visit http://localhost:5173/rentals
# Properties should load from MongoDB
# Check browser console for API calls
# Verify images display correctly
```

### 4. Test Synchronization

1. Keep frontend open at http://localhost:5173/rentals
2. Open admin panel at http://localhost:3000/properties
3. Create a new property in admin panel
4. Within 30 seconds (or after manual refresh), new property should appear on frontend
5. Edit the property in admin panel
6. Changes should reflect on frontend
7. Delete the property in admin panel
8. Property should disappear from frontend

---

## Database Schema Reference

### Rental (Property) Collection

```javascript
{
  _id: ObjectId("..."),
  title: String,
  description: String,
  location: String,
  address: String,
  price: Number,
  bedrooms: Number,
  bathrooms: Number,
  amenities: [String],
  images: [String],  // Array of paths like "/uploads/rentals/property-123456.jpg"
  ownerName: String,
  ownerEmail: String,
  ownerPhone: String,
  availability: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Migration Path for Existing Data

If you have existing hardcoded data in `rentalData.ts` that you want to migrate to MongoDB:

### Option 1: Manual Entry
Use admin panel to create properties one by one with images.

### Option 2: Seed Script

Create `admin-console/utils/seedRentals.js`:

```javascript
const mongoose = require('mongoose');
const Rental = require('../models/Rental');
require('dotenv').config();

// Import data from frontend
const rentals = [
  {
    title: "Premium Two-Bedroom Garden View Apartment",
    description: "Premium location! This exceptional 2-bedroom...",
    location: "Madinaty, Egypt",
    address: "Building B6, Group 65, Third Floor",
    price: 3000,
    bedrooms: 2,
    bathrooms: 1,
    amenities: ["WiFi", "Air Conditioning", "Wide Garden View"],
    images: ["/image/Apartments/Ap1/IMG-20250327-WA0010.jpg"],
    ownerName: "Property Sisters",
    ownerEmail: "info@propsisters.eg",
    ownerPhone: "+201000474991",
    availability: true
  },
  // ... more properties
];

async function seedRentals() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing
    await Rental.deleteMany({});
    console.log('Cleared existing rentals');

    // Insert new
    await Rental.insertMany(rentals);
    console.log(`Seeded ${rentals.length} rentals`);

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seedRentals();
```

Run with:
```bash
cd admin-console
node utils/seedRentals.js
```

---

## Production Deployment Considerations

### 1. Environment Variables
- Set `NODE_ENV=production`
- Use strong `SESSION_SECRET`
- Configure production `MONGODB_URI`
- Set correct `FRONTEND_URL` for CORS

### 2. Security
- Enable HTTPS (`secure: true` in session cookies)
- Implement rate limiting for API endpoints
- Add request validation middleware
- Sanitize user inputs

### 3. Performance
- Add caching layer (Redis) for frequently accessed properties
- Implement CDN for images
- Enable gzip compression
- Set up database indexes

### 4. Monitoring
- Add logging (Winston, Morgan)
- Set up error tracking (Sentry)
- Monitor API response times
- Track database query performance

---

## Timeline Estimate

- **Phase 1 (Fix Admin Panel)**: 2-3 hours
- **Phase 2 (Create Public API)**: 3-4 hours
- **Phase 3 (Update Frontend)**: 4-5 hours
- **Phase 4 (Image Handling)**: 2-3 hours
- **Phase 5 (Real-time Sync)**: 2-3 hours
- **Testing & Debugging**: 3-4 hours

**Total**: 16-22 hours of development time

---

## Success Criteria

✅ **Admin Panel Works**
- Can edit properties without redirect
- Can delete properties without redirect
- Session persists correctly
- All CRUD operations function

✅ **Frontend Displays MongoDB Data**
- Properties load from MongoDB API
- Images display correctly
- Filters work with MongoDB data
- Pagination functions properly

✅ **Full Synchronization**
- Admin changes appear on frontend within 30 seconds
- No manual database intervention needed
- All data flows through proper APIs

✅ **Code Quality**
- Proper error handling
- Loading states
- Type safety (TypeScript)
- Clean code structure

---

## Support & Troubleshooting

### Common Issues

**Issue**: "Cannot GET /properties/undefined/edit"
- **Cause**: EJS template using `property.id` instead of `property._id`
- **Fix**: Update template to use `property._id`

**Issue**: "Unauthorized" when fetching properties
- **Cause**: Public API endpoints require authentication
- **Fix**: Create public routes without `isAuthenticated` middleware

**Issue**: Images not loading on frontend
- **Cause**: Image paths are relative to admin console
- **Fix**: Configure Vite proxy or use absolute URLs

**Issue**: Frontend shows old data
- **Cause**: Polling not working or cached data
- **Fix**: Clear browser cache, verify polling interval

---

## Conclusion

This plan provides a complete roadmap for:
1. Fixing admin panel authentication issues
2. Creating public API endpoints for frontend access
3. Updating frontend to use MongoDB dynamically
4. Implementing real-time synchronization

All changes maintain the existing MVC structure, use Mongoose for database operations, and ensure seamless integration between admin panel and frontend.

