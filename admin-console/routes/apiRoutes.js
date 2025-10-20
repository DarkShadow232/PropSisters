const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/authMiddleware');

// Import separated route modules
const propertyRoutes = require('./propertyRoutes');
const userRoutes = require('./userRoutes');
const bookingRoutes = require('./bookingRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const frontendAuthRoutes = require('./frontendAuthRoutes');

// ==================== PUBLIC ROUTES ====================
// Frontend authentication routes (Firebase integration)
router.use('/auth', frontendAuthRoutes);

// Public property routes (no authentication required)
router.use('/properties', propertyRoutes);
router.use('/public/properties', propertyRoutes);

// ==================== ADMIN ROUTES (AUTHENTICATED) ====================
// Create admin router with authentication middleware
const adminRouter = express.Router();
adminRouter.use(isAuthenticated);

// Mount entity routes under /admin
adminRouter.use('/dashboard', dashboardRoutes);
adminRouter.use('/properties', propertyRoutes);
adminRouter.use('/users', userRoutes);
adminRouter.use('/bookings', bookingRoutes);

// Mount admin router at /api/admin
router.use('/admin', adminRouter);

module.exports = router;
