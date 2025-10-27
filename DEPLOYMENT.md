# Dokploy Deployment Guide for PropSisters Frontend

## Issue Fixed
The original error was caused by permission issues with the Vite executable in the Docker build process.

## Solution
Created proper Docker configuration files to handle the build process correctly.

## Files Created/Modified

### 1. Dockerfile
- Multi-stage build process
- Uses Node.js 18 Alpine
- Proper permission handling
- Nginx for serving static files

### 2. nginx.conf
- Configured for React SPA routing
- Static asset caching
- Security headers
- Health check endpoint

### 3. .dockerignore
- Optimizes build by excluding unnecessary files
- Reduces build context size

### 4. vite.config.ts (Modified)
- Fixed base path for production deployment
- Removed `/PropSisters/` prefix that was causing routing issues

## Dokploy Configuration

### Build Settings
- **Dockerfile**: Use the provided `Dockerfile`
- **Build Context**: Root directory
- **Port**: 80 (nginx default)

### Environment Variables
Set these in Dokploy:
```
NODE_ENV=production
VITE_API_URL=https://your-backend-domain.com/api
```

### Build Command
The Dockerfile handles the build process automatically:
1. Installs dependencies
2. Builds the React app
3. Serves with nginx

## Alternative Dockerfile
If you still encounter issues, use `Dockerfile.simple` which:
- Uses npm instead of bun
- Sets explicit permissions
- Has simpler build process

## Troubleshooting

### If build still fails:
1. Use `Dockerfile.simple` instead
2. Check that all files are committed to git
3. Ensure `.dockerignore` is in the root directory
4. Verify nginx.conf is in the root directory

### If app doesn't load:
1. Check nginx logs in Dokploy
2. Verify environment variables are set
3. Check that the build completed successfully

## Expected Build Output
```
✅ Dependencies installed
✅ React app built successfully
✅ Nginx configured
✅ App served on port 80
```

## Health Check
The app includes a health check endpoint at `/health` that returns "healthy" if the server is running.
