import { FlashCard, QuizQuestion, QuizResult, ChatMessage } from '../types/index';

export class GeminiService {
  private static instance: GeminiService;
  private apiKey: string = 'AIzaSyBtb4rhA-s8yICjMMOgXTBSDHYpTnzrub8'; // Replace with env var in production
  private baseUrl: string = 'https://generativelanguage.googleapis.com/v1beta/models';
  private model: string = 'gemini-2.0-flash'; // Your available model
  private maxRetries: number = 3;
  private retryDelay: number = 1000; // 1 second

  private constructor() {}

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  private async generateContent(prompt: string, retryCount = 0): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
      });

      if (response.status === 403) {
        throw new Error('Invalid API key or API not enabled. Please check your Gemini API configuration.');
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response format from Gemini API');
      }

      const text = data.candidates[0].content.parts[0].text;
      return text.replace(/^```(?:json)?\n?/, '').replace(/\n```$/, '').trim();
    } catch (error: any) {
      if (retryCount < this.maxRetries && !error.message.includes('Invalid API key')) {
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * (retryCount + 1)));
        return this.generateContent(prompt, retryCount + 1);
      }
      throw error;
    }
  }

  public async getFlashCards(jobRoleId: string, count: number = 10): Promise<FlashCard[]> {
    const prompt = `Generate ${count} flash cards for a ${jobRoleId} position interview preparation(include faq). 
    Each card should include a topic, detailed explanation, and code example where relevant. 
    Return only a JSON array with objects containing id, topic, content, and optional codeExample fields. Do not include markdown formatting or code fences.`;

    try {
      const response = await this.generateContent(prompt);
      let cards;
      try {
        cards = JSON.parse(response);
      } catch (parseError) {
        console.error('Raw response:', response);
        throw new Error('Failed to parse Gemini API response as JSON. Please try again.');
      }

      if (!Array.isArray(cards)) {
        throw new Error('Invalid response format: expected an array of flash cards');
      }

      return cards.map((card: any, index: number) => ({
        id: `card-${index}`,
        topic: card.topic || 'Unknown Topic',
        content: card.content || 'No content available',
        codeExample: card.codeExample
      }));
    } catch (error: any) {
      console.error('Error getting flash cards:', error);
      throw new Error(`Failed to generate flash cards: ${error.message}`);
    }
  }

  public async getQuizQuestions(jobRoleId: string, count: number = 10): Promise<QuizQuestion[]> {
    const prompt = `Generate ${count} technical interview questions for a ${jobRoleId} position. 
    Each question should have 4 options with one correct answer and an explanation. 
    Return only a JSON array with objects containing id, question, options array, correctAnswer index, and explanation. Do not include markdown formatting or code fences.`;

    try {
      const response = await this.generateContent(prompt);
      let questions;
      try {
        questions = JSON.parse(response);
      } catch (parseError) {
        throw new Error('Failed to parse quiz questions response as JSON. Please try again.');
      }

      return questions.map((q: any, index: number) => ({
        id: `question-${index}`,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation
      }));
    } catch (error) {
      console.error('Error getting quiz questions:', error);
      throw error;
    }
  }

  public async analyzeQuizResults(
    jobRoleId: string, 
    questions: QuizQuestion[], 
    answers: number[], 
    timeTaken: number
  ): Promise<QuizResult> {
    const prompt = `Analyze these quiz results for a ${jobRoleId} position:
    Questions: ${JSON.stringify(questions)}
    User Answers: ${answers}
    Time Taken: ${timeTaken} seconds
    
    Return only a JSON object with totalQuestions, correctAnswers, timeTaken, 
    weakAreas (array of topics needing improvement), and suggestions (array of specific improvement tips). Do not include markdown formatting or code fences.`;

    try {
      const response = await this.generateContent(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Error analyzing quiz results:', error);
      throw error;
    }
  }

  public async chat(jobRoleId: string, message: string): Promise<string> {
    const prompt = `As an AI assistant helping with ${jobRoleId} interview preparation(restricted to 100 words):
    User Question: ${message}
    
    Provide a detailed, technical, yet easy to understand response.`;

    try {
      return await this.generateContent(prompt);
    } catch (error) {
      console.error('Error in chat:', error);
      throw error;
    }
  }
}

export default GeminiService.getInstance();
