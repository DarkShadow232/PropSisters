# PropSisters - Complete Project Documentation

## 🏗️ **Project Overview**

**PropSisters** is a full-stack rental property management platform built with modern web technologies. The project consists of two main applications:

1. **Frontend (React/TypeScript)** - Customer-facing website
2. **Backend (Node.js/Express)** - Admin console and API server

---

## 📁 **Project Structure**

```
PropSisters/
├── src/                          # React Frontend Application
│   ├── components/               # Reusable UI Components
│   ├── pages/                    # Page Components
│   ├── services/                 # API Services
│   ├── hooks/                    # Custom React Hooks
│   ├── contexts/                 # React Contexts
│   ├── lib/                      # Utility Libraries
│   ├── data/                     # Static Data
│   ├── utils/                    # Helper Functions
│   └── config/                   # Configuration Files
├── admin-console/                # Node.js Backend Application
│   ├── controllers/              # Business Logic Controllers
│   ├── models/                   # Database Models (MongoDB)
│   ├── routes/                   # API Routes
│   ├── views/                    # EJS Templates
│   ├── middleware/               # Express Middleware
│   ├── config/                   # Configuration Files
│   ├── utils/                    # Backend Utilities
│   └── public/                   # Static Assets
└── public/                       # Frontend Static Assets
```

---

## 🎨 **Frontend Application (`src/`)**

### **Technology Stack**
- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component Library
- **React Router** - Navigation
- **React Query** - Data Fetching
- **Firebase** - Authentication (Google OAuth)

### **Key Files**

#### **Entry Points**
- `main.tsx` - React application entry point
- `App.tsx` - Main application component with routing

#### **Core Components**
```
src/components/
├── Layout.tsx                    # Main layout wrapper
├── Header.tsx                    # Navigation header
├── Footer.tsx                    # Site footer
├── Logo.tsx                      # Brand logo component
├── auth/                         # Authentication components
│   ├── ProtectedRoute.tsx        # Route protection
│   └── RoleGuard.tsx             # Role-based access
├── ui/                           # shadcn/ui components (50+ components)
├── rentals/                      # Property-related components
│   ├── ApartmentCard.tsx         # Property card display
│   ├── ImageGallery.tsx          # Property image gallery
│   ├── FilterSidebar.tsx          # Property filters
│   └── SearchBar.tsx             # Property search
├── reviews/                      # Review system components
│   ├── ReviewCard.tsx            # Individual review
│   ├── ReviewForm.tsx            # Review submission
│   └── StarRating.tsx            # Rating display
└── location/                     # Location-related components
    ├── Map.tsx                   # Interactive map
    └── CityCarousel.tsx          # City selection
```

#### **Pages**
```
src/pages/
├── HomePage.tsx                  # Landing page
├── RentalsPage.tsx               # Property listings
├── RentalDetailsPage.tsx         # Property details
├── BookingPage.tsx               # Booking form
├── SignInPage.tsx                # User login
├── SignUpPage.tsx                # User registration
├── UserDashboardPage.tsx          # User dashboard
├── AddPropertyPage.tsx           # Property submission
├── ServicesPage.tsx              # Services information
├── AboutPage.tsx                 # About us
├── ContactPage.tsx               # Contact information
└── NotFound.tsx                  # 404 page
```

#### **Services Layer**
```
src/services/
├── authService.ts                # Authentication API calls
├── propertyService.ts            # Property management
├── mongoPropertyService.ts       # MongoDB property integration
├── bookingService.ts              # Booking management
├── userService.ts                # User management
├── paymentService.ts             # Payment processing
└── storageService.ts             # File storage
```

#### **Custom Hooks**
```
src/hooks/
├── useProperties.ts              # Property data management
├── use-mobile.tsx                # Mobile detection
└── use-toast.ts                  # Toast notifications
```

#### **Context Providers**
```
src/contexts/
└── AuthContext.tsx               # Authentication state management
```

---

## 🖥️ **Backend Application (`admin-console/`)**

