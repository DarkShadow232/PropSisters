const express = require('express');
const router = express.Router();
const LoggerService = require('../services/loggerService');
const { isAdmin } = require('../middleware/authMiddleware');

const loggerService = new LoggerService();

// Get request statistics
router.get('/stats', isAdmin, async (req, res) => {
  try {
    const timeRange = req.query.range || '24h';
    const stats = await loggerService.getStats(timeRange);
    
    res.json({
      success: true,
      stats,
      timeRange
    });
  } catch (error) {
    console.error('Error getting request stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get request statistics'
    });
  }
});

// Get recent requests
router.get('/requests', isAdmin, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      statusCode: req.query.statusCode,
      method: req.query.method,
      path: req.query.path
    };

    // Remove undefined filters
    Object.keys(filters).forEach(key => {
      if (filters[key] === undefined) {
        delete filters[key];
      }
    });

    const requests = await loggerService.getRecentRequests(limit, filters);
    
    res.json({
      success: true,
      requests,
      count: requests.length
    });
  } catch (error) {
    console.error('Error getting recent requests:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get recent requests'
    });
  }
});

// Get error logs
router.get('/errors', isAdmin, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const errors = await loggerService.getErrorLogs(limit);
    
    res.json({
      success: true,
      errors,
      count: errors.length
    });
  } catch (error) {
    console.error('Error getting error logs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get error logs'
    });
  }
});

// Export logs
router.get('/export', isAdmin, async (req, res) => {
  try {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate || new Date().toISOString();
    const format = req.query.format || 'csv';

    if (!startDate) {
      return res.status(400).json({
        success: false,
        error: 'Start date is required'
      });
    }

    const logs = await loggerService.exportLogs(startDate, endDate, format);
    
    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="request-logs-${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(logs);
    } else {
      res.json({
        success: true,
        logs: JSON.parse(logs)
      });
    }
  } catch (error) {
    console.error('Error exporting logs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export logs'
    });
  }
});

// Clean old logs
router.post('/clean', isAdmin, async (req, res) => {
  try {
    await loggerService.cleanOldLogs();
    
    res.json({
      success: true,
      message: 'Old logs cleaned successfully'
    });
  } catch (error) {
    console.error('Error cleaning logs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clean old logs'
    });
  }
});

module.exports = router;
