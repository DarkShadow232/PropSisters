# Frontend Integration Guide

## Overview

This guide shows how to integrate your React frontend with the MongoDB-powered admin console to display dynamic property data.

---

## Architecture

```
┌─────────────────────┐
│   React Frontend    │
│   (Your Website)    │
└──────────┬──────────┘
           │ HTTP Requests
           ▼
┌─────────────────────┐
│   Admin Console     │
│   Express + API     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│      MongoDB        │
│   (All Data)        │
└─────────────────────┘
```

**Data Flow**:
1. Admin adds/edits property → Saved to MongoDB
2. Frontend fetches via API → Gets latest data from MongoDB
3. Changes are immediately reflected

---

## Setup Steps

### 1. Enable CORS (Required)

If your React app runs on a different port than the admin console, enable CORS.

**Install CORS**:
```bash
cd admin-console
npm install cors
```

**Add to `admin-console/app.js`** (after line 12):
```javascript
const cors = require('cors');

// Enable CORS for your React app
app.use(cors({
  origin: 'http://localhost:5173', // Your React dev server
  credentials: true
}));
```

For production, update origin:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://yourdomain.com',
  credentials: true
}));
```

---

### 2. Create API Service (React)

Create a service file to centralize API calls.

**File**: `src/services/propertyService.js`

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_URL || 'http://localhost:3000';

class PropertyService {
  // Get all properties
  async getAllProperties(filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/properties?${params}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message);
    }
    
    return data.data;
  }

  // Get single property
  async getPropertyById(id) {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message);
    }
    
    return data.data;
  }

  // Search properties
  async searchProperties(searchParams) {
    const params = new URLSearchParams(searchParams);
    const response = await fetch(`${API_BASE_URL}/properties/search?${params}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message);
    }
    
    return data;
  }

  // Get locations
  async getLocations() {
    const response = await fetch(`${API_BASE_URL}/locations`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message);
    }
    
    return data.data;
  }

  // Get amenities
  async getAmenities() {
    const response = await fetch(`${API_BASE_URL}/amenities`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message);
    }
    
    return data.data;
  }

  // Check availability
  async checkAvailability(propertyId, checkIn, checkOut) {
    const params = new URLSearchParams({ checkIn, checkOut });
    const response = await fetch(
      `${API_BASE_URL}/properties/${propertyId}/availability?${params}`
    );
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message);
    }
    
    return data.available;
  }

  // Get full image URL
  getImageUrl(imagePath) {
    return `${IMAGE_BASE_URL}${imagePath}`;
  }
}

export default new PropertyService();
```

---

### 3. Create React Components

#### Property List Component

**File**: `src/components/PropertyList.jsx`

```javascript
import { useState, useEffect } from 'react';
import propertyService from '../services/propertyService';

export default function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const data = await propertyService.getAllProperties();
      setProperties(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading properties...</div>;
  if (error) return <div>Error: {error}</div>;
  if (properties.length === 0) return <div>No properties available</div>;

  return (
    <div className="property-grid">
      {properties.map(property => (
        <PropertyCard key={property._id} property={property} />
      ))}
    </div>
  );
}

function PropertyCard({ property }) {
  const imageUrl = property.images[0] 
    ? propertyService.getImageUrl(property.images[0])
    : '/placeholder.jpg';

  return (
    <div className="property-card">
      <img src={imageUrl} alt={property.title} />
      <h3>{property.title}</h3>
      <p>{property.location}</p>
      <p className="price">${property.price}/night</p>
      <div className="amenities">
        <span>🛏️ {property.bedrooms} beds</span>
        <span>🚿 {property.bathrooms} baths</span>
      </div>
      <a href={`/properties/${property._id}`}>View Details</a>
    </div>
  );
}
```

---

#### Property Details Component

**File**: `src/components/PropertyDetails.jsx`

```javascript
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import propertyService from '../services/propertyService';

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      const data = await propertyService.getPropertyById(id);
      setProperty(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!property) return <div>Property not found</div>;

  return (
    <div className="property-details">
      <h1>{property.title}</h1>
      
      <div className="image-gallery">
        {property.images.map((img, idx) => (
          <img 
            key={idx}
            src={propertyService.getImageUrl(img)} 
            alt={`${property.title} - ${idx + 1}`} 
          />
        ))}
      </div>

      <div className="info">
        <p className="price">${property.price}/night</p>
        <p className="location">📍 {property.location}</p>
        <p className="address">{property.address}</p>
      </div>

      <div className="details">
        <span>🛏️ {property.bedrooms} Bedrooms</span>
        <span>🚿 {property.bathrooms} Bathrooms</span>
      </div>

      <div className="description">
        <h2>Description</h2>
        <p>{property.description}</p>
      </div>

      <div className="amenities">
        <h2>Amenities</h2>
        <ul>
          {property.amenities.map((amenity, idx) => (
            <li key={idx}>{amenity}</li>
          ))}
        </ul>
      </div>

      <div className="owner">
        <h3>Owner: {property.ownerName}</h3>
        <p>Email: {property.ownerEmail}</p>
        {property.ownerPhone && <p>Phone: {property.ownerPhone}</p>}
      </div>
    </div>
  );
}
```

---

#### Search Component

**File**: `src/components/PropertySearch.jsx`

```javascript
import { useState, useEffect } from 'react';
import propertyService from '../services/propertyService';

