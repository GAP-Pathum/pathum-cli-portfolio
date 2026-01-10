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
            <svg width="32" height="32" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="16" fill="#4285f4" />
              <text x="16" y="22" text-anchor="middle" font-size="18" fill="#fff" font-family="sans-serif">🤖</text>
            </svg>
          </div>
          <div class="chatbot-bubble">
            <span>{{ msg.content || '...' }}</span>
          </div>
          <div v-if="msg.role === 'user'" class="chatbot-avatar user-avatar">
            <svg width="32" height="32" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="16" fill="#dadada" />
              <text x="16" y="22" text-anchor="middle" font-size="18" fill="#555" font-family="sans-serif">🧑</text>
            </svg>
          </div>
        </div>
      </div>

      <!-- Loading indicator -->
      <div v-if="loading" class="chatbot-msg assistant">
        <div class="chatbot-bubble-row assistant">
          <div class="chatbot-avatar assistant-avatar">
            <svg width="32" height="32" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="16" fill="#4285f4" />
              <text x="16" y="22" text-anchor="middle" font-size="18" fill="#fff" font-family="sans-serif">🤖</text>
            </svg>
          </div>
          <div class="chatbot-bubble">
            <span class="loading-dots">Thinking<span>.</span><span>.</span><span>.</span></span>
          </div>
        </div>
      </div>
    </div>

    <form class="chatbot-input-row" @submit.prevent="onSend">
      <input
        v-model="input"
        class="chatbot-input"
        :placeholder="loading ? 'Waiting for response...' : 'Type a message...'"
        :disabled="loading"
        autocomplete="off"
        @keydown.enter.exact.prevent="onSend"
      />
      <button
        type="submit"
        :disabled="loading || !input.trim()"
        class="chatbot-send-btn"
      >
        Send
      </button>
    </form>

    <div v-if="error" class="chatbot-error">
      {{ error }}
      <button v-if="lastQuestion" @click="retryLastMessage" class="retry-btn">
        Retry
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue'

const messages = ref([])
const input = ref('')
const loading = ref(false)
const error = ref(null)
const scrollRef = ref(null)
const lastQuestion = ref('')


// For HuggingFace Spaces, use the /run/predict endpoint for Gradio apps
const API_URL = 'https://pathumpasindu41-pathum-ai.hf.space/run/predict'
// If this endpoint fails, check the "Use via API" button on your Space for the latest endpoint.

async function onSend(isRetry = false) {
  const text = isRetry ? lastQuestion.value : input.value.trim()
  if (!text || loading.value) return

  // Add user message only on first send (not retry)
  if (!isRetry) {
    messages.value.push({ role: 'user', content: text })
    lastQuestion.value = text
    input.value = ''
  }

  loading.value = true
  error.value = null

  await nextTick()
  scrollToBottom()

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: [text] }),
    })

    if (!res.ok) {
      // HuggingFace Spaces may return 503 when waking up
      if (res.status === 503) {
        throw new Error('The Space is waking up. Please wait and try again in a minute.')
      }
      throw new Error(`HTTP ${res.status}`)
    }

    const json = await res.json()
    // Gradio Spaces return { data: [response] }
    let answer = ''
    if (json && Array.isArray(json.data) && json.data.length > 0) {
      answer = json.data[0]
    } else if (json && typeof json.data === 'string') {
      answer = json.data
    } else {
      answer = '(no response received)'
    }

    messages.value.push({ role: 'assistant', content: answer })
  } catch (err) {
    console.error('API call failed:', err)
    let msg = 'Could not get response. The space might be waking up — try again in 30–60 seconds.'
    if (err && err.message) {
      msg = err.message
    }
    error.value = msg
    messages.value.push({
      role: 'assistant',
      content: 'Sorry, connection issue. Please try again.',
    })
  } finally {
    loading.value = false
    await nextTick()
    scrollToBottom()
  }
}

function retryLastMessage() {
  onSend(true)
}

function scrollToBottom() {
  if (scrollRef.value) {
    scrollRef.value.scrollTop = scrollRef.value.scrollHeight
  }
}

watch(() => messages.value.length, () => {
  nextTick(scrollToBottom)
}, { deep: true })
</script>

<style scoped>
/* ──────────────────────────────────────────────────────────────
   Your original styles + small additions for retry button & loading
─────────────────────────────────────────────────────────────── */

.chatbot-root {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 320px;
  background: linear-gradient(120deg, rgba(255,255,255,0.18) 0%, rgba(240,244,255,0.22) 100%);
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
}

.chatbot-bubble-row.user .chatbot-bubble {
  background: linear-gradient(120deg, #e3f0ff 0%, #d2e3fc 100%);
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 4px;
}

.chatbot-bubble-row.assistant .chatbot-bubble {
  background: linear-gradient(120deg, #f5f7fa 0%, #e9eefa 100%);
  border-bottom-right-radius: 16px;
  border-bottom-left-radius: 4px;
}

.loading-dots span {
  animation: blink 1.4s infinite both;
}

.loading-dots span:nth-child(2) { animation-delay: 0.2s; }
.loading-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes blink {
  0%, 100% { opacity: 0.2; }
  20% { opacity: 1; }
}

.chatbot-input-row {
  display: flex;
  gap: 8px;
  padding: 10px 10px 0 14px;
  border-top: 1px solid rgba(200,200,200,0.10);
  background: transparent;
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
  margin: 8px 8px 0;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.retry-btn {
  padding: 4px 12px;
  background: #4285f4;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
}

.retry-btn:hover {
  background: #326ac2;
}
</style>