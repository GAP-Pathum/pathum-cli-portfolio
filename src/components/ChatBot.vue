<template>
  <div class="chatbot-root" @click.stop>
    <!-- Chat Header -->
    <div class="chat-header">
      <div class="header-title">✨ Pathum</div>
      <div class="header-subtitle">Full-Stack Developer • Open to opportunities</div>
    </div>

    <!-- Messages Container -->
    <div class="chatbot-messages" ref="scrollRef">
      <!-- Welcome Message -->
      <div v-if="messages.length === 0" class="welcome-section">
        <div class="welcome-icon">💬</div>
        <h2>Chat with Pathum</h2>
        <p>Full-stack developer from Sri Lanka | React • Node.js • Vue.js</p>
        <div class="quick-prompts">
          <button v-for="prompt in quickPrompts" :key="prompt" @click="sendQuickPrompt(prompt)" class="quick-prompt-btn">
            {{ prompt }}
          </button>
        </div>
      </div>

      <!-- Messages -->
      <div
        v-for="(msg, i) in messages"
        :key="i"
        :class="['chatbot-msg', msg.role]"
      >
        <div class="chatbot-bubble-row" :class="msg.role">
          <div class="chatbot-avatar" :class="`${msg.role}-avatar`">
            {{ msg.role === 'assistant' ? '✨' : '👤' }}
          </div>
          <div class="chatbot-bubble" :class="msg.role">
            {{ msg.content }}
          </div>
        </div>
      </div>

      <!-- Typing Indicator -->
      <div v-if="loading" class="chatbot-msg assistant">
        <div class="chatbot-bubble-row assistant">
          <div class="chatbot-avatar assistant-avatar">✨</div>
          <div class="chatbot-bubble assistant">
            <span class="typing-indicator">
              <span></span><span></span><span></span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Input Section -->
    <div class="input-section">
      <form class="chatbot-input-row" @submit.prevent="onSend">
        <input
          v-model="input"
          class="chatbot-input"
          :placeholder="loading ? 'Thinking...' : 'Ask me about me...'"
          :disabled="loading"
          autocomplete="off"
          @keydown.enter.exact.prevent="onSend"
        />
        <button type="submit" :disabled="loading || !input.trim()" class="chatbot-send-btn">
          <span v-if="!loading">↑</span>
          <span v-else class="sending">⏳</span>
        </button>
      </form>
      <div v-if="error" class="chatbot-error">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, watch, onMounted } from 'vue';
import { useGeminiStream } from '../composables/useGeminiStream.js';

const messages = ref([]);
const loading = ref(false);
const error = ref(null);
const input = ref('');
const scrollRef = ref(null);

const quickPrompts = [
  'What are your main skills?',
  'Tell me about your best project',
  'How can I contact you?',
  'What are you looking for?'
];

// Streaming composable
const { responseText, isLoading, error: streamError, generateContentStream } = useGeminiStream();

// Watch for streaming state
watch(isLoading, (val) => { loading.value = val; });
watch(streamError, (val) => { error.value = val; });

// Watch for streamed text and update messages
watch(responseText, (val) => {
  const last = messages.value[messages.value.length - 1];
  if (last && last.role === 'assistant') {
    last.content = val;
  }
});

function sendQuickPrompt(prompt) {
  input.value = prompt;
  onSend();
}

async function onSend() {
  if (!input.value.trim() || loading.value) return;
  messages.value.push({ role: 'user', content: input.value.trim() });
  messages.value.push({ role: 'assistant', content: '' });
  const prompt = input.value.trim();
  input.value = '';
  await generateContentStream(prompt);
}

watch(messages, async () => {
  await nextTick();
  if (scrollRef.value) {
    scrollRef.value.scrollTop = scrollRef.value.scrollHeight;
  }
});

onMounted(() => {
  // Auto-scroll on mount
  nextTick(() => {
    if (scrollRef.value) {
      scrollRef.value.scrollTop = scrollRef.value.scrollHeight;
    }
  });
});
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.chatbot-root {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 400px;
  background: linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(248,250,255,0.9) 100%);
  border-radius: 12px;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  box-shadow: 0 20px 60px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8);
}

/* Header */
.chat-header {
  padding: 16px 20px;
  background: linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(248,250,255,0.7) 100%);
  border-bottom: 1px solid rgba(200,200,200,0.15);
  backdrop-filter: blur(10px);
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 2px;
}

