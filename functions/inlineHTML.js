// Complete inline HTML with CSS and JS
export const inlineHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Chatbot - Cloudflare</title>
  <style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.container {
  width: 100%;
  max-width: 800px;
}

.chat-box {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 600px;
}

.chat-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-header h1 {
  font-size: 24px;
  font-weight: 600;
}

.clear-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f8f9fa;
}

.welcome-message {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.welcome-message p {
  margin: 10px 0;
  font-size: 16px;
}

.message {
  margin-bottom: 16px;
  display: flex;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.user {
  justify-content: flex-end;
}

.message-bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 16px;
  word-wrap: break-word;
  line-height: 1.5;
}

.message.user .message-bubble {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom-right-radius: 4px;
}

.message.assistant .message-bubble {
  background: white;
  color: #333;
  border-bottom-left-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.message.system .message-bubble {
  background: #fff3cd;
  color: #856404;
  border-radius: 8px;
  text-align: center;
  max-width: 90%;
  margin: 0 auto;
  font-size: 14px;
}

.chat-input-container {
  display: flex;
  padding: 20px;
  background: white;
  border-top: 1px solid #e9ecef;
}

.message-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 24px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease;
}

.message-input:focus {
  border-color: #667eea;
}

.send-btn {
  margin-left: 12px;
  padding: 12px 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.send-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.send-btn:active {
  transform: translateY(0);
}

.send-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.loading {
  display: flex;
  gap: 4px;
  padding: 12px 16px;
}

.loading span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #667eea;
  animation: bounce 1.4s infinite ease-in-out both;
}

.loading span:nth-child(1) {
  animation-delay: -0.32s;
}

.loading span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.chat-messages::-webkit-scrollbar {
  width: 8px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #999;
}
  </style>
</head>
<body>
  <div class="container">
    <div class="chat-box">
      <div class="chat-header">
        <h1>AI Chatbot</h1>
        <button id="clearBtn" class="clear-btn">Clear Chat</button>
      </div>
      
      <div id="chatMessages" class="chat-messages">
        <div class="welcome-message">
          <p>👋 Welcome! I'm your AI assistant powered by Cloudflare Workers AI.</p>
          <p>Ask me anything!</p>
        </div>
      </div>
      
      <div class="chat-input-container">
        <input 
          type="text" 
          id="messageInput" 
          class="message-input" 
          placeholder="Type your message..." 
          autocomplete="off"
        />
        <button id="sendBtn" class="send-btn">Send</button>
      </div>
    </div>
  </div>

  <script>
const sessionId = sessionStorage.getItem('chatSessionId') || 
  'session-' + Math.random().toString(36).substring(7);
sessionStorage.setItem('chatSessionId', sessionId);

const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const clearBtn = document.getElementById('clearBtn');

window.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    });

    const data = await response.json();
    if (data.history && data.history.length > 0) {
      chatMessages.innerHTML = '';
      data.history.forEach(msg => {
        addMessage(msg.content, msg.role);
      });
    }
  } catch (error) {
    console.error('Failed to load history:', error);
  }
});

sendBtn.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

clearBtn.addEventListener('click', async () => {
  if (!confirm('Are you sure you want to clear the chat history?')) return;

  try {
    const response = await fetch('/api/clear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    });

    if (response.ok) {
      chatMessages.innerHTML = \`
        <div class="welcome-message">
          <p>👋 Welcome! I'm your AI assistant powered by Cloudflare Workers AI.</p>
          <p>Ask me anything!</p>
        </div>
      \`;
    }
  } catch (error) {
    console.error('Failed to clear chat:', error);
    alert('Failed to clear chat. Please try again.');
  }
});

async function sendMessage() {
  const message = messageInput.value.trim();
  if (!message) return;

  const welcomeMessage = chatMessages.querySelector('.welcome-message');
  if (welcomeMessage) welcomeMessage.remove();

  addMessage(message, 'user');
  messageInput.value = '';
  sendBtn.disabled = true;
  sendBtn.textContent = 'Sending...';

  const loadingId = showLoading();

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, sessionId }),
    });

    const data = await response.json();
    removeLoading(loadingId);

    if (data.error) {
      addMessage('Sorry, something went wrong: ' + data.error, 'system');
    } else {
      addMessage(data.response, 'assistant');
    }
  } catch (error) {
    removeLoading(loadingId);
    addMessage('Sorry, failed to get a response. Please try again.', 'system');
    console.error('Chat error:', error);
  }

  sendBtn.disabled = false;
  sendBtn.textContent = 'Send';
  messageInput.focus();
}

function addMessage(text, role) {
  const messageDiv = document.createElement('div');
  messageDiv.className = \`message \${role}\`;
  
  const bubbleDiv = document.createElement('div');
  bubbleDiv.className = 'message-bubble';
  bubbleDiv.textContent = text;
  
  messageDiv.appendChild(bubbleDiv);
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showLoading() {
  const loadingId = 'loading-' + Date.now();
  const loadingDiv = document.createElement('div');
  loadingDiv.id = loadingId;
  loadingDiv.className = 'message assistant';
  loadingDiv.innerHTML = \`
    <div class="message-bubble">
      <div class="loading">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  \`;
  chatMessages.appendChild(loadingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return loadingId;
}

function removeLoading(loadingId) {
  const loadingDiv = document.getElementById(loadingId);
  if (loadingDiv) loadingDiv.remove();
}
  </script>
</body>
</html>`;

