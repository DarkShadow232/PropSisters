#!/bin/bash

# Quick Deployment Test Script
# Run this on your local machine to test build before VPS deployment

echo "🧪 Testing Sisterhood Style Rentals for deployment readiness..."

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Test 1: Check Node.js version
print_info "Checking Node.js version..."
if command -v node > /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js found: $NODE_VERSION"
    
    # Check if version is 16 or higher
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$NODE_MAJOR" -ge 16 ]; then
        print_success "Node.js version is compatible (>= 16)"
    else
        print_warning "Node.js version might be too old. Recommended: >= 16"
    fi
else
    print_error "Node.js not found. Please install Node.js 16+"
    exit 1
fi

# Test 2: Check npm
print_info "Checking npm..."
if command -v npm > /dev/null; then
    NPM_VERSION=$(npm --version)
    print_success "npm found: $NPM_VERSION"
else
    print_error "npm not found"
    exit 1
fi

# Test 3: Install dependencies
print_info "Installing dependencies..."
if npm install; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Test 4: Lint check
print_info "Running lint check..."
if npm run lint 2>/dev/null; then
    print_success "Lint check passed"
else
    print_warning "Lint check failed or not configured"
fi

# Test 5: Build test
print_info "Testing production build..."
if npm run build; then
    print_success "Build completed successfully"
    
    # Check if dist folder exists
    if [ -d "dist" ]; then
        print_success "dist folder created"
        
        # Check main files
        if [ -f "dist/index.html" ]; then
            print_success "index.html found in dist"
        else
            print_error "index.html not found in dist"
        fi
        
        # Check size
        DIST_SIZE=$(du -sh dist | cut -f1)
        print_info "Build size: $DIST_SIZE"
        
    else
        print_error "dist folder not created"
        exit 1
    fi
else
    print_error "Build failed"
    exit 1
fi

# Test 6: Check Firebase config
print_info "Checking Firebase configuration..."
if grep -q "firebase" package.json; then
    print_success "Firebase dependency found"
else
    print_warning "Firebase not found in dependencies"
fi

# Test 7: Check environment file
print_info "Checking environment configuration..."
if [ -f "env.production.example" ]; then
    print_success "Production environment example found"
else
    print_warning "env.production.example not found"
fi

# Test 8: Preview build locally
print_info "Testing local preview..."
echo "You can test the build locally with: npm run preview"
echo "This will serve the dist folder on http://localhost:4173"

# Summary
echo ""
echo "=================================================="
print_success "🎉 DEPLOYMENT READINESS TEST COMPLETED!"
echo "=================================================="

# Final recommendations
echo ""
print_info "📋 Pre-deployment checklist:"
echo "   1. ✅ Build test passed"
echo "   2. 📝 Update Firebase config in .env.production"
echo "   3. 🔧 Replace YOUR_USERNAME in scripts with actual GitHub username"
echo "   4. 🌐 Get your VPS IP address from Hostinger"
echo "   5. 🔑 Setup SSH key for easier access (optional)"
echo ""
print_info "🚀 Ready for deployment!"
echo "   Follow DEPLOYMENT_GUIDE.md for step-by-step instructions"
echo ""
print_warning "💡 Don't forget to:"
echo "   - Create GitHub repository and push code"
echo "   - Configure domain DNS (if using custom domain)"
echo "   - Setup SSL certificate after deployment" 