import { ref } from 'vue';

// Mock implementation without API key requirement
export function useGeminiStream() {
  const responseText = ref('');
  const isLoading = ref(false);
  const error = ref(null);

  /**
   * Mock streaming content - provides a sample response without API calls
   * @param {string} prompt The text prompt (not used in mock)
   */
  async function generateContentStream(prompt) {
    isLoading.value = true;
    error.value = null;
    responseText.value = '';

    try {
      // Simulate streaming delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock response chunks
      const mockResponse = "Hello! I'm a demo chatbot. The Gemini API integration has been disabled for smooth project running. This is a placeholder response to demonstrate the chat interface functionality.";

      // Simulate streaming by adding text character by character
      for (let i = 0; i < mockResponse.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 20)); // 20ms delay between characters
        responseText.value += mockResponse[i];
      }
    } catch (err) {
      console.error("Mock streaming error:", err);
      error.value = "An error occurred while generating the response.";
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
