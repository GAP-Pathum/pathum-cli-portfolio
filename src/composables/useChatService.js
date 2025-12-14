import { ref } from 'vue';

export function useChatService() {
  const messages = ref([
    { role: 'user', content: 'Hello!' }
  ]);
  const loading = ref(false);
  const error = ref(null);

  // Read Gemini API key from Vite env
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  async function sendMessage(content) {
    loading.value = true;
    error.value = null;
    messages.value.push({ role: 'user', content });

    // System prompt describing the portfolio owner
    const system_prompt = {
      role: 'system',
      content: "You are a helpful AI assistant for the portfolio of Pasindu Pathum, a software engineer. Answer questions about his skills, experience, and projects in a friendly, concise, and professional tone."
    };
    // Limit to last 10 messages to reduce cost
    const limitedMessages = [system_prompt, ...messages.value.slice(-10)];

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: limitedMessages.map(m => ({
              role: m.role,
              parts: [{ text: m.content }]
            }))
          })
        }
      );
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';
      messages.value.push({ role: 'assistant', content: text });
    } catch (e) {
      error.value = 'Failed to get response. Please try again.';
    } finally {
      loading.value = false;
    }
  }

  function resetChat() {
    messages.value = [];
    error.value = null;
  }

  return { messages, loading, error, sendMessage, resetChat };
}
