# 📮 Postman Quick Start Guide

## 🚀 Quick Import

### Step 1: Import Collection

1. Open Postman
2. Click **Import** button (top left)
3. Drag and drop or select: `Sisterhood_Style_Rentals_API.postman_collection.json`
4. Click **Import**

✅ Done! You now have all API endpoints ready to use.

---

## ⚙️ Configuration (One-Time Setup)

### Step 2: Configure Settings

1. Click Settings (⚙️ icon in top right)
2. Enable these options:
   - ✅ **Send cookies** (very important for sessions!)
   - ✅ **Automatically follow redirects**
   - ✅ **SSL certificate verification** - OFF (for localhost only)

---

## 🧪 Testing Workflow

### Scenario 1: Register & Login (Email/Password)

#### 1️⃣ Register New User
```
POST /api/auth/register
```
**Body:**
```json
{
  "email": "test@example.com",
  "password": "password123",
  "displayName": "Test User",
  "phoneNumber": "+1234567890"
}
```
**Expected:** 201 Created + Session cookie saved

---

#### 2️⃣ Login
```
POST /api/auth/login
```
**Body:**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```
**Expected:** 200 OK + Session cookie saved

---

#### 3️⃣ Verify Session
```
GET /api/auth/verify
```
**Expected:** 200 OK + User data returned

---

### Scenario 2: Property Management

#### 1️⃣ Login First
```
POST /api/auth/login
```

---

#### 2️⃣ Create Property
```
POST /api/admin/properties
```
**Content-Type:** `multipart/form-data`

**Form Data:**
- `title`: Luxury Apartment in Cairo
- `description`: Beautiful 3-bedroom apartment
- `location`: Cairo
- `address`: 123 Nile Street
- `price`: 1500
- `bedrooms`: 3
- `bathrooms`: 2
- `amenities`: WiFi,Pool,Gym
- `availability`: true
- `images`: [Select image files]

**Expected:** 201 Created + Property ID auto-saved to variable

---

#### 3️⃣ List All Properties
```
GET /api/admin/properties
```
**Expected:** 200 OK + Array of properties

---

#### 4️⃣ Update Property
```
PUT /api/admin/properties/{{propertyId}}
```
Uses the auto-saved propertyId from create step!

---

#### 5️⃣ Delete Property
```
DELETE /api/admin/properties/{{propertyId}}
```

---

### Scenario 3: Dashboard & Stats

#### 1️⃣ Get Statistics
```
GET /api/admin/dashboard/stats
```
**Expected:**
```json
{
  "totalProperties": 50,
  "totalUsers": 100,
  "totalBookings": 250,
  "totalRevenue": 375000
}
```

---

#### 2️⃣ Get Recent Bookings
```
GET /api/admin/dashboard/recent-bookings?limit=10
```

---

## 🔑 Collection Variables

These are automatically saved by test scripts:

| Variable | Saved By | Used In |
|----------|----------|---------|
| `userId` | Login request | User endpoints |
| `propertyId` | Create property | Property operations |
| `bookingId` | Create booking | Booking operations |

---

## 📝 Common Issues & Solutions

### Issue 1: "Not authenticated" Error

**Cause:** Session cookie not sent

**Solution:**
1. Go to Settings → Enable "Send cookies"
2. Login again
3. Try the request again

---

### Issue 2: Property Images Not Uploading

**Cause:** Wrong content type

**Solution:**
1. In request, change body type to `form-data`
2. Add field `images` with type `file`
3. Select image files

---

### Issue 3: 404 Not Found

**Cause:** Wrong URL or server not running

**Solution:**
1. Check backend is running: `http://localhost:3000`
2. Verify baseUrl variable is set correctly
3. Check route path

---

## 🎯 Test Scripts Included

### Auto-Save User ID After Login
```javascript
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.collectionVariables.set("userId", jsonData.user.id);
}
```

### Auto-Save Property ID After Create
```javascript
if (pm.response.code === 201) {
    const jsonData = pm.response.json();
    pm.collectionVariables.set("propertyId", jsonData.data._id);
}
```

These run automatically! No manual copying of IDs needed.

---

## 📊 Response Examples

### Success Response
```json
{
  "success": true,
  "message": "Property created successfully",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

## 🔄 Complete Test Flow

### Full E2E Test (5 minutes)

1. **Register** → POST `/api/auth/register`
2. **Login** → POST `/api/auth/login`
3. **Get Profile** → GET `/api/auth/me`
4. **Create Property** → POST `/api/admin/properties`
5. **List Properties** → GET `/api/admin/properties`
6. **Get Stats** → GET `/api/admin/dashboard/stats`
7. **Update Property** → PUT `/api/admin/properties/{{propertyId}}`
8. **Delete Property** → DELETE `/api/admin/properties/{{propertyId}}`
9. **Logout** → POST `/api/auth/logout`

---

## 💡 Pro Tips

### Tip 1: Use Environment Variables
Create different environments for:
- Local: `http://localhost:3000`
- Development: `https://dev-api.example.com`
- Production: `https://api.example.com`

### Tip 2: Organize Requests
Requests are already organized in folders:
- 1. Authentication
- 2. Properties (Public)
- 3. Properties (Admin)
- 4. Users (Admin)
- 5. Bookings (Admin)
- 6. Dashboard (Admin)

### Tip 3: Use Runner for Batch Testing
1. Click on collection
2. Click "Run" → Select folder
3. All requests run in sequence

---

## 📚 Documentation

For detailed API documentation, see:
- **POSTMAN_DOCUMENTATION.md** - Complete API reference
- **ROUTES_STRUCTURE.md** - Route organization
- **MONGODB_FIRST_AUTH.md** - Authentication details

---

## ✅ Quick Checklist

Before testing:
- [ ] Backend running on port 3000
- [ ] MongoDB running
- [ ] Postman collection imported
- [ ] "Send cookies" enabled in Postman settings
- [ ] baseUrl variable set to `http://localhost:3000`

You're ready to test! 🚀