### **Technology Stack**
- **Node.js** - Runtime Environment
- **Express.js** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM (Object Document Mapper)
- **EJS** - Template Engine
- **Express Sessions** - Session Management
- **Multer** - File Upload
- **bcryptjs** - Password Hashing

### **Key Files**

#### **Application Entry**
- `app.js` - Main Express application setup

#### **Database Models**
```
admin-console/models/
├── User.js                       # User schema
├── Rental.js                     # Property schema
├── Booking.js                    # Booking schema
└── Admin.js                      # Admin user schema
```

#### **Controllers (Business Logic)**
```
admin-console/controllers/
├── authController.js             # Authentication logic
├── propertyController.js         # Property CRUD operations
├── userController.js             # User management
├── bookingController.js          # Booking management
└── dashboardController.js         # Dashboard statistics
```

#### **API Routes**
```
admin-console/routes/
├── apiRoutes.js                  # Main API router
├── authRoutes.js                 # Authentication routes
├── propertyRoutes.js             # Property routes
├── userRoutes.js                 # User routes
├── bookingRoutes.js              # Booking routes
├── dashboardRoutes.js             # Dashboard routes
└── frontendAuthRoutes.js         # Frontend authentication
```

#### **Views (EJS Templates)**
```
admin-console/views/
├── dashboard.ejs                  # Admin dashboard
├── auth/
│   └── login.ejs                 # Admin login
├── properties/
│   ├── index.ejs                 # Properties list
│   ├── create.ejs                # Create property
│   └── edit.ejs                  # Edit property
├── users/
│   ├── index.ejs                 # Users list
│   └── view.ejs                  # User details
├── bookings/
│   ├── index.ejs                 # Bookings list
│   └── view.ejs                  # Booking details
└── partials/
    ├── header.ejs                # Common header
    └── footer.ejs                 # Common footer
```

#### **Middleware**
```
admin-console/middleware/
└── authMiddleware.js             # Authentication middleware
```

#### **Configuration**
```
admin-console/config/
└── database.js                   # MongoDB connection
```

---

## 🔄 **Data Flow Architecture**

### **Frontend → Backend Communication**
```
React Frontend (Port 5173/8081)
    ↓ HTTP Requests
Express Backend (Port 3000)
    ↓ Database Queries
MongoDB Database
```

### **Authentication Flow**
```
1. User Login (Email/Password or Google OAuth)
2. Backend validates credentials
3. Session created and stored in MongoDB
4. JWT token returned to frontend
5. Frontend stores token for subsequent requests
```

### **Property Management Flow**
```
1. Admin creates property in admin console
2. Data saved to MongoDB
3. Frontend fetches properties via API
4. Properties displayed to users
5. Users can book properties
6. Bookings stored in MongoDB
```

---

## 🗄️ **Database Schema**

