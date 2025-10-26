# Database Migration Guide

## Using migrate-mongo

PropSisters now uses migrate-mongo, a professional MongoDB migration tool that provides simple CLI commands and automatic migration state tracking.

### Available Commands

- `npm run migrate:up` - Run all pending migrations
- `npm run migrate:down` - Rollback last migration
- `npm run migrate:status` - Check migration status
- `npm run migrate:create <name>` - Create new migration file

### Creating a New Migration

1. Create migration file:
   ```bash
   npm run migrate:create add-new-field
   ```

2. Edit the generated file in migrations/ directory with your up() and down() functions

3. Run migration:
   ```bash
   npm run migrate:up
   ```

### Migration File Structure

Each migration has up() and down() functions:

```javascript
module.exports = {
  async up(db) {
    // Apply changes
    await db.collection('collectionName').updateMany(
      { condition },
      { $set: { newField: 'value' } }
    );
  },

  async down(db) {
    // Revert changes
    await db.collection('collectionName').updateMany(
      {},
      { $unset: { newField: "" } }
    );
  }
};
```

### Current Migrations

1. **20240101000000-add-priority-status-fields.js**
   - Adds priority and status fields to rentals
   - Sets default values: priority: 0, status: 'active'

2. **20240101000001-add-paymob-fields.js**
   - Adds Paymob integration fields to bookings
   - Includes paymentStatus, paymobData, totalAmount, etc.

3. **20240101000002-add-calendar-fields.js**
   - Adds calendar management fields to rentals
   - Includes calendar array, basePrice, pricePerDate

4. **20240101000003-create-indexes.js**
   - Creates performance indexes for all collections
   - Includes text search, compound indexes, and unique constraints

### Migration Status

Check which migrations have been applied:
```bash
npm run migrate:status
```

### Rollback Migrations

Rollback the last migration:
```bash
npm run migrate:down
```

### Configuration

Migration configuration is in `migrate-mongo-config.js`:
- Uses environment variable `MONGODB_URI` for database connection
- Migrations stored in `migrations/` directory
- Changelog stored in `changelog` collection

### Best Practices

1. **Always test migrations** on a development database first
2. **Write reversible migrations** with proper down() functions
3. **Use descriptive names** for migration files
4. **Add logging** to track migration progress
5. **Handle errors gracefully** in migration functions

### Troubleshooting

#### Migration Fails
```bash
# Check migration status
npm run migrate:status

# Check database connection
node test-db.js

# Run specific migration manually
npx migrate-mongo up
```

#### Database Connection Issues
- Ensure `MONGODB_URI` is set in `.env` file
- Check MongoDB server is running
- Verify network connectivity to database

#### Index Creation Fails
- Check if indexes already exist
- Ensure sufficient database permissions
- Review index specifications for syntax errors

### Benefits of migrate-mongo

1. **Industry Standard**: Used by thousands of projects
2. **Automatic Tracking**: Knows which migrations have been applied
3. **Simple CLI**: Easy to use commands for all operations
4. **Reversible**: Built-in support for rollbacks
5. **No Custom Code**: No need to maintain migration logic
6. **Better Error Handling**: Professional error reporting and logging
7. **CLI-First**: Perfect for automation and CI/CD pipelines

### Integration with CI/CD

Add to your deployment pipeline:
```bash
# Run migrations before deployment
npm run migrate:up

# Check status after deployment
npm run migrate:status
```

### Support

For migration issues:
1. Check the troubleshooting section above
2. Review migration logs in console output
3. Check database connection and permissions
4. Contact the development team for assistance

---

**PropSisters Migration System** - Powered by migrate-mongo
