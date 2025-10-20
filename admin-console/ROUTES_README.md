# Routes & API Documentation

Welcome to the complete routing documentation for the Sisterhood Style Rentals Admin Console!

## 📚 Documentation Files

This folder contains comprehensive documentation for all routes and APIs:

| File | Description | Use When |
|------|-------------|----------|
| **[ROUTES_DOCUMENTATION.md](./ROUTES_DOCUMENTATION.md)** | Complete detailed documentation with examples | You need in-depth information about any route |
| **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** | REST API reference with code examples | You want to use the API programmatically |
| **[ROUTES_QUICK_REFERENCE.md](./ROUTES_QUICK_REFERENCE.md)** | Quick lookup table | You need to find a route quickly |
| **[ROUTES_SUMMARY.md](./ROUTES_SUMMARY.md)** | Complete overview and architecture | You want to understand the big picture |
| **[Postman_Collection.json](./Postman_Collection.json)** | Importable Postman collection | You want to test the API with Postman |

---

## 🚀 Quick Start

### For Web Interface Users

1. **Install and Start:**
   ```bash
   cd admin-console
   npm install
   npm run seed  # Create admin account
   npm start
   ```

2. **Access Interface:**
   - Open: http://localhost:3000/auth/login
   - Login with admin credentials
   - Navigate through the interface

3. **Available Pages:**
   - Dashboard: `/`
   - Properties: `/properties`
   - Users: `/users`
   - Bookings: `/bookings`

### For API Developers

1. **Login First:**
   ```bash
   curl -X POST http://localhost:3000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@example.com","password":"admin123"}' \
     -c cookies.txt
   ```

2. **Use API Endpoints:**
   ```bash
   # Get dashboard stats
   curl http://localhost:3000/api/dashboard/stats -b cookies.txt

   # List properties
   curl http://localhost:3000/api/properties?page=1&limit=10 -b cookies.txt

   # Create property
   curl -X POST http://localhost:3000/api/properties \
     -b cookies.txt \
     -F "title=Beach House" \
     -F "description=Beautiful house" \
     -F "location=Cairo" \
     -F "address=123 St" \
     -F "price=1500"
   ```

