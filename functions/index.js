// Cloudflare Worker - Main entry point for API routes
export { ChatMemory } from './durableObject.js';
import { inlineHTML } from './inlineHTML.js';

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
    try {
      if (!env.__STATIC_CONTENT) {
        throw new Error('__STATIC_CONTENT binding not available');
      }
      
      let path = url.pathname;
      
      // Default to index.html for root
      if (path === '/') {
        path = '/index.html';
      }
      
      // Remove leading slash for KV lookup
      const assetPath = path.startsWith('/') ? path.substring(1) : path;
      
      // Try to get the asset - Workers Sites stores files with their original names
      // OR with hashed names depending on configuration
      let asset = await env.__STATIC_CONTENT.get(assetPath, 'arrayBuffer');
      
      // If not found, try with hashed name pattern (list all keys starting with filename)
      if (!asset) {
        // Try to find the hashed version by listing keys with the base filename
        const baseFilename = assetPath.split('.').slice(0, -1).join('.');
        const extension = assetPath.split('.').pop();
        
        // Common pattern: filename.hash.extension
        // Try pattern matching
        const keys = [
          `${baseFilename}.*.${extension}`,
          assetPath,
          path,
        ];
        
        for (const key of keys) {
          try {
            asset = await env.__STATIC_CONTENT.get(key, 'arrayBuffer');
            if (asset) break;
          } catch (e) {
            // Try next key
          }
        }
      }
      
      if (asset) {
        // Determine content type
        let contentType = 'application/octet-stream';
        if (assetPath.endsWith('.html')) contentType = 'text/html; charset=utf-8';
        else if (assetPath.endsWith('.css')) contentType = 'text/css';
        else if (assetPath.endsWith('.js')) contentType = 'application/javascript';
        else if (assetPath.endsWith('.json')) contentType = 'application/json';
        else if (assetPath.endsWith('.png')) contentType = 'image/png';
        else if (assetPath.endsWith('.jpg') || assetPath.endsWith('.jpeg')) contentType = 'image/jpeg';
        
        return new Response(asset, {
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=3600',
          },
        });
      }
      
      // Asset not found after all attempts
      throw new Error(`Asset not found: ${assetPath}`);
    } catch (e) {
      console.error('Asset error:', e.message);
      
      // Fallback: Return complete inline HTML with CSS and JS embedded
      if (url.pathname === '/' || url.pathname === '/index.html') {
        return new Response(inlineHTML, {
          status: 200,
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }
      
      return new Response('Not Found', { status: 404 });
    }
  },
};