export default function PropertySearch() {
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: ''
  });

  const [results, setResults] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const data = await propertyService.getLocations();
      setLocations(data);
    } catch (err) {
      console.error('Error loading locations:', err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const data = await propertyService.searchProperties(filters);
      setResults(data.data);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="property-search">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          name="keyword"
          placeholder="Search properties..."
          value={filters.keyword}
          onChange={handleChange}
        />

        <select name="location" value={filters.location} onChange={handleChange}>
          <option value="">All Locations</option>
          {locations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        <input
          type="number"
          name="minPrice"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={handleChange}
        />

        <input
          type="number"
          name="maxPrice"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={handleChange}
        />

        <select name="bedrooms" value={filters.bedrooms} onChange={handleChange}>
          <option value="">Any Bedrooms</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      <div className="results">
        {results.length === 0 ? (
          <p>No properties found</p>
        ) : (
          results.map(property => (
            <PropertyCard key={property._id} property={property} />
          ))
        )}
      </div>
    </div>
  );
}
```

---

#### Availability Checker Component

**File**: `src/components/AvailabilityChecker.jsx`

```javascript
import { useState } from 'react';
import propertyService from '../services/propertyService';

export default function AvailabilityChecker({ propertyId }) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [available, setAvailable] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async (e) => {
    e.preventDefault();
    
    if (!checkIn || !checkOut) {
      alert('Please select both dates');
      return;
    }

    try {
      setLoading(true);
      const isAvailable = await propertyService.checkAvailability(
        propertyId,
        checkIn,
        checkOut
      );
      setAvailable(isAvailable);
    } catch (err) {
      console.error('Error checking availability:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="availability-checker">
      <h3>Check Availability</h3>
      
      <form onSubmit={handleCheck}>
        <div>
          <label>Check In:</label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div>
          <label>Check Out:</label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            min={checkIn}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Checking...' : 'Check Availability'}
        </button>
      </form>

      {available !== null && (
        <div className={`result ${available ? 'available' : 'unavailable'}`}>
          {available
            ? '✅ Property is available for these dates!'
            : '❌ Property is already booked for these dates.'}
        </div>
      )}
    </div>
  );
}
```

---

### 4. Environment Variables

**File**: `.env.local` (in your React app root)

```env
# Development
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_IMAGE_URL=http://localhost:3000

# Production (update when deploying)
# REACT_APP_API_URL=https://yourdomain.com/api
# REACT_APP_IMAGE_URL=https://yourdomain.com
```

---

### 5. Test the Integration

**Start both servers**:

```bash
# Terminal 1: Admin Console
cd admin-console
npm start
# Runs on http://localhost:3000

# Terminal 2: React App
cd your-react-app
npm run dev
# Runs on http://localhost:5173
```

**Test Flow**:
1. Admin console: Create a property with images
2. React app: Property appears immediately in list
3. Admin console: Edit property
4. React app: Refresh to see updates

---

## Complete Integration Example

Here's a complete page that combines everything:

**File**: `src/pages/PropertiesPage.jsx`

```javascript
import { useState } from 'react';
import PropertyList from '../components/PropertyList';
import PropertySearch from '../components/PropertySearch';

export default function PropertiesPage() {
  const [view, setView] = useState('list'); // 'list' or 'search'

  return (
    <div className="properties-page">
      <header>
        <h1>Available Properties</h1>
        <div className="view-toggle">
          <button 
            onClick={() => setView('list')}
            className={view === 'list' ? 'active' : ''}
          >
            All Properties
          </button>
          <button 
            onClick={() => setView('search')}
            className={view === 'search' ? 'active' : ''}
          >
            Search
          </button>
        </div>
      </header>

      {view === 'list' ? <PropertyList /> : <PropertySearch />}
    </div>
  );
}
```

---

## Dynamic Updates

**How it works**:
1. Admin creates/updates property → Saved to MongoDB
2. Frontend fetches from API → Gets latest from MongoDB
3. No cache issues - always fresh data

**Refresh Strategy**:
- Auto-refresh: `setInterval()` to poll API
- Manual refresh: User clicks refresh button
- Real-time: Use Socket.io (advanced)

**Example Auto-Refresh**:
```javascript
useEffect(() => {
  loadProperties();
  
  // Refresh every 30 seconds
  const interval = setInterval(loadProperties, 30000);
  
  return () => clearInterval(interval);
}, []);
```

---

## Production Checklist

- [ ] Enable CORS for production domain
- [ ] Set production API URLs in `.env`
- [ ] Add error boundaries in React
- [ ] Implement loading states
- [ ] Add image lazy loading
- [ ] Set up caching (if needed)
- [ ] Add analytics
- [ ] Test on mobile devices

---

## Troubleshooting

### Images not loading
- Check image paths start with `/uploads/rentals/`
- Verify Express static middleware is configured
- Check CORS headers

### API errors
- Verify admin console is running
- Check CORS configuration
- Inspect network tab in browser dev tools

### Data not updating
- Clear browser cache
- Check MongoDB for latest data
- Verify API endpoint returns fresh data

---

## Next Steps

1. ✅ API routes created
2. ✅ CORS configured
3. ✅ React components ready
4. Test integration
5. Add more features (booking, reviews, etc.)

Your frontend now dynamically pulls all property data from MongoDB!

