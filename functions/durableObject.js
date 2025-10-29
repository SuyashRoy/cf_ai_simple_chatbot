// Durable Object for storing chat conversation history
export class ChatMemory {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  // Initialize messages array from storage
  async initialize() {
    let stored = await this.state.storage.get("messages");
    this.messages = stored || [];
  }

  // Handle fetch requests to the Durable Object
  async fetch(request) {
    await this.initialize();

    const url = new URL(request.url);

    // Get conversation history
    if (request.method === "GET" && url.pathname === "/history") {
      return new Response(JSON.stringify(this.messages), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Add a new message to history
    if (request.method === "POST" && url.pathname === "/add") {
      const message = await request.json();
      this.messages.push(message);
      await this.state.storage.put("messages", this.messages);
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Clear conversation history
    if (request.method === "POST" && url.pathname === "/clear") {
      this.messages = [];
      await this.state.storage.put("messages", this.messages);
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Not Found", { status: 404 });
  }
}

