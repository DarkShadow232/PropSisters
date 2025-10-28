# PropSisters Migration and Logging System

## 🗄️ Database Migration System

### Overview
The PropSisters admin console includes a comprehensive database migration system that handles schema updates, data migrations, and version control.

### Migration Features
- **Version Control**: Track database schema versions
- **Automatic Execution**: Migrations run on application startup
- **Rollback Support**: Ability to rollback to previous versions
- **Index Management**: Automatic creation of performance indexes
- **Data Updates**: Update existing records with new fields

### Migration Files
- `services/migrationService.js` - Main migration service
- `utils/migrate.js` - Command-line migration tool
- `utils/simple-migrate.js` - Simplified migration for startup

### Available Migrations
1. **v1.0.0** - Initial Schema Setup
2. **v1.1.0** - Add Priority and Status Fields
3. **v1.2.0** - Add Paymob Integration Fields
4. **v1.3.0** - Add Calendar Management Fields
5. **v1.4.0** - Create Payment Model

### Running Migrations

#### Automatic Migration (Recommended)
Migrations run automatically when the application starts:
```bash
npm start
```

#### Manual Migration
```bash
# Run all pending migrations
npm run migrate

# Check migration status
npm run migrate:status

# Rollback to specific version
npm run migrate:rollback 1.2.0
```

#### Command Line Tool
```bash
# Run migrations
node utils/migrate.js run

# Check status
node utils/migrate.js status

# Rollback
node utils/migrate.js rollback 1.2.0
```

### Migration Status
The system tracks migration status in the `migrations` collection:
```javascript
{
  version: "1.4.0",
  updatedAt: "2024-01-15T10:30:00Z"
}
```

## 📊 Request Logging System

### Overview
Comprehensive request logging system that captures all HTTP requests, responses, and performance metrics.

### Logging Features
- **Database Storage**: All requests stored in MongoDB
- **File Backup**: Daily log files for backup
- **Performance Metrics**: Response times, status codes, error rates
- **User Tracking**: Link requests to authenticated users
- **IP Tracking**: Monitor unique visitors
- **Error Logging**: Detailed error capture and analysis

### Log Schema
```javascript
{
  method: "GET|POST|PUT|PATCH|DELETE",
  url: "/api/properties",
  path: "/api/properties",
  query: {},
  params: {},
  headers: {},
  body: {},
  ip: "192.168.1.1",
  userAgent: "Mozilla/5.0...",
  userId: ObjectId,
  adminId: ObjectId,
  statusCode: 200,
  responseTime: 150,
  responseSize: 1024,
  error: null,
  timestamp: Date,
  sessionId: "sess_123",
  referer: "https://example.com",
  origin: "https://example.com"
}
```

### Logging Components
- `services/loggerService.js` - Main logging service
- `middleware/requestLogger.js` - Express middleware
- `routes/logRoutes.js` - Admin API endpoints
- `views/logs/index.ejs` - Admin interface

### Admin Interface
Access the logs interface at: `/admin/logs`

#### Features
- **Statistics Dashboard**: Request counts, response times, error rates
- **Request Filtering**: Filter by status code, method, time range
- **Error Analysis**: View and analyze error logs
- **Export Functionality**: Export logs as CSV or JSON
- **Log Cleanup**: Remove old logs automatically

#### API Endpoints
```javascript
GET /api/logs/stats?range=24h          // Get statistics
GET /api/logs/requests?limit=100       // Get recent requests
GET /api/logs/errors?limit=50          // Get error logs
GET /api/logs/export?startDate=...     // Export logs
POST /api/logs/clean                    // Clean old logs
```

### Performance Optimization
The logging system includes several performance optimizations:

#### Database Indexes
```javascript
// Request logs indexes
{ timestamp: -1 }                    // Time-based queries
{ method: 1, path: 1 }              // Method and path filtering
{ statusCode: 1 }                   // Status code filtering
{ userId: 1 }                       // User-based queries
{ ip: 1 }                          // IP-based queries
{ url: 'text' }                    // Text search
```

