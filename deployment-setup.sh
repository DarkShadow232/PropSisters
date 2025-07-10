#!/bin/bash

# VPS Deployment Setup Script for Sisterhood Style Rentals
echo "🚀 Starting VPS setup for Sisterhood Style Rentals..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x (LTS)
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Nginx
echo "📦 Installing Nginx..."
sudo apt install nginx -y

# Install PM2 (Process Manager)
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Install Git
echo "📦 Installing Git..."
sudo apt install git -y

# Install UFW (Firewall)
echo "🔐 Setting up firewall..."
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /var/www/sisterhood-rentals
sudo chown -R $USER:$USER /var/www/sisterhood-rentals

# Enable Nginx
echo "🌐 Starting Nginx..."
sudo systemctl start nginx
sudo systemctl enable nginx

echo "✅ VPS setup completed!"
echo "🔍 Check Node.js version:"
node --version
echo "🔍 Check npm version:"
npm --version
echo "🔍 Next steps:"
echo "1. Clone your repository"
echo "2. Install dependencies"
echo "3. Build the project"
echo "4. Configure Nginx"
echo "5. Setup PM2" 