#!/bin/bash

# GitHub Upload Helper Script
# Run this after creating your GitHub repository

echo "🚀 GitHub Upload Helper"
echo "======================="
echo ""
echo "First, create a new repository on GitHub:"
echo "  1. Go to: https://github.com/new"
echo "  2. Name: lumina (or your choice)"
echo "  3. Choose Public or Private"
echo "  4. DO NOT initialize with README"
echo "  5. Click 'Create repository'"
echo ""
read -p "Have you created the repository? (y/n): " created

if [ "$created" != "y" ]; then
    echo "Please create the repository first, then run this script again."
    exit 0
fi

echo ""
read -p "Enter your GitHub username: " username
read -p "Enter repository name (default: lumina): " reponame
reponame=${reponame:-lumina}

echo ""
echo "Adding GitHub remote..."
git remote add origin "https://github.com/$username/$reponame.git"

echo "Pushing to GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "✅ Upload complete!"
echo "View your repository at: https://github.com/$username/$reponame"
