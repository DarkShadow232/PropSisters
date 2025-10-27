#!/bin/bash

# Build script for PropSisters Frontend
set -e

echo "🚀 Starting PropSisters Frontend Build..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Set permissions for node_modules binaries
echo "🔧 Setting permissions..."
chmod +x node_modules/.bin/*

# Build the application
echo "🏗️ Building application..."
npm run build

echo "✅ Build completed successfully!"
echo "📁 Build output: ./dist"