3. **Or Use Postman:**
   - Import `Postman_Collection.json` into Postman
   - Set `base_url` variable to `http://localhost:3000`
   - Login first, then test other endpoints

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Client Request                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   Express Router                         │
│                                                          │
│  /auth/*          → authRoutes.js                       │
│  /                → adminRoutes.js (web interface)      │
│  /api/*           → apiRoutes.js (REST API)             │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Authentication Middleware                   │
│                                                          │
│  isAuthenticated    → Check session, attach admin       │
│  isNotAuthenticated → Prevent access to login if auth   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                    Controllers                           │
│                                                          │
│  authController      → Login/Logout                     │
│  dashboardController → Statistics                       │
│  propertyController  → CRUD Properties                  │
│  userController      → Manage Users                     │
│  bookingController   → Manage Bookings                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  Database (MongoDB)                      │
│                                                          │
│  admins, users, rentals, bookings collections          │
└─────────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                      Response                            │
│                                                          │
│  Web Routes  → HTML (EJS Templates)                     │
│  API Routes  → JSON Data                                │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 Route Categories

### 🔐 Authentication Routes
Login, logout, session management

**Documentation:** [ROUTES_DOCUMENTATION.md#authentication-routes](./ROUTES_DOCUMENTATION.md#authentication-routes)

```
POST /auth/login   - Login
GET  /auth/logout  - Logout
```

### 📊 Dashboard Routes
Statistics and overview

**Documentation:** [ROUTES_DOCUMENTATION.md#dashboard-routes](./ROUTES_DOCUMENTATION.md#dashboard-routes)

```
GET /                              - Dashboard page
GET /api/dashboard/stats           - Statistics JSON
GET /api/dashboard/recent-bookings - Recent bookings JSON
```

### 🏠 Property Routes
Manage rental properties

**Documentation:** [ROUTES_DOCUMENTATION.md#property-routes](./ROUTES_DOCUMENTATION.md#property-routes)

**Web Interface:**
```
GET  /properties              - List page
GET  /properties/create       - Create form
POST /properties/create       - Submit create
GET  /properties/:id/edit     - Edit form
POST /properties/:id/edit     - Submit update
POST /properties/:id/delete   - Delete
```

**REST API:**
```
GET    /api/properties        - List JSON
GET    /api/properties/:id    - Get one JSON
POST   /api/properties        - Create JSON
PUT    /api/properties/:id    - Update JSON
DELETE /api/properties/:id    - Delete JSON
```

### 👥 User Routes
Manage user accounts

**Documentation:** [ROUTES_DOCUMENTATION.md#user-routes](./ROUTES_DOCUMENTATION.md#user-routes)

**Web Interface:**
```
GET  /users              - List page
GET  /users/:id          - View details page
POST /users/:id/delete   - Delete
```

**REST API:**
```
GET    /api/users        - List JSON
GET    /api/users/:id    - Get one JSON
DELETE /api/users/:id    - Delete JSON
```

### 📅 Booking Routes
Manage bookings

**Documentation:** [ROUTES_DOCUMENTATION.md#booking-routes](./ROUTES_DOCUMENTATION.md#booking-routes)

**Web Interface:**
```
GET  /bookings              - List page
GET  /bookings/:id          - View details page
POST /bookings/:id/status   - Update status
```

**REST API:**
```
GET    /api/bookings              - List JSON
GET    /api/bookings/:id          - Get one JSON
PATCH  /api/bookings/:id/status   - Update status JSON
DELETE /api/bookings/:id          - Delete JSON
```

---

## 🔍 Finding What You Need

### I want to...

#### ...understand how authentication works
→ Read [ROUTES_DOCUMENTATION.md#authentication-routes](./ROUTES_DOCUMENTATION.md#authentication-routes)

#### ...create a property via API
→ Read [API_DOCUMENTATION.md#create-property](./API_DOCUMENTATION.md#create-property)

#### ...see all available routes quickly
→ Read [ROUTES_QUICK_REFERENCE.md](./ROUTES_QUICK_REFERENCE.md)

#### ...understand the overall architecture
→ Read [ROUTES_SUMMARY.md](./ROUTES_SUMMARY.md)

#### ...test the API with Postman
→ Import [Postman_Collection.json](./Postman_Collection.json)

#### ...see code examples
→ Read [API_DOCUMENTATION.md#example-requests](./API_DOCUMENTATION.md#example-requests)

#### ...understand request/response formats
→ Read [API_DOCUMENTATION.md#response-format](./API_DOCUMENTATION.md#response-format)

---

## 🛠️ Common Tasks

### Task 1: Create a Property

**Via Web Interface:**
1. Login at `/auth/login`
2. Go to `/properties`
3. Click "Create Property"
4. Fill form and submit

**Via API:**
```bash
curl -X POST http://localhost:3000/api/properties \
  -b cookies.txt \
  -F "title=Beach House" \
  -F "description=Beautiful beach house" \
  -F "location=Cairo" \
  -F "address=123 Beach St" \
  -F "price=1500" \
  -F "images=@house.jpg"
```

### Task 2: Update Booking Status

**Via Web Interface:**
1. Go to `/bookings`
2. Click on booking
3. Select new status and submit

**Via API:**
```bash
curl -X PATCH http://localhost:3000/api/bookings/{id}/status \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{"status":"confirmed"}'
```

### Task 3: Get Dashboard Statistics

**Via API:**
```bash
curl http://localhost:3000/api/dashboard/stats -b cookies.txt
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalProperties": 25,
    "totalUsers": 150,
    "totalBookings": 342,
    "totalRevenue": 125000
  }
}
```

---

## 🧪 Testing

### Manual Testing (Web Interface)
1. Start server: `npm start`
2. Open browser: http://localhost:3000
3. Login and test features

### API Testing (cURL)
```bash
# Save session cookie
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}' \
  -c cookies.txt

# Test endpoints
curl http://localhost:3000/api/properties -b cookies.txt
```

### API Testing (Postman)
1. Import `Postman_Collection.json`
2. Set environment variable `base_url=http://localhost:3000`
3. Run "Login" request first
4. Test other endpoints

### API Testing (JavaScript)
```javascript
// Login
const response = await fetch('http://localhost:3000/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'admin123'
  }),
  credentials: 'include'
});

// Get properties
const properties = await fetch('http://localhost:3000/api/properties', {
  credentials: 'include'
}).then(r => r.json());
```

---

## 🔧 Configuration

### Environment Variables
Create `.env` file:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/rental-admin
SESSION_SECRET=your-secret-key-here
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Enable API from Frontend
The API is already configured with CORS for `http://localhost:5173`

In your frontend:
```javascript
fetch('http://localhost:3000/api/properties', {
  credentials: 'include'  // Important for session cookies
})
```

---

## 📝 Notes

### Authentication
- Both web and API routes use the same session-based authentication
- Must login via `/auth/login` first
- Session cookie must be included in subsequent requests
- Session expires after 7 days of inactivity

### File Uploads
- Only supported via `multipart/form-data`
- Max 10 files per request
- Max 10MB per file
- Images only (JPEG, PNG, GIF, WebP)

### Pagination
- Default: 10 items per page
- Use `?page=1&limit=20` to customize
- Response includes pagination metadata

### Error Handling
- Web routes: Flash messages + redirect
- API routes: JSON error response
- All errors logged to console

---

## 🚨 Troubleshooting

### Problem: 401 Unauthorized
**Solution:** Login first via `/auth/login`, ensure cookies are sent

### Problem: CORS Error
**Solution:** Check `FRONTEND_URL` in `.env`, use `credentials: 'include'`

### Problem: Session Not Persisting
**Solution:** Check `SESSION_SECRET`, verify MongoDB connection, clear cookies

### Problem: File Upload Fails
**Solution:** Check directory permissions, verify file size/type

---

## 📚 Additional Resources

- **Express.js:** https://expressjs.com/
- **MongoDB:** https://docs.mongodb.com/
- **Postman:** https://learning.postman.com/
- **cURL:** https://curl.se/docs/

---

## 🤝 Contributing

When adding new routes:
1. Create controller function
2. Add route to appropriate routes file
3. Test thoroughly
4. Update all documentation files
5. Add to Postman collection

---

## 📞 Support

For questions or issues:
- Check documentation files
- Review code comments
- Test with Postman collection
- Check console logs

---

**Happy Coding! 🎉**

*Last Updated: October 2025*

