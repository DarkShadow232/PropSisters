# Image Storage Location Update

## Summary
Changed the storage location for uploaded property images from `/uploads/rentals/` to `/image/Apartments/` to consolidate all apartment images in one location and simplify URL handling.

## Changes Made

### Backend (Admin Console)

1. **admin-console/routes/adminRoutes.js**
   - Updated multer destination from `public/uploads/rentals/` to `public/image/Apartments/`
   - Storage path now: `path.join(__dirname, '..', 'public', 'image', 'Apartments')`

2. **admin-console/routes/propertyRoutes.js**
   - Updated multer destination from `public/uploads/rentals/` to `public/image/Apartments/`
   - Storage path now: `path.join(__dirname, '..', 'public', 'image', 'Apartments')`

3. **admin-console/controllers/propertyController.js**
   - Updated image path saving from `/uploads/rentals/` to `/image/Apartments/`
   - Both create and edit operations now save paths as `/image/Apartments/${filename}`

4. **admin-console/app.js** (already configured)
   - Serving `/image` route: `app.use('/image', express.static(path.join(__dirname, '..', 'public', 'image')))`
   - This serves both static bundled images and uploaded images

### Frontend

5. **src/services/mongoPropertyService.ts**
   - Updated `getImageUrl()` function to handle two cases:
     - **Uploaded images** (`property-*.jpg`) → served from admin backend at `${BASE_URL}/image/Apartments/...`
     - **Static bundled images** (Ap1, Ap2, etc.) → served from frontend as-is
   - Removed complex `ADMIN_BASE_URL` logic for `/uploads/` paths

### Migration

6. **admin-console/utils/migrateImages.js** (NEW)
   - Migration script to move existing images from old location to new location
   - Updates database paths automatically
   - Safe: copies files before deleting, keeps old path if migration fails

## Benefits

1. **Unified Location**: All apartment images (static and uploaded) in `/image/Apartments/`
2. **Simpler URLs**: No special handling needed for `/uploads/` vs `/image/` paths
3. **Consistent**: Frontend and backend use the same path structure
4. **Easier Debugging**: All images served from one base path
5. **No ENV Changes**: Works with existing `VITE_API_URL` configuration

## Deployment Steps

### On Dokploy (Your Setup)

1. **Commit and push changes:**
   ```bash
   git add .
   git commit -m "Consolidate image storage to /image/Apartments/"
   git push origin master
   ```

2. **Run migration script on server:**
   ```bash
   # SSH into your server or use Dokploy terminal
   cd /path/to/admin-console
   node utils/migrateImages.js
   ```

3. **Restart admin backend:**
   - In Dokploy dashboard, restart the admin-console service

4. **Redeploy frontend:**
   - In Dokploy dashboard, click "Redeploy" on the frontend project
   - This rebuilds with the updated `mongoPropertyService.ts`

5. **Verify:**
   - Create a new property with images
   - Check that images are stored in `admin-console/public/image/Apartments/`
   - Check that images display correctly on the website
   - Check browser Network tab: images should load from `https://api.propsiss.com/image/Apartments/...`

## File Structure After Migration

```
admin-console/
  public/
    image/
      Apartments/
        property-*.png          # Newly uploaded properties (served by admin backend)
        property-*.jpg
    uploads/                    # Can be deleted after migration
      rentals/                  # Old location (empty after migration)

public/                         # Frontend static assets (bundled with frontend)
  image/
    Apartments/
      Ap1/                      # Static apartments (served by frontend)
      Ap2/
      Ap9/
      ...
```

**How it works:**
- Static images like `/image/Apartments/Ap9/1.jpg` → served by frontend (bundled in build)
- Uploaded images like `/image/Apartments/property-1234567890-123456789.png` → served by admin backend at `https://api.propsiss.com`

## Testing Checklist

- [ ] Admin can upload new property images
- [ ] New images save to `/image/Apartments/` folder
- [ ] New images display in admin panel
- [ ] New images display on website
- [ ] Existing migrated images display correctly
- [ ] Static bundled images (Ap1, Ap2, etc.) still work
- [ ] Image URLs in browser Network tab point to correct location
- [ ] No console errors about missing images

## Rollback Plan

If something goes wrong:

1. Revert Git changes:
   ```bash
   git revert HEAD
   git push origin master
   ```

2. Redeploy both frontend and backend in Dokploy

3. Old images are still in `/uploads/rentals/` (migration script copies, doesn't move)

## Environment Variables

No changes needed! The existing configuration works:

```env
VITE_API_URL=https://api.propsiss.com/api
VITE_FRONTEND_URL=https://propsiss.com
```

The `VITE_ADMIN_BASE_URL` variable is no longer needed and can be removed.

