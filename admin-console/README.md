# Rental Admin Console

A comprehensive admin panel for managing the Sisterhood Style Rentals platform. Built with Node.js, Express, and EJS, this console allows administrators to manage properties, users, and bookings through a clean and intuitive interface.

## 🎯 Features

- **Dashboard**: View statistics and recent activity at a glance
- **Property Management**: Create, edit, and delete rental properties with image uploads
- **User Management**: View and manage registered users
- **Booking Management**: Monitor and update booking statuses
- **MongoDB Storage**: All data stored in MongoDB with Mongoose ODM
- **Secure Authentication**: Session-based admin login with password hashing
- **Responsive Design**: Bootstrap 5 UI that works on all devices

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **View Engine**: EJS (Embedded JavaScript Templates)
- **Database**: MongoDB with Mongoose (for all data)
- **File Storage**: Local disk storage for property images
- **Authentication**: express-session, bcryptjs
- **File Upload**: Multer

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

## 🚀 Installation

### 1. Navigate to the admin-console directory

```bash
cd admin-console
```

### 2. Install dependencies

```bash
npm install
```

### 3. MongoDB Setup

You can use either:

- **Local MongoDB**: Install MongoDB locally and it will run on `mongodb://localhost:27017`
- **MongoDB Atlas**: Create a free cluster and get your connection string

### 4. Environment Configuration

Create a `.env` file in the admin-console directory:

```bash
cp env.example .env
```

Edit the `.env` file with your configuration:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration (stores all data)
MONGODB_URI=mongodb://localhost:27017/rental-admin

# Session Secret (generate a random string)
SESSION_SECRET=your-super-secret-session-key-change-this
```

### 5. Create Admin Account

Run the seed script to create your first admin account:

```bash
npm run seed
```

Follow the prompts to enter:
- Admin name
- Admin email
- Admin password (minimum 6 characters)

**Keep these credentials safe!**

## 🎮 Usage

### Development Mode

Run the application with auto-reload (using nodemon):

```bash
npm run dev
```

### Production Mode

Run the application:

```bash
npm start
```

The console will be available at: `http://localhost:3000`

## 🔐 Login

1. Navigate to `http://localhost:3000/auth/login`
2. Enter the email and password you created with the seed script
3. You'll be redirected to the admin dashboard

## 📁 Project Structure

```
admin-console/
├── app.js                  # Main application entry point
├── package.json            # Dependencies and scripts
├── .env                    # Environment variables (create this)
├── config/
│   └── database.js         # MongoDB connection
├── controllers/
│   ├── authController.js   # Authentication logic
│   ├── dashboardController.js
│   ├── propertyController.js
│   ├── userController.js
│   └── bookingController.js
├── models/
│   ├── Admin.js            # Admin user model
│   ├── Rental.js           # Property/rental model
│   ├── User.js             # User model
│   └── Booking.js          # Booking model
├── routes/
│   ├── authRoutes.js       # Login/logout routes
│   └── adminRoutes.js      # Protected admin routes
├── middleware/
│   └── authMiddleware.js   # Authentication middleware
├── views/
│   ├── partials/
│   │   ├── header.ejs      # Header with navigation
│   │   └── footer.ejs      # Footer
│   ├── auth/
│   │   └── login.ejs       # Login page
│   ├── dashboard.ejs       # Main dashboard
│   ├── properties/
│   │   ├── index.ejs       # Properties list
│   │   ├── create.ejs      # Create property form
│   │   └── edit.ejs        # Edit property form
│   ├── users/
│   │   ├── index.ejs       # Users list
│   │   └── view.ejs        # User details
│   └── bookings/
│       ├── index.ejs       # Bookings list
│       └── view.ejs        # Booking details
├── public/
│   ├── css/
│   │   └── style.css       # Custom styles
│   └── uploads/
│       └── rentals/        # Property images
└── utils/
    └── seedAdmin.js        # Script to create admin users
```

## 🔧 Configuration

### MongoDB Collections

The admin console manages the following MongoDB collections:

- `admins` - Admin users for the console
- `rentals` - Rental properties
- `users` - Registered users
- `bookings` - Property bookings

### Session Configuration

Sessions are stored in MongoDB and last for 7 days by default. Configure in `app.js`:

```javascript
cookie: {
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production'
}
```

### File Upload Limits

Maximum file size for property images: **10MB**

Configure in `routes/adminRoutes.js`:

```javascript
limits: {
  fileSize: 10 * 1024 * 1024 // 10MB
}
```

Images are stored locally in `public/uploads/rentals/` directory.

## 🎨 Customization

### Styling

Edit `public/css/style.css` to customize the appearance.

### Adding New Features

1. Create a controller in `controllers/`
2. Add routes in `routes/adminRoutes.js`
3. Create views in `views/`
4. Update navigation in `views/partials/header.ejs`

## 🔒 Security

- Passwords are hashed using bcryptjs
- Sessions are stored securely in MongoDB
- CSRF protection via sessions
- File upload validation
- Environment variables for sensitive data

**Security Best Practices:**

1. Never commit `.env` files
2. Use strong session secrets in production
3. Enable HTTPS in production (set `secure: true` for cookies)
4. Regularly update dependencies
5. Limit admin access to trusted IPs in production

## 🐛 Troubleshooting

### Cannot connect to MongoDB

**Error**: `MongooseServerSelectionError`

**Solution**: 
- Ensure MongoDB is running locally, or
- Check your MongoDB Atlas connection string
- Verify network access in Atlas

### Session issues

**Error**: Session not persisting

**Solution**:
- Check MongoDB connection
- Verify `SESSION_SECRET` is set
- Clear browser cookies

### Image upload fails

**Error**: `LIMIT_FILE_SIZE`

**Solution**:
- Ensure images are under 10MB
- Check disk space
- Verify `public/uploads/rentals/` directory exists and is writable

## 📝 Scripts

- `npm start` - Start the application
- `npm run dev` - Start with nodemon (auto-reload)
- `npm run seed` - Create/update admin account

## 🤝 Integration with Frontend

This admin console can work independently or alongside a frontend application. All data is stored in MongoDB and can be accessed via:

1. Direct MongoDB queries
2. REST API (you can add API routes)
3. GraphQL (you can add GraphQL layer)

## 📄 License

This project is part of Sisterhood Style Rentals platform.

## 🙋 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review MongoDB logs
3. Ensure all environment variables are set correctly
4. Verify MongoDB connection

---

**Happy Managing! 🏠**
