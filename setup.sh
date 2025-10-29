#!/bin/bash

echo "🚀 Cloudflare AI Chatbot - Setup Script"
echo "========================================="
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js first."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies."
    echo ""
    echo "If you see a permission error, run:"
    echo "sudo chown -R $(id -u):$(id -g) \"$HOME/.npm\""
    echo ""
    echo "Then run this script again: ./setup.sh"
    exit 1
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Login to Cloudflare: npx wrangler login"
echo "2. Deploy: npm run deploy"
echo "   OR"
echo "   Test locally: npm run dev (press 'l' for local mode)"
echo ""

