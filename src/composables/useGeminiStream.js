import { GoogleGenAI } from '@google/genai';
import { ref } from 'vue';

// IMPORTANT: Never expose the raw key in production. Use a server proxy.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

export function useGeminiStream() {
  const responseText = ref('');
  const isLoading = ref(false);
  const error = ref(null);

  /**
   * Streams content from the Gemini model chunk-by-chunk.
   * @param {string} prompt The text prompt to send to the model
   */
  async function generateContentStream(prompt) {
    isLoading.value = true;
    error.value = null;
    responseText.value = '';

    try {
      // 1. Call the streaming method
      const stream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      // 2. Process the stream chunk-by-chunk
      for await (const chunk of stream) {
        if (chunk.text) {
          responseText.value += chunk.text;
        }
      }
    } catch (err) {
      console.error("Gemini API Error:", err);
      error.value = "An error occurred while streaming the response.";
    } finally {
      isLoading.value = false;
    }
  }

  return {
    responseText,
    isLoading,
    error,
    generateContentStream,
  };
}
