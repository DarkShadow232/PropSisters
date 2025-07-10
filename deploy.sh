#!/bin/bash

# Deployment Script for Sisterhood Style Rentals
# Usage: ./deploy.sh

echo "🚀 Starting deployment process..."

# Configuration
APP_NAME="sisterhood-rentals"
APP_DIR="/var/www/$APP_NAME"
NGINX_CONFIG="/etc/nginx/sites-available/$APP_NAME"
NGINX_ENABLED="/etc/nginx/sites-enabled/$APP_NAME"
REPO_URL="https://github.com/your-username/sisterhood-style-rentals.git"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_error "Please don't run this script as root"
    exit 1
fi

# Step 1: Navigate to app directory
print_status "Navigating to application directory..."
cd $APP_DIR || {
    print_error "Application directory not found. Please run setup first."
    exit 1
}

# Step 2: Pull latest changes from Git
print_status "Pulling latest changes from repository..."
git pull origin main || {
    print_error "Failed to pull from repository"
    exit 1
}

# Step 3: Install dependencies
print_status "Installing dependencies..."
npm install || {
    print_error "Failed to install dependencies"
    exit 1
}

# Step 4: Build the application
print_status "Building application for production..."
npm run build || {
    print_error "Build failed"
    exit 1
}

# Step 5: Copy build files (if using different structure)
print_status "Ensuring build files are in correct location..."
if [ -d "dist" ]; then
    print_success "Build directory found"
else
    print_error "Build directory not found"
    exit 1
fi

# Step 6: Set correct permissions
print_status "Setting correct permissions..."
sudo chown -R www-data:www-data $APP_DIR/dist
sudo chmod -R 755 $APP_DIR/dist

# Step 7: Test Nginx configuration
print_status "Testing Nginx configuration..."
sudo nginx -t || {
    print_error "Nginx configuration test failed"
    exit 1
}

# Step 8: Reload Nginx
print_status "Reloading Nginx..."
sudo systemctl reload nginx || {
    print_error "Failed to reload Nginx"
    exit 1
}

# Step 9: Check if site is running
print_status "Checking site status..."
sleep 2
if curl -f -s http://localhost > /dev/null; then
    print_success "Site is running successfully!"
else
    print_warning "Site might not be accessible. Check Nginx logs."
fi

# Step 10: Display deployment info
echo ""
echo "=================================================="
print_success "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo "=================================================="
print_status "App Name: $APP_NAME"
print_status "App Directory: $APP_DIR"
print_status "Build Directory: $APP_DIR/dist"
print_status "Nginx Config: $NGINX_CONFIG"
echo ""
print_status "📊 Quick Status Check:"
echo "   - Node.js: $(node --version)"
echo "   - npm: $(npm --version)"
echo "   - Nginx: $(nginx -v 2>&1)"
echo ""
print_status "🔍 Useful Commands:"
echo "   - Check Nginx status: sudo systemctl status nginx"
echo "   - Check Nginx logs: sudo tail -f /var/log/nginx/error.log"
echo "   - Restart Nginx: sudo systemctl restart nginx"
echo "   - View site: curl http://localhost"
echo ""
print_warning "Don't forget to:"
echo "   1. Configure your domain DNS to point to your VPS IP"
echo "   2. Setup SSL certificate (Let's Encrypt recommended)"
echo "   3. Configure Firebase hosting domain (if needed)"
echo "==================================================" 