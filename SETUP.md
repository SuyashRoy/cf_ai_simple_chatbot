# Quick Setup Guide

Follow these steps to get your chatbot running:

## 🚀 Quick Start

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Login to Cloudflare
```bash
npx wrangler login
```

### Step 3: Choose Your Development Path

#### Option A: Local Development (Recommended for Testing)
```bash
npm run dev
```

When prompted:
- Press **`l`** for local mode (faster, but AI/Durable Objects are simulated)
- Press **`r`** for remote mode (real services, but requires workers.dev subdomain)

**Local mode** is perfect for UI testing and development without hitting real APIs.

#### Option B: Deploy to Production (Best for Full Testing)
```bash
npm run deploy
```

This will give you a live URL where everything works with real AI!

## ⚠️ Troubleshooting

### "Workers.dev subdomain required" Error
If you see this error when trying remote mode:
1. Go to: https://dash.cloudflare.com/workers/onboarding
2. Register a workers.dev subdomain (free!)
3. Or just use local mode by pressing `l`

### "Not Found" Error
- Make sure you ran `npm install` first
- The static asset handler needs the kv-asset-handler package

### AI Not Responding in Local Mode
- Local mode simulates AI responses (they won't be real)
- For real AI: deploy to production or use remote mode

## 🎯 Recommended Workflow

1. **First time**: Deploy to production to test everything
   ```bash
   npm run deploy
   ```

2. **Development**: Use local mode for UI/frontend changes
   ```bash
   npm run dev
   # Press 'l' when prompted
   ```

3. **Testing AI**: Use your deployed production URL

## 📝 What Each Mode Does

| Mode | Static Files | API Routes | AI | Durable Objects |
|------|--------------|------------|----|-----------------| 
| Local (`l`) | ✅ | ✅ | ❌ (mocked) | ❌ (mocked) |
| Remote (`r`) | ✅ | ✅ | ✅ | ✅ |
| Production | ✅ | ✅ | ✅ | ✅ |

## 🌐 After Deployment

Visit your deployed URL (shown after `npm run deploy`) to use the fully functional chatbot!

Example: `https://cf-ai-simple-chatbot.your-subdomain.workers.dev`

