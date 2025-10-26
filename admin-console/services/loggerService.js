const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Request Log Schema
const requestLogSchema = new mongoose.Schema({
  method: {
    type: String,
    required: true,
    enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD']
  },
  url: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  query: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  params: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  headers: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  body: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ip: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    default: ''
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  },
  statusCode: {
    type: Number,
    required: true
  },
  responseTime: {
    type: Number,
    required: true
  },
  responseSize: {
    type: Number,
    default: 0
  },
  error: {
    type: String,
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  sessionId: {
    type: String,
    default: null
  },
  referer: {
    type: String,
    default: null
  },
  origin: {
    type: String,
    default: null
  }
});

// Create indexes for performance
requestLogSchema.index({ timestamp: -1 });
requestLogSchema.index({ method: 1, path: 1 });
requestLogSchema.index({ statusCode: 1 });
requestLogSchema.index({ userId: 1 });
requestLogSchema.index({ ip: 1 });
requestLogSchema.index({ url: 'text' });

const RequestLog = mongoose.model('RequestLog', requestLogSchema);

class LoggerService {
  constructor() {
    this.logDir = path.join(__dirname, '../logs');
    this.ensureLogDirectory();
    this.setupLogRotation();
  }

  /**
   * Ensure log directory exists
   */
  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  /**
   * Setup log rotation
   */
  setupLogRotation() {
    // Clean old logs daily at midnight
    const cron = require('node-cron');
    cron.schedule('0 0 * * *', () => {
      this.cleanOldLogs();
    });
  }