.header-subtitle {
  font-size: 12px;
  color: #666;
  font-weight: 400;
}

/* Messages Container */
.chatbot-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: transparent;
  scroll-behavior: smooth;
}

.chatbot-messages::-webkit-scrollbar {
  width: 8px;
}

.chatbot-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chatbot-messages::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.1);
  border-radius: 4px;
}

.chatbot-messages::-webkit-scrollbar-thumb:hover {
  background: rgba(0,0,0,0.2);
}

/* Welcome State */
.welcome-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  flex: 1;
}

.welcome-icon {
  font-size: 48px;
  margin-bottom: 16px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.welcome-section h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.welcome-section p {
  font-size: 14px;
  color: #666;
  margin: 0 0 24px 0;
  font-weight: 500;
}

.quick-prompts {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 320px;
}

.quick-prompt-btn {
  padding: 10px 16px;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 8px;
  background: rgba(255,255,255,0.8);
  color: #1a1a1a;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  text-align: left;
}

.quick-prompt-btn:hover {
  background: rgba(59,130,246,0.1);
  border-color: rgba(59,130,246,0.3);
  color: #3b82f6;
}

.quick-prompt-btn:active {
  background: rgba(59,130,246,0.2);
}

/* Messages */
.chatbot-msg {
  display: flex;
  flex-direction: column;
  animation: messageAppear 0.3s ease;
}

@keyframes messageAppear {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chatbot-bubble-row {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  margin-bottom: 4px;
}

.chatbot-bubble-row.user {
  flex-direction: row-reverse;
}

.chatbot-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 16px;
  font-weight: bold;
}

.assistant-avatar {
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
}

.user-avatar {
  background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
  color: #374151;
}

.chatbot-bubble {
  max-width: min(75%, 600px);
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;
  white-space: pre-wrap;
  animation: bubbleScale 0.2s ease;
}

@keyframes bubbleScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.chatbot-bubble.assistant {
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  color: #1f2937;
  border-radius: 18px 18px 4px 18px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.chatbot-bubble.user {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border-radius: 18px 4px 18px 18px;
  box-shadow: 0 2px 12px rgba(59,130,246,0.3);
}

/* Typing Indicator */
.typing-indicator {
  display: flex;
  gap: 4px;
  height: 16px;
  align-items: center;
}

.typing-indicator span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #1f2937;
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    opacity: 0.3;
    transform: translateY(0);
  }
  30% {
    opacity: 1;
    transform: translateY(-6px);
  }
}

/* Input Section */
.input-section {
  padding: 12px 16px 16px;
  background: rgba(255,255,255,0.5);
  border-top: 1px solid rgba(200,200,200,0.15);
  backdrop-filter: blur(10px);
}

.chatbot-input-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.chatbot-input {
  flex: 1;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 22px;
  padding: 10px 16px;
  font-size: 14px;
  background: rgba(255,255,255,0.95);
  color: #1a1a1a;
  outline: none;
  transition: all 0.2s;
  font-family: inherit;
}

.chatbot-input::placeholder {
  color: #999;
}

.chatbot-input:focus {
  background: white;
  border-color: rgba(59,130,246,0.4);
  box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
}

.chatbot-input:disabled {
  background: rgba(200,200,200,0.1);
  color: #999;
}

.chatbot-send-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(59,130,246,0.3);
  flex-shrink: 0;
}

.chatbot-send-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  box-shadow: 0 4px 12px rgba(59,130,246,0.4);
  transform: translateY(-2px);
}

.chatbot-send-btn:active:not(:disabled) {
  transform: translateY(0);
}

.chatbot-send-btn:disabled {
  background: rgba(200,200,200,0.3);
  cursor: not-allowed;
  box-shadow: none;
}

.sending {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

/* Error */
.chatbot-error {
  color: #dc2626;
  font-size: 12px;
  margin-top: 8px;
  padding: 0 16px;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 640px) {
  .chatbot-bubble {
    max-width: min(90%, 400px);
    font-size: 13px;
  }

  .quick-prompts {
    max-width: 100%;
  }

  .welcome-section {
    padding: 30px 16px;
  }

  .header-title {
    font-size: 15px;
  }

  .header-subtitle {
    font-size: 11px;
  }
}
</style>

