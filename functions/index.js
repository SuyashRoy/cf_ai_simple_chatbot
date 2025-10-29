// Cloudflare Worker - Main entry point for API routes
export { ChatMemory } from './durableObject.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // CORS headers for cross-origin requests
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Chat API endpoint
    if (url.pathname === '/api/chat' && request.method === 'POST') {
      try {
        const { message, sessionId } = await request.json();

        if (!message) {
          return new Response(JSON.stringify({ error: 'Message is required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Get or create Durable Object instance for this session
        const id = env.CHAT_MEMORY.idFromName(sessionId || 'default-session');
        const stub = env.CHAT_MEMORY.get(id);

        // Get conversation history
        const historyResponse = await stub.fetch(new URL('/history', request.url));
        const history = await historyResponse.json();

        // Build conversation context for AI
        const messages = [
          { role: 'system', content: 'You are a helpful AI assistant. Be concise and friendly.' },
          ...history.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          { role: 'user', content: message }
        ];

        // Call Cloudflare Workers AI with Llama 3.3
        const aiResponse = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
          messages: messages,
        });

        const aiMessage = aiResponse.response;

        // Store user message in Durable Object
        await stub.fetch(new URL('/add', request.url), {
          method: 'POST',
          body: JSON.stringify({ role: 'user', content: message }),
          headers: { 'Content-Type': 'application/json' },
        });

        // Store AI response in Durable Object
        await stub.fetch(new URL('/add', request.url), {
          method: 'POST',
          body: JSON.stringify({ role: 'assistant', content: aiMessage }),
          headers: { 'Content-Type': 'application/json' },
        });

        return new Response(JSON.stringify({ response: aiMessage }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Clear chat history endpoint
    if (url.pathname === '/api/clear' && request.method === 'POST') {
      try {
        const { sessionId } = await request.json();
        const id = env.CHAT_MEMORY.idFromName(sessionId || 'default-session');
        const stub = env.CHAT_MEMORY.get(id);

        await stub.fetch(new URL('/clear', request.url), {
          method: 'POST',
        });

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Get chat history endpoint
    if (url.pathname === '/api/history' && request.method === 'POST') {
      try {
        const { sessionId } = await request.json();
        const id = env.CHAT_MEMORY.idFromName(sessionId || 'default-session');
        const stub = env.CHAT_MEMORY.get(id);

        const historyResponse = await stub.fetch(new URL('/history', request.url));
        const history = await historyResponse.json();

        return new Response(JSON.stringify({ history }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // For non-API routes, serve static assets from Workers Sites
    // When [site] is configured, __STATIC_CONTENT is automatically available
    try {
      // Get the asset from the KV namespace
      const url = new URL(request.url);
      let path = url.pathname;
      
      // If path is root or doesn't have extension, serve index.html
      if (path === '/' || !path.includes('.')) {
        path = '/index.html';
      }
      
      // Get the asset key with hash (Workers Sites stores files with content hashes)
      const assetKey = path.substring(1); // Remove leading slash
      
      // Try to get from manifest first
      let manifestJSON = {};
      if (env.__STATIC_CONTENT_MANIFEST) {
        manifestJSON = JSON.parse(env.__STATIC_CONTENT_MANIFEST);
      }
      
      // Get the hashed key from manifest, or use original key
      const hashedKey = manifestJSON[assetKey] || assetKey;
      
      // Fetch from KV
      const asset = await env.__STATIC_CONTENT.get(hashedKey, 'arrayBuffer');
      
      if (asset) {
        // Determine content type
        const contentType = 
          path.endsWith('.html') ? 'text/html' :
          path.endsWith('.css') ? 'text/css' :
          path.endsWith('.js') ? 'application/javascript' :
          'application/octet-stream';
        
        return new Response(asset, {
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=3600',
          },
        });
      }
    } catch (e) {
      console.error('Asset fetch error:', e);
    }
    
    return new Response('Not Found', { status: 404 });
  },
};

