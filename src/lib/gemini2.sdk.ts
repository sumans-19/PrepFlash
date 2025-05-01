import { Formula } from '@/types/aptitude';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

interface GenerateQuestionParams {
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  format?: 'MCQ' | 'Fill in the blanks' | 'Descriptive' | 'Conceptual';
}

interface GeneratedQuestion {
  question: string;
  answer: string;
  explanation?: string;
  options?: string[];
  correctOption?: string;
}

export const generateAptitudeQuestion = async (params: GenerateQuestionParams): Promise<GeneratedQuestion> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Generate a ${params.difficulty} level aptitude question about ${params.topic}.
      Format: ${params.format || 'Conceptual'}
      
      Return the response in this JSON format:
      {
        "question": "The question text",
        "answer": "The complete answer",
        "explanation": "Detailed explanation of the solution",
        ${params.format === 'MCQ' ? `
        "options": ["option1", "option2", "option3", "option4"],
        "correctOption": "The correct option"
        ` : ''}
      }
      
      Make sure the question is challenging but solvable, and provide a clear explanation.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedContent = JSON.parse(response.text());

    return generatedContent;
  } catch (error) {
    console.error('Error generating question:', error);
    throw new Error('Failed to generate question. Please try again.');
  }
};

export const generateTopicContent = async (topic: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Provide a comprehensive explanation of ${topic} in the context of aptitude and technical interviews.
      Include:
      - Key concepts
      - Common problem types
      - Important formulas
      - Tips for solving problems
      
      Format the response in markdown.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating topic content:', error);
    throw new Error('Failed to generate topic content. Please try again.');
  }
};

export const generateFormula = async (topic: string): Promise<Formula> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Generate a mathematical formula or concept related to ${topic}.
      Return the response in this JSON format:
      {
        "title": "Name of the formula/concept",
        "expression": "The mathematical expression",
        "description": "Brief explanation of when and how to use it",
        "example": "A practical example showing its application"
      }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error('Error generating formula:', error);
    throw new Error('Failed to generate formula. Please try again.');
  }
};