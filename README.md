# Cloudflare AI Simple Chatbot

A minimal yet complete AI-powered chatbot application built with Cloudflare Workers, Workers AI (Llama 3.3), Durable Objects, and Cloudflare Pages.

## 🚀 Features

- **LLM Integration**: Uses Cloudflare Workers AI with Llama 3.3 70B Instruct model
- **Workflow/Coordination**: Cloudflare Worker handles message routing and orchestration
- **User Interface**: Clean, minimal chat UI with bubble-style messages
- **Memory/State**: Durable Objects for persistent conversation history across sessions
- **Real-time Chat**: Instant responses with loading indicators
- **Session Management**: Per-session conversation history with clear functionality

## 📁 Project Structure

```
cf_ai_simple_chatbot/
├── functions/
│   ├── index.js           # Cloudflare Worker - API routes + static assets
│   └── durableObject.js   # Durable Object for conversation memory
├── public/
│   ├── index.html         # Chat UI
│   ├── style.css          # Styling
│   └── script.js          # Frontend logic
├── wrangler.toml          # Cloudflare configuration
├── package.json           # Dependencies and scripts
├── setup.sh               # Quick setup script
├── SETUP.md               # Detailed setup guide
├── FIXES.md               # Troubleshooting and fixes
├── README.md              # This file
└── PROMPTS.md            # AI assistance prompts used
```

## 🛠️ Setup & Deployment

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Cloudflare account (free tier works!)

### Quick Setup

**Option 1: Use the setup script (Recommended)**
```bash
./setup.sh
```

**Option 2: Manual installation**
```bash
npm install
```

> 📘 **Having issues?** Check [SETUP.md](SETUP.md) for detailed instructions or [FIXES.md](FIXES.md) for troubleshooting.

### Install Dependencies

First, install the project dependencies:

```bash
npm install
```

### Login to Cloudflare

```bash
npx wrangler login
```

### Local Development

Test the application locally with live reload:

```bash
npm run dev
```

Or use wrangler directly:

```bash
npx wrangler dev
```

**Note**: For local development, wrangler may prompt you to use local or remote mode:
- Press `l` for **local mode** (faster, but AI and Durable Objects are mocked)
- Press `r` for **remote mode** (uses real Cloudflare services, requires workers.dev subdomain)

For the full experience with real AI, use remote mode or deploy to production.

This will start a local development server, typically at `http://localhost:8787`.

### Deploy to Cloudflare

Deploy your chatbot to production:

```bash
npm run deploy
```

Or use wrangler directly:

```bash
npx wrangler deploy
```

After deployment, you'll receive a URL like: `https://cf-ai-simple-chatbot.<your-subdomain>.workers.dev`

## 🔧 Configuration

The `wrangler.toml` file contains all necessary bindings:

- **AI Binding**: Connects to Cloudflare Workers AI
- **Durable Objects**: Enables persistent conversation storage
- **Static Assets**: Serves the chat UI from the `/public` folder

## 🧪 Testing

1. Open the deployed URL or local dev server
2. Type a message in the chat input
3. Click "Send" or press Enter
4. Watch the AI respond in real-time
5. Your conversation history persists across page refreshes
6. Use "Clear Chat" to reset the conversation

## 🏗️ How It Works

### Architecture Flow

1. **User Input** → Frontend sends message via `POST /api/chat`
2. **Worker Coordination** → Retrieves or creates a Durable Object for the session
3. **Memory Retrieval** → Fetches conversation history from Durable Object
4. **AI Processing** → Passes context + new message to Llama 3.3 via Workers AI
5. **State Update** → Stores user message and AI response in Durable Object
6. **Response Delivery** → Returns AI response to frontend
7. **UI Update** → Displays both messages in chat interface

### API Endpoints

- `POST /api/chat` - Send message and get AI response
- `POST /api/history` - Retrieve conversation history
- `POST /api/clear` - Clear conversation history

### Durable Object Methods

- `GET /history` - Get stored messages
- `POST /add` - Add new message to history
- `POST /clear` - Clear all messages

## 🎨 UI Design

The interface features:
- Gradient purple header
- Center-aligned chat container
- Bubble-style messages (user on right, AI on left)
- Smooth animations and transitions
- Loading indicator during AI processing
- Responsive design for mobile and desktop

## 📝 Notes

- **AI Assistance**: This project was built with AI assistance (Cursor/Claude)
- **Model**: Uses `@cf/meta/llama-3.3-70b-instruct-fp8-fast` for fast, quality responses
- **Session Storage**: Each browser session gets a unique ID for isolated conversations
- **Free Tier**: Works on Cloudflare's free tier with generous limits

## 🐛 Troubleshooting

### Common Issues

1. **"AI binding not found"**
   - Make sure you've deployed (not just local dev) or use `wrangler dev --remote`

2. **"Durable Object not found"**
   - Ensure migrations are applied: `npx wrangler deploy`

3. **"Not Found" error in local dev**
   - Make sure you've run `npm install` first
   - Try using remote mode by pressing `r` when prompted
   - Or deploy to production and test there

4. **"Workers.dev subdomain required"**
   - Register your subdomain at: https://dash.cloudflare.com/workers/onboarding
   - Or press `l` for local mode during development

5. **CORS errors**
   - Check that CORS headers are properly set in `functions/index.js`

6. **Messages not persisting**
   - Durable Objects require deployment to Cloudflare's infrastructure
   - Use `npx wrangler dev` in remote mode (press `r`) for testing with real Durable Objects

## 📄 License

MIT - Feel free to use this project as a template or learning resource.

## 🔗 Resources

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Workers AI Docs](https://developers.cloudflare.com/workers-ai/)
- [Durable Objects Docs](https://developers.cloudflare.com/durable-objects/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)

---

Built with ❤️ using Cloudflare's edge platform.
