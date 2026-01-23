#!/bin/bash

# Lumina Deployment Script
# This script prepares and deploys the Lumina platform

set -e  # Exit on error

echo "🚀 Lumina Deployment Script"
echo "============================"
echo ""

# Step 1: Check for required files
echo "📋 Step 1: Checking required files..."

if [ ! -f "public/favicon.ico" ]; then
    echo "⚠️  Warning: public/favicon.ico is missing"
    echo "   Create one at: https://favicon.io"
fi

if [ ! -f "public/og-image.png" ]; then
    echo "⚠️  Warning: public/og-image.png is missing"
    echo "   Create one at: https://og-image.xyz"
fi

if [ ! -f "public/apple-touch-icon.png" ]; then
    echo "⚠️  Warning: public/apple-touch-icon.png is missing"
fi

echo ""

# Step 2: Run production build test
echo "🔨 Step 2: Testing production build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Fix errors before deploying."
    exit 1
fi

echo ""

# Step 3: Git commit
echo "📦 Step 3: Committing changes..."
git add .
git commit -m "Production ready - $(date +%Y-%m-%d)" || echo "No changes to commit"

echo ""

# Step 4: Deployment options
echo "🌐 Step 4: Choose deployment method:"
echo "   1) Deploy to Vercel (recommended)"
echo "   2) Deploy to Netlify"
echo "   3) Push to GitHub only"
echo "   4) Cancel"
echo ""

read -p "Enter choice [1-4]: " choice

case $choice in
    1)
        echo ""
        echo "Deploying to Vercel..."
        if command -v vercel &> /dev/null; then
            vercel --prod
        else
            echo "❌ Vercel CLI not installed."
            echo "   Install with: npm i -g vercel"
            echo "   Then run: vercel --prod"
        fi
        ;;
    2)
        echo ""
        echo "Deploying to Netlify..."
        if command -v netlify &> /dev/null; then
            netlify deploy --prod
        else
            echo "❌ Netlify CLI not installed."
            echo "   Install with: npm i -g netlify-cli"
            echo "   Then run: netlify deploy --prod"
        fi
        ;;
    3)
        echo ""
        echo "Pushing to GitHub..."
        read -p "Enter remote name (default: origin): " remote
        remote=${remote:-origin}
        git push $remote main
        echo "✅ Pushed to GitHub!"
        echo "   Now deploy via Vercel/Netlify dashboard"
        ;;
    4)
        echo "Deployment cancelled."
        exit 0
        ;;
    *)
        echo "Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Add environment variables in your hosting dashboard"
echo "   2. Configure custom domain"
echo "   3. Verify deployment at your URL"
echo "   4. Run Lighthouse audit"
echo ""
echo "See DEPLOYMENT.md for detailed instructions."
