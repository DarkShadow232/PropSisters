const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/authMiddleware');

// Import separated route modules
const propertyRoutes = require('./propertyRoutes');
const userRoutes = require('./userRoutes');
const bookingRoutes = require('./bookingRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const frontendAuthRoutes = require('./frontendAuthRoutes');
const finishRequestRoutes = require('./finishRequestRoutes');

// ==================== PUBLIC ROUTES ====================
// Frontend authentication routes (Firebase integration)
router.use('/auth', frontendAuthRoutes);

// Public property routes (no authentication required)
router.use('/properties', propertyRoutes);
router.use('/public/properties', propertyRoutes);

// Public booking routes (authentication required for most)
router.use('/bookings', bookingRoutes);

// Public finish request routes (authentication required)
router.use('/finish-requests', finishRequestRoutes);

// ==================== ADMIN ROUTES (AUTHENTICATED) ====================
// Create admin router with authentication middleware
const adminRouter = express.Router();
adminRouter.use(isAuthenticated);

// Mount entity routes under /admin
adminRouter.use('/dashboard', dashboardRoutes);
adminRouter.use('/properties', propertyRoutes);
adminRouter.use('/users', userRoutes);
adminRouter.use('/bookings', bookingRoutes);
adminRouter.use('/finish-requests', finishRequestRoutes);

// Mount admin router at /api/admin
router.use('/admin', adminRouter);

module.exports = router;
