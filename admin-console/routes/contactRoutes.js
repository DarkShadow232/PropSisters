const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { isAuthenticated } = require('../middleware/authMiddleware');

// Public routes (no authentication required)
router.post('/', contactController.createContact);

// Admin routes (authentication required)
router.use(isAuthenticated);

router.get('/', contactController.getAllContacts);
router.get('/stats', contactController.getContactStats);
router.get('/:id', contactController.getContactById);
router.put('/:id', contactController.updateContact);
router.delete('/:id', contactController.deleteContact);

module.exports = router;