### **Users Collection**
```javascript
{
  _id: ObjectId,
  email: String (unique),
  displayName: String,
  password: String (hashed),
  role: ['user', 'owner', 'admin'],
  authProvider: ['email', 'google'],
  googleId: String (for Google users),
  phoneNumber: String,
  photoURL: String,
  isEmailVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### **Rentals Collection**
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  location: String,
  address: String,
  price: Number,
  bedrooms: Number,
  bathrooms: Number,
  amenities: [String],           // Array of amenities
  images: [String],              // Array of image URLs
  ownerName: String,
  ownerEmail: String,
  ownerPhone: String,
  availability: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### **Bookings Collection**
```javascript
{
  _id: ObjectId,
  propertyId: ObjectId (ref: Rental),
  userId: ObjectId (ref: User),
  checkIn: Date,
  checkOut: Date,
  guests: Number,
  totalPrice: Number,
  status: ['pending', 'confirmed', 'cancelled'],
  specialRequests: String,
  cleaningService: Boolean,
  airportPickup: Boolean,
  earlyCheckIn: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### **Admins Collection**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

---

## 🚀 **Key Features**

### **Frontend Features**
- ✅ **Responsive Design** - Works on all devices
- ✅ **Property Browsing** - Search and filter properties
- ✅ **User Authentication** - Email/password + Google OAuth
- ✅ **Property Details** - Rich property information
- ✅ **Booking System** - Property reservation
- ✅ **User Dashboard** - Personal account management
- ✅ **Property Submission** - Add new properties
- ✅ **Review System** - Property reviews and ratings
- ✅ **Location Services** - Interactive maps
- ✅ **Payment Integration** - Multiple payment methods

### **Backend Features**
- ✅ **Admin Console** - Complete property management
- ✅ **User Management** - User accounts and roles
- ✅ **Booking Management** - Reservation system
- ✅ **File Upload** - Property image management
- ✅ **Session Management** - Secure authentication
- ✅ **API Endpoints** - RESTful API for frontend
- ✅ **Dashboard Analytics** - Statistics and reports
- ✅ **Data Validation** - Input validation and sanitization

---

## 🛠️ **Development Setup**

### **Prerequisites**
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### **Environment Configuration**

#### **Frontend Environment (`.env.local`)**
```env
VITE_API_URL=http://localhost:3000/api
```

#### **Backend Environment (`admin-console/.env`)**
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/rental-admin
SESSION_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173
```

### **Installation Steps**

#### **1. Install Dependencies**
```bash
# Frontend dependencies
npm install

# Backend dependencies
cd admin-console
npm install
```

#### **2. Start MongoDB**
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
```

#### **3. Seed Admin User (First Time)**
```bash
cd admin-console
npm run seed
```

#### **4. Start Applications**
```bash
# Terminal 1: Start Backend
cd admin-console
npm run dev

# Terminal 2: Start Frontend
npm run dev
```

#### **5. Access Applications**
- **Frontend**: http://localhost:5173
- **Backend Admin**: http://localhost:3000/auth/login

---

## 📡 **API Endpoints**

### **Public Endpoints**
```
GET    /api/properties              # Get all properties
GET    /api/properties/:id          # Get single property
```

### **Authentication Endpoints**
```
POST   /api/auth/register           # User registration
POST   /api/auth/login              # User login
POST   /api/auth/google              # Google OAuth
GET    /api/auth/verify             # Verify session
POST   /api/auth/logout              # User logout
PUT    /api/auth/profile             # Update profile
```

### **Admin Endpoints (Authenticated)**
```
GET    /api/admin/properties        # List properties
POST   /api/admin/properties        # Create property
PUT    /api/admin/properties/:id     # Update property
DELETE /api/admin/properties/:id     # Delete property

GET    /api/admin/users             # List users
GET    /api/admin/users/:id         # Get user
DELETE /api/admin/users/:id         # Delete user

GET    /api/admin/bookings          # List bookings
GET    /api/admin/bookings/:id       # Get booking
PATCH  /api/admin/bookings/:id/status # Update booking status

GET    /api/admin/dashboard/stats   # Dashboard statistics
```

---

## 🔐 **Security Features**

### **Authentication**
- **Session-based authentication** for admin console
- **JWT tokens** for API authentication
- **Password hashing** with bcryptjs
- **Google OAuth** integration
- **Role-based access control**

### **Data Protection**
- **Input validation** and sanitization
- **SQL injection protection** via Mongoose
- **XSS protection** with proper escaping
- **CSRF protection** via sessions
- **File upload validation** (images only, size limits)

### **CORS Configuration**
- **Restricted origins** for API access
- **Credentials support** for authenticated requests
- **Environment-specific** CORS settings

---

## 📊 **Performance Optimizations**

### **Frontend**
- **Code splitting** with React.lazy
- **Image optimization** with lazy loading
- **Caching** with React Query
- **Bundle optimization** with Vite
- **Component memoization** for performance

### **Backend**
- **Database indexing** for faster queries
- **Lean queries** for reduced data transfer
- **Connection pooling** for database efficiency
- **Static file serving** for images
- **Request logging** for monitoring

---

## 🧪 **Testing Strategy**

### **Frontend Testing**
- **Component testing** with React Testing Library
- **Integration testing** for user flows
- **E2E testing** with Playwright
- **Visual regression testing**

### **Backend Testing**
- **Unit testing** for controllers
- **Integration testing** for API endpoints
- **Database testing** with test fixtures
- **Authentication testing**

---

## 🚀 **Deployment Options**

### **Frontend Deployment**
- **Vercel** - Easy React deployment
- **Netlify** - Static site hosting
- **AWS S3 + CloudFront** - Scalable hosting
- **Docker** - Containerized deployment

### **Backend Deployment**
- **Heroku** - Simple Node.js hosting
- **AWS EC2** - Full control hosting
- **DigitalOcean** - Cost-effective VPS
- **Docker** - Containerized deployment

### **Database Deployment**
- **MongoDB Atlas** - Managed cloud database
- **AWS DocumentDB** - MongoDB-compatible
- **Self-hosted MongoDB** - Full control

---

## 📈 **Monitoring & Analytics**

### **Application Monitoring**
- **Error tracking** with Sentry
- **Performance monitoring** with New Relic
- **Uptime monitoring** with Pingdom
- **Log aggregation** with LogRocket

### **Business Analytics**
- **User behavior** tracking
- **Property performance** metrics
- **Booking conversion** rates
- **Revenue tracking**

---

## 🔧 **Development Workflow**

### **Code Organization**
- **Feature-based** folder structure
- **Component composition** patterns
- **Service layer** abstraction
- **Type safety** with TypeScript

### **Version Control**
- **Git branching** strategy
- **Pull request** reviews
- **Automated testing** on commits
- **Deployment automation**

### **Code Quality**
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety
- **Husky** for pre-commit hooks

---

## 📚 **Documentation Resources**

### **Project Documentation**
- `README.md` - Project overview
- `QUICK_START.md` - Quick setup guide
- `API_DOCUMENTATION.md` - API reference
- `ROUTES_DOCUMENTATION.md` - Route details
- `SETUP_INSTRUCTIONS.md` - Detailed setup

### **External Resources**
- **React Documentation** - https://react.dev
- **Express.js Guide** - https://expressjs.com
- **MongoDB Manual** - https://docs.mongodb.com
- **Tailwind CSS** - https://tailwindcss.com
- **shadcn/ui** - https://ui.shadcn.com

---

## 🎯 **Project Status**

### **✅ Completed Features**
- Complete user authentication system
- Property management (CRUD operations)
- Booking system with status management
- Admin console with dashboard
- Responsive frontend design
- API integration between frontend and backend
- File upload for property images
- Session management
- Role-based access control

### **🚧 In Progress**
- Payment integration
- Advanced search filters
- Email notifications
- Mobile app development

### **📋 Future Enhancements**
- Real-time chat system
- Advanced analytics dashboard
- Multi-language support
- Mobile app (React Native)
- AI-powered property recommendations
- Virtual property tours

---

## 💡 **Best Practices**

### **Code Organization**
- Keep components small and focused
- Use custom hooks for reusable logic
- Implement proper error boundaries
- Follow TypeScript best practices

### **Performance**
- Optimize images and assets
- Implement proper caching strategies
- Use database indexes effectively
- Monitor and profile application performance

### **Security**
- Validate all user inputs
- Implement proper authentication
- Use HTTPS in production
- Regular security audits

### **Maintenance**
- Keep dependencies updated
- Write comprehensive tests
- Document code changes
- Monitor application health

---

## 🤝 **Contributing**

### **Development Setup**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests for new features
5. Submit a pull request

### **Code Standards**
- Follow existing code style
- Write meaningful commit messages
- Add documentation for new features
- Ensure all tests pass

---

## 📞 **Support & Maintenance**

### **Getting Help**
- Check existing documentation
- Review GitHub issues
- Contact development team
- Submit bug reports

### **Regular Maintenance**
- Update dependencies monthly
- Monitor application performance
- Backup database regularly
- Review security patches

---

**This documentation provides a comprehensive overview of the PropSisters project. For specific implementation details, refer to the individual component files and the extensive documentation already present in the project.**
