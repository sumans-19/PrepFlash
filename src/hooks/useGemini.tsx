
import { useState } from 'react';
import { toast } from 'sonner';
import { GoogleGenerativeAI } from "@google/generative-ai";

export function useGemini() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateChatResponse = async (prompt: string) => {
    setIsGenerating(true);
    
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey) {
        throw new Error('No API key found for Gemini. Ensure VITE_GEMINI_API_KEY is set in your .env file.');
      }

      // Initialize the Google Generative AI
      const genAI = new GoogleGenerativeAI(apiKey);

      // Get the model - correct API usage
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const result = await model.generateContent(prompt);
      
      const response = result.response;
      const textContent = response.text();
      
      if (!textContent) {
        throw new Error('No response generated from Gemini');
      }

      return textContent;
    } catch (error) {
      console.error('Error generating chat response:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate response');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateChatResponse,
    isGenerating,
  };
}
