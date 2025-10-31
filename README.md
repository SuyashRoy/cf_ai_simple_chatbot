# Cloudflare AI Simple Chatbot

A production-ready AI-powered chatbot built with Cloudflare Workers, Workers AI (Llama 3.3), and Durable Objects.

**🌍 Live Demo:** https://cf-ai-simple-chatbot.suyashroy13.workers.dev

---

## 🚀 Features

- **Llama 3.3 70B** - State-of-the-art language model via Cloudflare Workers AI
- **Persistent Memory** - Conversation history stored in Durable Objects
- **Session Management** - Per-browser session isolation
- **Modern UI** - Clean, responsive chat interface with gradient design
- **Real-time Responses** - Instant AI replies with loading indicators
- **Zero Infrastructure** - Serverless deployment on Cloudflare's global network

---

## 📁 Project Structure

```
cf_ai_simple_chatbot/
├── functions/
│   ├── index.js           # Worker: API routes & request handling
│   ├── durableObject.js   # Durable Object: conversation storage
│   └── inlineHTML.js      # Complete UI (HTML + CSS + JS)
├── public/
│   ├── index.html         # Chat UI template
│   ├── style.css          # Styling
│   └── script.js          # Frontend logic
├── wrangler.toml          # Cloudflare configuration
├── package.json           # Dependencies
└── README.md              # This file
```

---

## 🛠️ Technology Stack

- **Cloudflare Workers** - Serverless compute at the edge
- **Workers AI** - On-demand AI inference with Llama 3.3
- **Durable Objects** - Consistent, low-latency state storage
- **JavaScript/ES6** - Modern, clean codebase
- **HTML/CSS** - Responsive, accessible UI

---

## 🔧 Setup & Deployment

### Prerequisites
- Node.js (v16+)
- Cloudflare account (free tier works!)
- Cloudflare API token

### Installation

1. **Clone/Download the project**
```bash
cd cf_ai_simple_chatbot
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up API token**
```bash
export CLOUDFLARE_API_TOKEN=your_token_here
```

4. **Deploy to Cloudflare**
```bash
npx wrangler deploy
```

Your chatbot will be live at: `https://cf-ai-simple-chatbot.YOUR-SUBDOMAIN.workers.dev`

---

## 🧪 Local Development

```bash
export CLOUDFLARE_API_TOKEN=your_token_here
npx wrangler dev
```

Visit `http://localhost:8787` to test locally.

**Note:** Local mode may mock AI responses. For full functionality, deploy to production.

---

## 🎯 How It Works

### Architecture Flow

```
User Message
    ↓
Frontend (HTML/JS)
    ↓
POST /api/chat
    ↓
Cloudflare Worker
    ↓
Durable Object (retrieve history)
    ↓
Workers AI (Llama 3.3)
    ↓
Durable Object (save conversation)
    ↓
Response to Frontend
    ↓
Display in Chat UI
```

### API Endpoints

- **POST /api/chat** - Send message, get AI response
- **POST /api/history** - Retrieve conversation history
- **POST /api/clear** - Clear conversation history

### Key Components

**1. Worker (`functions/index.js`)**
- Routes API requests
- Manages Durable Object instances
- Calls Workers AI for inference
- Serves UI (inline HTML fallback)

**2. Durable Object (`functions/durableObject.js`)**
- Stores conversation messages
- Provides persistence across sessions
- Per-session isolated storage

**3. Frontend (`functions/inlineHTML.js`)**
- Complete self-contained HTML
- Embedded CSS and JavaScript
- No external dependencies

---

## 🎨 UI Features

- **Purple gradient background** - Modern, eye-catching design
- **Bubble-style messages** - User messages on right, AI on left
- **Loading animations** - Smooth bounce effect while AI thinks
- **Auto-scroll** - Always shows latest message
- **Clear chat button** - Reset conversation anytime
- **Responsive design** - Works on mobile, tablet, desktop

---

## 🔐 Configuration

### Environment Variables

Set your Cloudflare API token:
```bash
export CLOUDFLARE_API_TOKEN=your_token_here
```

### wrangler.toml

Key configurations:
```toml
# AI binding
[ai]
binding = "AI"

# Durable Objects
[[durable_objects.bindings]]
name = "CHAT_MEMORY"
class_name = "ChatMemory"

# Durable Objects migration (SQLite for free tier)
[[migrations]]
tag = "v1"
new_sqlite_classes = ["ChatMemory"]
```

---

## 📊 Usage Examples

### Example Prompts to Try

- "Explain quantum computing in simple terms"
- "Write a haiku about coding"
- "What's the best way to learn JavaScript?"
- "Tell me a fun fact about space"
- "Help me debug this Python error: [paste error]"

### API Usage

```javascript
// Send a chat message
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Hello!',
    sessionId: 'unique-session-id'
  })
});

const data = await response.json();
console.log(data.response); // AI's reply
```

---

## 🐛 Troubleshooting

### Deployment Fails
- Ensure API token is set: `export CLOUDFLARE_API_TOKEN=...`
- Check you're logged in: `npx wrangler whoami`
- Verify Workers.dev subdomain is registered

### UI Not Loading
- The chatbot uses inline HTML as a fallback
- Check browser console for errors
- Verify deployment completed successfully

### AI Not Responding
- Free tier includes Workers AI access
- Check Cloudflare dashboard for any service issues
- Verify AI binding in wrangler.toml

### Messages Not Persisting
- Durable Objects require production deployment
- Local dev may not persist data
- Check migration is applied: `new_sqlite_classes`

---

## 💰 Cost

**Free Tier Includes:**
- 100,000 Worker requests/day
- 10 GB Cloudflare Workers KV storage
- Workers AI inference (generous limits)
- Durable Objects (with usage limits)

**Perfect for:**
- Personal projects
- Demos and prototypes
- Learning and experimentation
- Small-scale applications

For high-traffic production use, check [Cloudflare Pricing](https://developers.cloudflare.com/workers/platform/pricing/).

---

## 🚀 Future Enhancements

Ideas for extending this chatbot:

- **Authentication** - Add user login system
- **Multiple Rooms** - Support different chat topics
- **Voice Input** - Speech-to-text integration
- **Export Chat** - Download conversation history
- **Custom Prompts** - User-configurable AI personality
- **Multi-language** - Internationalization support
- **Analytics** - Track usage and popular queries
- **Rate Limiting** - Prevent abuse

---

## 📚 Resources

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Workers AI Documentation](https://developers.cloudflare.com/workers-ai/)
- [Durable Objects Guide](https://developers.cloudflare.com/durable-objects/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)

---

## 📝 Notes

- **AI Model**: Uses `@cf/meta/llama-3.3-70b-instruct-fp8-fast`
- **Session Storage**: Browser sessionStorage for session IDs
- **CORS**: Enabled for all origins (configure for production)
- **AI Assistance**: Built with AI assistance (see PROMPTS.md)

---

## 📄 License

MIT License - Feel free to use this project as a template or learning resource.

---

## 🙏 Acknowledgments

- Built on Cloudflare's edge platform
- Powered by Meta's Llama 3.3 model
- Created with AI assistance for rapid development

---

**🎉 Your AI chatbot is ready! Deploy and start chatting!**

For deployment help, run:
```bash
./RUN_THESE_COMMANDS.sh
```

Or manually:
```bash
export CLOUDFLARE_API_TOKEN=your_token_here
npm install
npx wrangler deploy
```

**Live at:** https://cf-ai-simple-chatbot.suyashroy13.workers.dev
