'use strict';
(() => {
  const form = document.getElementById('podcast-chat-form');
  const input = document.getElementById('podcast-chat-message');
  const send = document.getElementById('podcast-chat-send');
  const status = document.getElementById('podcast-chat-status');
  const thread = document.getElementById('podcast-thread');
  const configured = window.SANIFU_CONFIG?.podcastChatEndpoint;
  if (!form || !input || !send || !status || !thread || !configured) return;
  let endpoint;
  try {
    endpoint = new URL(configured, window.location.href);
    const local = ['localhost', '127.0.0.1'].includes(endpoint.hostname);
    const allowedHost = endpoint.hostname === window.location.hostname || endpoint.hostname === 'vg78ulztb1.execute-api.us-west-2.amazonaws.com';
    if (!allowedHost && !local) return;
    if (endpoint.username || endpoint.password || endpoint.hash || endpoint.search || endpoint.pathname !== '/api/podcast/ask' ||
        !(endpoint.protocol === 'https:' || (local && endpoint.protocol === 'http:'))) return;
  } catch { return; }
  let history = [];
  let busy = false;
  input.disabled = false;
  send.disabled = false;
  status.textContent = 'Ready for your question.';
  function append(label, message) {
    const entry = document.createElement('p');
    const name = document.createElement('strong');
    name.textContent = label + ': ';
    entry.append(name, document.createTextNode(message));
    thread.append(entry);
  }
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const question = input.value.trim();
    if (busy || !question) return;
    if (Array.from(question).length > 1000 || new TextEncoder().encode(question).length > 3000) {
      status.textContent = 'Please shorten your question and try again.';
      return;
    }
    busy = true;
    send.disabled = true;
    input.disabled = true;
    status.textContent = 'Thinking…';
    try {
      const response = await fetch(endpoint.href, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({message: question, history: history.slice(-8)}),
        credentials: 'omit', cache: 'no-store', redirect: 'error'
      });
      if (!response.ok) throw new Error('unavailable');
      const result = await response.json();
      if (typeof result.answer !== 'string' || !result.answer.trim() || result.answer.length > 65536) throw new Error('invalid reply');
      append('You', question);
      append('Sanifu AI', result.answer);
      if (new TextEncoder().encode(result.answer).length <= 3000) {
        history.push({role: 'user', content: question}, {role: 'assistant', content: result.answer});
        history = history.slice(-8);
        status.textContent = 'Reply received.';
      } else {
        history = [];
        status.textContent = 'Reply received. Your next question will start a fresh conversation.';
      }
      input.value = '';
    } catch {
      status.textContent = 'The assistant could not reply. Your question is still here; please try again.';
    } finally {
      busy = false;
      input.disabled = false;
      send.disabled = false;
      input.focus();
    }
  });
})();