#### Log Rotation
- **Database**: Logs older than 30 days are automatically deleted
- **Files**: Log files older than 7 days are automatically deleted
- **Cleanup**: Runs daily at midnight via cron job

### Security Features
- **Sensitive Data Protection**: Passwords and tokens are automatically hidden
- **IP Logging**: Track suspicious activity
- **User Tracking**: Monitor admin and user actions
- **Error Monitoring**: Detect and alert on system errors

## 🚀 Getting Started

### 1. Environment Setup
Ensure your `.env` file includes:
```env
MONGODB_URI=mongodb://localhost:27017/propsisters
NODE_ENV=development
```

### 2. Database Connection
The system will automatically:
- Connect to MongoDB
- Run pending migrations
- Create necessary indexes
- Set up logging infrastructure

### 3. Start the Application
```bash
npm start
```

### 4. Access Admin Interface
- **Main Dashboard**: `http://localhost:3000/admin`
- **Request Logs**: `http://localhost:3000/admin/logs`
- **API Documentation**: `https://api.propsiss.com/api/docs`

## 📈 Monitoring and Analytics

### Key Metrics Tracked
- **Request Volume**: Total requests per time period
- **Response Times**: Average and peak response times
- **Error Rates**: Percentage of failed requests
- **User Activity**: Unique users and their actions
- **Performance**: System performance indicators

### Alerting
The system can be configured to send alerts for:
- High error rates (>5%)
- Slow response times (>2 seconds)
- Unusual traffic patterns
- Database connection issues

### Reporting
Generate reports on:
- Daily/weekly/monthly request statistics
- User activity patterns
- Error analysis and trends
- Performance metrics
- Security incidents

## 🔧 Configuration

### Logging Configuration
```javascript
// In loggerService.js
const logConfig = {
  maxLogAge: 30, // days
  maxFileAge: 7, // days
  logLevel: 'info',
  enableConsoleLogging: true,
  enableFileLogging: true,
  enableDatabaseLogging: true
};
```

### Migration Configuration
```javascript
// In migrationService.js
const migrationConfig = {
  autoRun: true,
  backupBeforeMigration: false,
  rollbackOnError: false,
  logLevel: 'info'
};
```

## 🛠️ Troubleshooting

### Common Issues

#### Migration Failures
```bash
# Check database connection
node test-db.js

# Run migration manually
npm run migrate

# Check migration status
npm run migrate:status
```

#### Logging Issues
```bash
# Check log directory permissions
ls -la logs/

# Verify database indexes
mongo propsisters --eval "db.requestlogs.getIndexes()"
```

#### Performance Issues
- Check database indexes are created
- Monitor log file sizes
- Clean old logs regularly
- Optimize query filters

### Debug Mode
Enable debug logging:
```env
DEBUG=propsisters:*
NODE_ENV=development
```

## 📚 API Reference

### Migration API
```javascript
// Get migration status
const status = await migrationService.getStatus();

// Run migrations
await migrationService.runMigrations();

// Rollback
await migrationService.rollback('1.2.0');
```

### Logging API
```javascript
// Get statistics
const stats = await loggerService.getStats('24h');

// Get recent requests
const requests = await loggerService.getRecentRequests(100);

// Export logs
const csv = await loggerService.exportLogs(startDate, endDate, 'csv');
```

## 🔒 Security Considerations

### Data Protection
- Sensitive fields are automatically sanitized
- Passwords and tokens are never logged
- IP addresses are tracked for security
- User sessions are monitored

### Access Control
- Log viewing requires admin authentication
- API endpoints are protected
- Export functionality is restricted
- Cleanup operations require confirmation

### Compliance
- GDPR compliance for user data
- Data retention policies
- Audit trail maintenance
- Privacy protection measures

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Check the application logs
4. Contact the development team

---

**PropSisters Migration and Logging System** - Version 1.4.0