  /**
   * Log HTTP request
   */
  async logRequest(req, res, responseTime, error = null) {
    try {
      const logData = {
        method: req.method,
        url: req.originalUrl || req.url,
        path: req.path,
        query: req.query,
        params: req.params,
        headers: this.sanitizeHeaders(req.headers),
        body: this.sanitizeBody(req.body),
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent') || '',
        userId: req.user ? req.user._id : null,
        adminId: req.admin ? req.admin._id : null,
        statusCode: res.statusCode,
        responseTime: responseTime,
        responseSize: res.get('Content-Length') || 0,
        error: error ? error.message : null,
        sessionId: req.sessionID,
        referer: req.get('Referer'),
        origin: req.get('Origin')
      };

      // Save to database
      await RequestLog.create(logData);

      // Save to file for backup
      await this.logToFile(logData);

      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        this.logToConsole(logData);
      }

    } catch (error) {
      console.error('Error logging request:', error);
    }
  }

  /**
   * Sanitize headers to remove sensitive information
   */
  sanitizeHeaders(headers) {
    const sanitized = { ...headers };
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key', 'x-auth-token'];
    
    sensitiveHeaders.forEach(header => {
      if (sanitized[header]) {
        sanitized[header] = '***HIDDEN***';
      }
    });

    return sanitized;
  }

  /**
   * Sanitize request body to remove sensitive information
   */
  sanitizeBody(body) {
    if (!body || typeof body !== 'object') {
      return body;
    }

    const sanitized = { ...body };
    const sensitiveFields = ['password', 'currentPassword', 'newPassword', 'token', 'secret'];

    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '***HIDDEN***';
      }
    });

    return sanitized;
  }

  /**
   * Log to file
   */
  async logToFile(logData) {
    try {
      const date = new Date().toISOString().split('T')[0];
      const logFile = path.join(this.logDir, `requests-${date}.log`);
      const logEntry = JSON.stringify({
        timestamp: new Date().toISOString(),
        ...logData
      }) + '\n';

      fs.appendFileSync(logFile, logEntry);
    } catch (error) {
      console.error('Error writing to log file:', error);
    }
  }

  /**
   * Log to console
   */
  logToConsole(logData) {
    const statusColor = this.getStatusColor(logData.statusCode);
    const methodColor = this.getMethodColor(logData.method);
    
    console.log(
      `${statusColor}${logData.statusCode}\x1b[0m ` +
      `${methodColor}${logData.method}\x1b[0m ` +
      `\x1b[36m${logData.path}\x1b[0m ` +
      `\x1b[33m${logData.responseTime}ms\x1b[0m ` +
      `\x1b[90m${logData.ip}\x1b[0m`
    );

    if (logData.error) {
      console.error(`\x1b[31mError: ${logData.error}\x1b[0m`);
    }
  }

  /**
   * Get status code color
   */
  getStatusColor(statusCode) {
    if (statusCode >= 500) return '\x1b[31m'; // Red
    if (statusCode >= 400) return '\x1b[33m'; // Yellow
    if (statusCode >= 300) return '\x1b[36m'; // Cyan
    if (statusCode >= 200) return '\x1b[32m'; // Green
    return '\x1b[0m'; // Default
  }

  /**
   * Get HTTP method color
   */
  getMethodColor(method) {
    const colors = {
      GET: '\x1b[32m',     // Green
      POST: '\x1b[33m',    // Yellow
      PUT: '\x1b[34m',     // Blue
      PATCH: '\x1b[35m',   // Magenta
      DELETE: '\x1b[31m',  // Red
      OPTIONS: '\x1b[36m', // Cyan
      HEAD: '\x1b[37m'     // White
    };
    return colors[method] || '\x1b[0m';
  }

  /**
   * Get request statistics
   */
  async getStats(timeRange = '24h') {
    try {
      const now = new Date();
      let startTime;

      switch (timeRange) {
        case '1h':
          startTime = new Date(now.getTime() - 60 * 60 * 1000);
          break;
        case '24h':
          startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      }

      const stats = await RequestLog.aggregate([
        {
          $match: {
            timestamp: { $gte: startTime }
          }
        },
        {
          $group: {
            _id: null,
            totalRequests: { $sum: 1 },
            avgResponseTime: { $avg: '$responseTime' },
            totalErrors: {
              $sum: {
                $cond: [{ $ne: ['$error', null] }, 1, 0]
              }
            },
            statusCodes: {
              $push: '$statusCode'
            },
            methods: {
              $push: '$method'
            },
            uniqueIPs: {
              $addToSet: '$ip'
            }
          }
        },
        {
          $project: {
            totalRequests: 1,
            avgResponseTime: { $round: ['$avgResponseTime', 2] },
            totalErrors: 1,
            errorRate: {
              $round: [
                { $multiply: [{ $divide: ['$totalErrors', '$totalRequests'] }, 100] },
                2
              ]
            },
            uniqueIPs: { $size: '$uniqueIPs' },
            statusCodeDistribution: {
              $reduce: {
                input: '$statusCodes',
                initialValue: {},
                in: {
                  $mergeObjects: [
                    '$$value',
                    {
                      $arrayToObject: [
                        [{
                          k: { $toString: '$$this' },
                          v: 1
                        }]
                      ]
                    }
                  ]
                }
              }
            },
            methodDistribution: {
              $reduce: {
                input: '$methods',
                initialValue: {},
                in: {
                  $mergeObjects: [
                    '$$value',
                    {
                      $arrayToObject: [
                        [{
                          k: '$$this',
                          v: 1
                        }]
                      ]
                    }
                  ]
                }
              }
            }
          }
        }
      ]);

      return stats[0] || {
        totalRequests: 0,
        avgResponseTime: 0,
        totalErrors: 0,
        errorRate: 0,
        uniqueIPs: 0,
        statusCodeDistribution: {},
        methodDistribution: {}
      };
    } catch (error) {
      console.error('Error getting request stats:', error);
      return null;
    }
  }

  /**
   * Get recent requests
   */
  async getRecentRequests(limit = 100, filters = {}) {
    try {
      const query = { ...filters };
      
      if (filters.startDate || filters.endDate) {
        query.timestamp = {};
        if (filters.startDate) query.timestamp.$gte = new Date(filters.startDate);
        if (filters.endDate) query.timestamp.$lte = new Date(filters.endDate);
        delete query.startDate;
        delete query.endDate;
      }

      const requests = await RequestLog.find(query)
        .sort({ timestamp: -1 })
        .limit(limit)
        .populate('userId', 'email displayName')
        .populate('adminId', 'email name')
        .lean();

      return requests;
    } catch (error) {
      console.error('Error getting recent requests:', error);
      return [];
    }
  }

  /**
   * Get error logs
   */
  async getErrorLogs(limit = 50) {
    try {
      const errors = await RequestLog.find({
        error: { $ne: null }
      })
        .sort({ timestamp: -1 })
        .limit(limit)
        .populate('userId', 'email displayName')
        .populate('adminId', 'email name')
        .lean();

      return errors;
    } catch (error) {
      console.error('Error getting error logs:', error);
      return [];
    }
  }

  /**
   * Clean old logs
   */
  async cleanOldLogs() {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
      // Clean database logs older than 30 days
      const result = await RequestLog.deleteMany({
        timestamp: { $lt: thirtyDaysAgo }
      });

      console.log(`🧹 Cleaned ${result.deletedCount} old request logs from database`);

      // Clean file logs older than 7 days
      const files = fs.readdirSync(this.logDir);
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      files.forEach(file => {
        if (file.startsWith('requests-') && file.endsWith('.log')) {
          const filePath = path.join(this.logDir, file);
          const stats = fs.statSync(filePath);
          
          if (stats.mtime < sevenDaysAgo) {
            fs.unlinkSync(filePath);
            console.log(`🧹 Deleted old log file: ${file}`);
          }
        }
      });

    } catch (error) {
      console.error('Error cleaning old logs:', error);
    }
  }

  /**
   * Export logs to CSV
   */
  async exportLogs(startDate, endDate, format = 'csv') {
    try {
      const query = {
        timestamp: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };

      const logs = await RequestLog.find(query)
        .sort({ timestamp: -1 })
        .lean();

      if (format === 'csv') {
        const csv = this.convertToCSV(logs);
        return csv;
      } else if (format === 'json') {
        return JSON.stringify(logs, null, 2);
      }

      return logs;
    } catch (error) {
      console.error('Error exporting logs:', error);
      return null;
    }
  }

  /**
   * Convert logs to CSV format
   */
  convertToCSV(logs) {
    if (logs.length === 0) return '';

    const headers = [
      'timestamp', 'method', 'url', 'path', 'statusCode', 'responseTime',
      'ip', 'userAgent', 'userId', 'adminId', 'error'
    ];

    const csvRows = [headers.join(',')];

    logs.forEach(log => {
      const row = headers.map(header => {
        const value = log[header] || '';
        return `"${value.toString().replace(/"/g, '""')}"`;
      });
      csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
  }
}

module.exports = LoggerService;
