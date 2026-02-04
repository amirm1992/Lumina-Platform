#!/bin/bash

# Lumina Deployment Script
# This script prepares and deploys the Lumina platform to Digital Ocean

set -e  # Exit on error

echo "🚀 Lumina Deployment Script"
echo "============================"
echo "🌊 Hosting: Digital Ocean App Platform"
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
echo "   1) Push to GitHub (triggers Digital Ocean auto-deploy)"
echo "   2) Deploy via doctl CLI"
echo "   3) Cancel"
echo ""

read -p "Enter choice [1-3]: " choice

case $choice in
    1)
        echo ""
        echo "Pushing to GitHub..."
        read -p "Enter remote name (default: origin): " remote
        remote=${remote:-origin}
        read -p "Enter branch name (default: main): " branch
        branch=${branch:-main}
        git push $remote $branch
        echo "✅ Pushed to GitHub!"
        echo "   Digital Ocean will automatically deploy from your connected repository."
        echo "   Check status at: https://cloud.digitalocean.com/apps"
        ;;
    2)
        echo ""
        echo "Deploying via doctl..."
        if command -v doctl &> /dev/null; then
            read -p "Enter your App ID: " app_id
            doctl apps create-deployment $app_id
            echo "✅ Deployment triggered!"
        else
            echo "❌ doctl CLI not installed."
            echo "   Install with: brew install doctl"
            echo "   Then authenticate: doctl auth init"
        fi
        ;;
    3)
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
echo "📝 Digital Ocean Resources:"
echo "   - App Platform: https://cloud.digitalocean.com/apps"
echo "   - PostgreSQL Database: https://cloud.digitalocean.com/databases"
echo ""
echo "🔧 Environment Variables:"
echo "   Ensure these are set in Digital Ocean App Platform:"
echo "   - DATABASE_URL (already configured for DO PostgreSQL)"
echo "   - CLERK_SECRET_KEY"
echo "   - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
echo "   - FRED_API_KEY"
echo "   - RENTCAST_API_KEY"
echo ""
echo "See DEPLOYMENT.md for detailed instructions."
