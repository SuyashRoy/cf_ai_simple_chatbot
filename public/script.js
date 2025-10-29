// Generate a unique session ID for this browser session
const sessionId = sessionStorage.getItem('chatSessionId') || 
  'session-' + Math.random().toString(36).substring(7);
sessionStorage.setItem('chatSessionId', sessionId);

const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const clearBtn = document.getElementById('clearBtn');

// Load chat history on page load
window.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/api/history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId }),
    });

    const data = await response.json();
    if (data.history && data.history.length > 0) {
      // Clear welcome message
      chatMessages.innerHTML = '';
      // Display history
      data.history.forEach(msg => {
        addMessage(msg.content, msg.role);
      });
    }
  } catch (error) {
    console.error('Failed to load history:', error);
  }
});

// Send message on button click
sendBtn.addEventListener('click', sendMessage);

// Send message on Enter key
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Clear chat history
clearBtn.addEventListener('click', async () => {
  if (!confirm('Are you sure you want to clear the chat history?')) {
    return;
  }

  try {
    const response = await fetch('/api/clear', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId }),
    });

    if (response.ok) {
      chatMessages.innerHTML = `
        <div class="welcome-message">
          <p>👋 Welcome! I'm your AI assistant powered by Cloudflare Workers AI.</p>
          <p>Ask me anything!</p>
        </div>
      `;
    }
  } catch (error) {
    console.error('Failed to clear chat:', error);
    alert('Failed to clear chat. Please try again.');
  }
});

async function sendMessage() {
  const message = messageInput.value.trim();
  
  if (!message) return;

  // Clear welcome message if it exists
  const welcomeMessage = chatMessages.querySelector('.welcome-message');
  if (welcomeMessage) {
    welcomeMessage.remove();
  }

  // Add user message to UI
  addMessage(message, 'user');
  
  // Clear input
  messageInput.value = '';
  
  // Disable send button
  sendBtn.disabled = true;
  sendBtn.textContent = 'Sending...';

  // Show loading indicator
  const loadingId = showLoading();

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message,
        sessionId 
      }),
    });

    const data = await response.json();

    // Remove loading indicator
    removeLoading(loadingId);

    if (data.error) {
      addMessage('Sorry, something went wrong: ' + data.error, 'system');
    } else {
      // Add AI response to UI
      addMessage(data.response, 'assistant');
    }
  } catch (error) {
    removeLoading(loadingId);
    addMessage('Sorry, failed to get a response. Please try again.', 'system');
    console.error('Chat error:', error);
  }

  // Re-enable send button
  sendBtn.disabled = false;
  sendBtn.textContent = 'Send';
  messageInput.focus();
}

function addMessage(text, role) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${role}`;
  
  const bubbleDiv = document.createElement('div');
  bubbleDiv.className = 'message-bubble';
  bubbleDiv.textContent = text;
  
  messageDiv.appendChild(bubbleDiv);
  chatMessages.appendChild(messageDiv);
  
  // Scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showLoading() {
  const loadingId = 'loading-' + Date.now();
  const loadingDiv = document.createElement('div');
  loadingDiv.id = loadingId;
  loadingDiv.className = 'message assistant';
  loadingDiv.innerHTML = `
    <div class="message-bubble">
      <div class="loading">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  `;
  chatMessages.appendChild(loadingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return loadingId;
}

function removeLoading(loadingId) {
  const loadingDiv = document.getElementById(loadingId);
  if (loadingDiv) {
    loadingDiv.remove();
  }
}

