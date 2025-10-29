#!/bin/bash

# ==========================================
# CLOUDFLARE AI CHATBOT - DEPLOYMENT SCRIPT
# ==========================================

echo "🚀 Cloudflare AI Chatbot - Simplified Deployment"
echo "================================================="
echo ""

# Step 1: Fix npm cache permissions
echo "📝 Step 1: Fixing npm cache permissions..."
echo "Running: sudo chown -R 501:20 /Users/yugeshchandraroy/.npm"
sudo chown -R 501:20 "/Users/yugeshchandraroy/.npm"

if [ $? -eq 0 ]; then
    echo "✅ npm cache permissions fixed!"
else
    echo "⚠️  Could not fix permissions (may need to run manually)"
fi

echo ""

# Step 2: Clean and install
echo "🧹 Step 2: Cleaning old dependencies..."
rm -rf node_modules package-lock.json

echo "📦 Step 3: Installing dependencies (wrangler only)..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ npm install failed!"
    echo "Try running manually: npm install"
    exit 1
fi

echo "✅ Dependencies installed!"
echo ""

# Step 3: Check if logged in
echo "🔐 Step 4: Checking Cloudflare login..."
npx wrangler whoami &> /dev/null

if [ $? -ne 0 ]; then
    echo "📝 Not logged in. Opening login..."
    npx wrangler login
else
    echo "✅ Already logged in to Cloudflare!"
fi

echo ""
echo "🚀 Step 5: Deploying to Cloudflare..."
echo ""

npx wrangler deploy

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 ================================================"
    echo "✅ DEPLOYMENT SUCCESSFUL!"
    echo "================================================="
    echo ""
    echo "Your chatbot is now live!"
    echo "Check the URL above and start chatting with your AI! 🤖"
    echo ""
else
    echo ""
    echo "❌ Deployment failed!"
    echo "Try running manually: npx wrangler deploy"
    echo ""
fi

