const express = require('express');
const router = express.Router();
const finishRequestController = require('../controllers/finishRequestController');
const { isUserAuthenticated, isAdmin } = require('../middleware/authMiddleware');

// Public routes
router.post('/create', 
  isUserAuthenticated, 
  finishRequestController.uploadFiles, 
  finishRequestController.createFinishRequest
);

// User routes
router.get('/user/:userId', isUserAuthenticated, finishRequestController.getUserFinishRequests);
router.get('/:id', isUserAuthenticated, finishRequestController.getFinishRequest);

// Admin routes
router.get('/admin/all', isAdmin, finishRequestController.getAllFinishRequests);
router.put('/:id', isAdmin, finishRequestController.updateFinishRequest);

module.exports = router;
