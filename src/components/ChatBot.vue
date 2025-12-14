<template>
  <div class="chatbot-root" @click.stop>
    <div class="chatbot-messages" ref="scrollRef">
      <div
        v-for="(msg, i) in messages"
        :key="i"
        :class="['chatbot-msg', msg.role]"
      >
        <div class="chatbot-bubble-row" :class="msg.role">
          <div v-if="msg.role === 'assistant'" class="chatbot-avatar assistant-avatar">
            <svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#4285f4"/><text x="16" y="22" text-anchor="middle" font-size="18" fill="#fff" font-family="sans-serif">🤖</text></svg>
          </div>
          <div class="chatbot-bubble">
            <span>{{ msg.content }}</span>
          </div>
          <div v-if="msg.role === 'user'" class="chatbot-avatar user-avatar">
            <svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#dadada"/><text x="16" y="22" text-anchor="middle" font-size="18" fill="#555" font-family="sans-serif">🧑</text></svg>
          </div>
        </div>
      </div>
      <div v-if="loading" class="chatbot-msg assistant">
        <div class="chatbot-bubble-row assistant">
          <div class="chatbot-avatar assistant-avatar">
            <svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#4285f4"/><text x="16" y="22" text-anchor="middle" font-size="18" fill="#fff" font-family="sans-serif">🤖</text></svg>
          </div>
          <div class="chatbot-bubble"><span>...</span></div>
        </div>
      </div>
    </div>
    <form class="chatbot-input-row" @submit.prevent="onSend">
      <input
        v-model="input"
        class="chatbot-input"
        :placeholder="loading ? 'Waiting...' : 'Type a message...'"
        :disabled="loading"
        autocomplete="off"
        @keydown.enter.exact.prevent="onSend"
      />
      <button type="submit" :disabled="loading || !input.trim()" class="chatbot-send-btn">Send</button>
    </form>
    <div v-if="error" class="chatbot-error">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue';
import { useGeminiStream } from '../composables/useGeminiStream.js';

const messages = ref([
  { role: 'user', content: 'Hello!' }
]);
const loading = ref(false);
const error = ref(null);
const input = ref('');
const scrollRef = ref(null);

// Streaming composable
const { responseText, isLoading, error: streamError, generateContentStream } = useGeminiStream();

// Watch for streaming state
watch(isLoading, (val) => { loading.value = val; });
watch(streamError, (val) => { error.value = val; });

// Watch for streamed text and update messages
watch(responseText, (val) => {
  // Only update the last assistant message as it streams
  const last = messages.value[messages.value.length - 1];
  if (last && last.role === 'assistant') {
    last.content = val;
  }
});

async function onSend() {
  if (!input.value.trim() || loading.value) return;
  // Add user message
  messages.value.push({ role: 'user', content: input.value.trim() });
  // Add placeholder assistant message for streaming
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
</script>

<style scoped>

.chatbot-root {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 320px;
  background: linear-gradient(120deg, rgba(255,255,255,0.18) 0%, rgba(240,244,255,0.22) 100%);
  /* Inherit parent panel/modal glassmorphism */
  border-radius: 0 0 10px 10px;
  box-sizing: border-box;
}
.chatbot-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px 12px 0 12px;
  font-size: 15px;
  -webkit-overflow-scrolling: touch;
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: none;
}
.chatbot-msg {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-bottom: 2px;
}
.chatbot-bubble-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  margin-bottom: 6px;
}
.chatbot-bubble-row.user {
  flex-direction: row-reverse;
}
.chatbot-avatar {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.assistant-avatar svg {
  background: none;
}
.user-avatar svg {
  background: none;
}
.chatbot-bubble {
  max-width: 70vw;
  padding: 10px 14px;
  border-radius: 16px;
  font-size: 15px;
  line-height: 1.6;
  box-shadow: 0 2px 8px rgba(60,60,60,0.04);
  background: rgba(255,255,255,0.85);
  color: #1a1a1a;
  word-break: break-word;
  border-bottom-left-radius: 4px;
}
.chatbot-bubble-row.user .chatbot-bubble {
  background: linear-gradient(120deg, #e3f0ff 0%, #d2e3fc 100%);
  color: #1a1a1a;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 4px;
}
.chatbot-bubble-row.assistant .chatbot-bubble {
  background: linear-gradient(120deg, #f5f7fa 0%, #e9eefa 100%);
  color: #222;
  border-bottom-right-radius: 16px;
  border-bottom-left-radius: 4px;
}
.chatbot-input-row {
  display: flex;
  gap: 8px;
  padding: 10px 10px 0 14px;
  border-top: 1px solid rgba(200,200,200,0.10);
  background: transparent;
  margin-bottom: 0;
}
.chatbot-input {
  flex: 1;
  border: none;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 15px;
  background: rgba(255,255,255,0.92);
  color: #222;
  outline: none;
  transition: background 0.2s;
  box-shadow: 0 1px 4px rgba(60,60,60,0.04);
}
.chatbot-input:disabled {
  background: rgba(200,200,200,0.12);
}
.chatbot-send-btn {
  background: #4285f4;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0 20px;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.2s;
  font-weight: 500;
  box-shadow: 0 1px 4px rgba(60,60,60,0.04);
}
.chatbot-send-btn:disabled {
  background: #b0c4e9;
  cursor: not-allowed;
}
.chatbot-error {
  color: #d32f2f;
  font-size: 13px;
  margin: 4px 0 0 8px;
}
</style>
