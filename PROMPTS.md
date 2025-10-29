# AI Assistance Prompts

This document contains the prompts used to create this Cloudflare AI chatbot project, for transparency and reproducibility.

## Initial Prompt

You are building a Cloudflare AI-powered chatbot app for the Cloudflare assignment.

### OBJECTIVE
Create a minimal but complete AI chatbot app that fulfills ALL Cloudflare assignment criteria:
1. Uses an **LLM** (Llama 3.3 on Workers AI)
2. Has **workflow/coordination** (Cloudflare Worker to route messages)
3. Provides **user input** via a simple **chat UI** (Cloudflare Pages frontend)
4. Implements **memory/state** (Durable Object for conversation history)

### PROJECT STRUCTURE
Generate a complete Cloudflare project with the following structure:
```
cf_ai_simple_chatbot/
├── functions/
│ ├── index.js # Cloudflare Worker entry - handles API routes
│ ├── durableObject.js # Durable Object for memory/state
├── public/
│ ├── index.html # Simple chat UI
│ ├── style.css # Basic styling
│ ├── script.js # Frontend logic (fetch to Worker API)
├── wrangler.toml # Cloudflare config (bind AI, DO, etc.)
├── README.md # Instructions on setup/deploy
└── PROMPTS.md # Include this prompt text
```

## Detailed Requirements

### 🔹 LLM
- Use Cloudflare **Workers AI** and **Llama 3.3** model.
- Route user input from frontend → Worker → LLM → back to frontend.

### 🔹 Workflow / Coordination
- The Worker should:
  - Receive POST requests with user messages.
  - Retrieve or create a Durable Object instance per user.
  - Store message history and pass relevant context to the AI.
  - Return the AI response to the client.

### 🔹 User Input / Chat UI
- Create a very simple HTML page (`index.html`) with:
  - A message area showing chat history.
  - A text input box and "Send" button.
- Use `fetch("/api/chat", { method: "POST" })` to send user input to the Worker.
- Display both user and AI messages dynamically.

### 🔹 Memory / State
- Implement `durableObject.js` with a class `ChatMemory`:
  - Stores an array of chat messages (user + AI).
  - Persists across sessions.
  - On each new message, return the conversation history to include context for the AI.

### 🔹 UI Design
- Keep UI **clean and minimal**.
- Example layout: center chat box, bubble-style messages, subtle background color.

### 🔹 README.md
Include:
- Project overview.
- How to deploy on Cloudflare (using Wrangler).
- How to test locally with `wrangler dev`.
- Mention of `PROMPTS.md` (this prompt file).
- Note that AI assistance was used.

### 🔹 PROMPTS.md
Include this full Cursor prompt for transparency.

## Example Chat Flow
1. User opens the chat page.
2. Sends a message like "Hi there!"
3. Worker finds or creates a Durable Object for this session.
4. Worker sends conversation context + latest message to Llama 3.3 via Workers AI.
5. AI reply is stored in Durable Object and returned to UI.
6. Chat UI updates with both messages.

## Style Note
Keep it clean, clear, and minimal — this project should be functional and visually simple, not flashy.  
Focus on Cloudflare integration correctness and clear code organization.

---

## Implementation Notes

The AI assistant (Cursor with Claude) created this project following these specifications, generating all code files with:
- Proper Cloudflare Workers AI integration using Llama 3.3 70B Instruct
- Durable Objects for persistent conversation storage
- Clean, modern UI with gradient design and smooth animations
- Complete API endpoints for chat, history, and clearing conversations
- Session-based conversation management
- Proper error handling and CORS configuration
- Comprehensive README with deployment instructions

All requirements were met and the code is production-ready for deployment to Cloudflare's edge network.

