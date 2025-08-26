#!/bin/bash

# TailorTech Deployment Script
# Supports both Vercel and Netlify deployments

echo "🚀 TailorTech Deployment Script"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔨 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

echo ""
echo "✅ Build successful!"
echo ""
echo "Choose your deployment platform:"
echo "1) Vercel"
echo "2) Netlify"
echo "3) Exit"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "📤 Deploying to Vercel..."
        
        # Check if Vercel CLI is installed
        if ! command -v vercel &> /dev/null; then
            echo "Installing Vercel CLI..."
            npm i -g vercel
        fi
        
        echo ""
        echo "Starting Vercel deployment..."
        vercel --prod
        
        echo ""
        echo "✅ Deployment to Vercel complete!"
        echo ""
        echo "⚠️  Remember to set environment variables in Vercel dashboard:"
        echo "   - GOOGLE_API_KEY"
        echo "   - GOOGLE_CX"
        echo "   - SCRAPINGDOG_API_KEY"
        ;;
        
    2)
        echo ""
        echo "📤 Deploying to Netlify..."
        
        # Check if Netlify CLI is installed
        if ! command -v netlify &> /dev/null; then
            echo "Installing Netlify CLI..."
            npm i -g netlify-cli
        fi
        
        echo ""
        echo "Starting Netlify deployment..."
        netlify deploy --prod
        
        echo ""
        echo "✅ Deployment to Netlify complete!"
        echo ""
        echo "⚠️  Remember to set environment variables in Netlify dashboard:"
        echo "   - GOOGLE_API_KEY"
        echo "   - GOOGLE_CX"
        echo "   - SCRAPINGDOG_API_KEY"
        ;;
        
    3)
        echo "Exiting..."
        exit 0
        ;;
        
    *)
        echo "Invalid choice. Exiting..."
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment process complete!"
echo ""
echo "Next steps:"
echo "1. Set environment variables in your hosting platform"
echo "2. Update Firebase authorized domains"
echo "3. Test all features in production"
echo ""
echo "Happy deploying! 🚀"
