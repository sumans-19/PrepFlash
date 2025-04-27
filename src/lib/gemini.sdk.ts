// Gemini AI SDK wrapper for interview questions generation
import { GoogleGenerativeAI } from "@google/generative-ai";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";

export interface InterviewParams {
  userId: string;
  userName: string;
  jobRole?: string;
  industry?: string;
  experienceLevel?: string;
  questionCount?: number;
  techStack?: string[];
}

export interface GenerateQuestionsResponse {
  questions: string[];
  interviewId: string;
}

export interface AnswerFeedback {
  clarity: number; // 1-10
  relevance: number; // 1-10
  completeness: number; // 1-10
  fillerWordsCount: number;
  fillerWords: string[];
  confidenceLevel: number; // 1-10
  suggestions: string[];
  overallScore: number; // 1-10
  responseTime?: number; // in seconds (optional)
  responseTimeScore?: number; // 1-10 (optional)
}

// Helper to generate a unique ID
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
};

export const geminiGenerateQuestions = async (
  params: InterviewParams
): Promise<GenerateQuestionsResponse> => {
  console.log('Generating interview questions with params:', params);

  // Create a prompt based on available parameters
  const prompt = `
    Generate ${params.questionCount || 5} interview questions for ${params.userName} 
    who is applying for a ${params.jobRole || 'software developer'} position
    ${params.industry ? `in the ${params.industry} industry` : ''}
    ${params.experienceLevel ? `at a ${params.experienceLevel} experience level` : ''}
    ${params.techStack && params.techStack.length > 0
      ? `with experience in ${params.techStack.join(', ')}`
      : ''}

    Format the questions as a numbered list. Focus on both technical skills and soft skills.
    Make the questions challenging but appropriate for their experience level.
  `;

  try {
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      console.error('No API key found for Gemini');
      toast.error("Gemini API key not found. Please check your environment variables.");
      throw new Error('Gemini API key not found');
    }

    console.log('Making API request to Gemini...');
    toast.info("Generating interview questions...");

    // Initialize the Google Generative AI with the API key
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    // Get the model - Using the correct model name
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Generate content with proper error handling
    const apiResponse = await model.generateContent(prompt);
    const response = apiResponse.response;
    const text = response.text();

    if (!text) {
      throw new Error('Empty response from Gemini API');
    }

    console.log('Raw Gemini response:', text);

    // Parse questions using various strategies
    let questions: string[] = [];

    // Strategy 1: Match numbered questions (e.g. "1. Question" or "1) Question")
    const numberedRegex = /(?:\d+[\.\)]\s*)([^\n]+)/g;
    let match;
    while ((match = numberedRegex.exec(text)) !== null) {
      if (match[1].trim().length > 0) {
        questions.push(match[1].trim());
      }
    }

    // If no questions found, try Strategy 2
    if (questions.length === 0) {
      questions = text.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 5 && line.includes('?'))
        .map(line => line.replace(/^\d+[\.\)]\s*/, ''));
    }

    console.log('Extracted questions:', questions);

    if (questions.length === 0) {
      throw new Error('Could not extract questions from Gemini response');
    }

    // Limit to requested number of questions
    questions = questions.slice(0, params.questionCount || 5);

    const interviewData = {
      questions,
      interviewId: generateId()
    };

    // Save to Firebase
    await saveInterviewToFirebase(interviewData, params);
    toast.success("Interview questions generated successfully!");

    return interviewData;
  } catch (error) {
    console.error('Error generating questions:', error);
    toast.error("Failed to generate questions. Please try again.");
    throw error;
  }
};

// Helper function to save the interview data to Firebase
async function saveInterviewToFirebase(
  result: GenerateQuestionsResponse,
  params: InterviewParams
): Promise<GenerateQuestionsResponse> {
  try {
    console.log('Saving interview to Firebase:', result);
    await addDoc(collection(db, "interviews"), {
      interviewId: result.interviewId,
      userId: params.userId,
      userName: params.userName,
      jobRole: params.jobRole || "Software Developer",
      industry: params.industry || null,
      experienceLevel: params.experienceLevel || "intermediate",
      techStack: params.techStack || [],
      questions: result.questions,
      status: "created",
      timestamp: serverTimestamp(),
    });

    return result;
  } catch (error) {
    console.error("Error saving interview to Firebase:", error);
    throw error;
  }
}

// New function to analyze answers and provide feedback
export const analyzeAnswer = async (
  question: string,
  answer: string,
  jobRole: string,
  experienceLevel: string,
  responseTime?: number
): Promise<AnswerFeedback> => {
  try {
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key not found');
    }

    console.log('Analyzing answer with Gemini...');
    toast.info("Analyzing your response...");

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Calculate response time score if available
    const responseTimeInfo = responseTime 
      ? `The candidate took ${responseTime.toFixed(1)} seconds to respond.` 
      : '';

    // Create a prompt for analysis
    const prompt = `
      As an expert interview coach, analyze this interview response for a ${jobRole} position at ${experienceLevel} level.
      
      Question: "${question}"
      
      Answer: "${answer}"
      
      ${responseTimeInfo}
      
      Provide a detailed analysis in the following JSON format:
      {
        "clarity": <number between 1-10>,
        "relevance": <number between 1-10>,
        "completeness": <number between 1-10>,
        "fillerWordsCount": <number of filler words used>,
        "fillerWords": [<array of filler words detected>],
        "confidenceLevel": <number between 1-10>,
        "suggestions": [<array of 3 specific improvement suggestions>],
        ${responseTime ? '"responseTimeScore": <number between 1-10 based on how appropriate the response time was>,' : ''}
        "overallScore": <number between 1-10>
      }
      
      For fillerWords detection, look for words and phrases like "um", "uh", "like", "you know", "sort of", "kind of", etc.
      
      When scoring:
      - For clarity, consider how well-articulated and understandable the answer is.
      - For relevance, assess how directly the answer addresses the question.
      - For completeness, evaluate if all aspects of the question were answered.
      - For confidenceLevel, judge the assertiveness and certainty in the delivery.
      ${responseTime ? `- For responseTimeScore, consider if the response time was appropriate (not too quick without thought, not too slow showing hesitation).` : ''}
      - For overallScore, calculate a weighted average giving more importance to relevance and completeness.
      
      Make your evaluation fair but constructive. Only return valid JSON without any additional text.
    `;

    const apiResponse = await model.generateContent(prompt);
    const response = apiResponse.response;
    const text = response.text();

    if (!text) {
      throw new Error('Empty response from Gemini API');
    }

    console.log('Raw feedback response:', text);

    // Parse JSON from the response
    // First, let's clean up the string to ensure it's valid JSON
    const jsonStr = text.replace(/```json|```/g, '').trim();
    const feedback = JSON.parse(jsonStr) as AnswerFeedback;

    return feedback;
  } catch (error) {
    console.error('Error analyzing answer:', error);
    toast.error("Failed to analyze your answer. Using default feedback.");
    
    // Provide a default feedback if analysis fails
    return {
      clarity: 5,
      relevance: 5,
      completeness: 5,
      fillerWordsCount: 0,
      fillerWords: [],
      confidenceLevel: 5,
      suggestions: [
        "We couldn't analyze your answer in detail. Try speaking clearly.",
        "Make sure your microphone is working properly.",
        "Consider providing more detailed responses."
      ],
      responseTime: responseTime || undefined,
      responseTimeScore: responseTime ? 5 : undefined,
      overallScore: 5
    };
  }
};

// Function to save answer feedback to Firebase
export const saveAnswerFeedback = async (
  interviewId: string,
  userId: string,
  questionIndex: number,
  question: string,
  answer: string,
  feedback: AnswerFeedback
): Promise<void> => {
  try {
    await addDoc(collection(db, "answerFeedbacks"), {
      interviewId,
      userId,
      questionIndex,
      question,
      answer,
      feedback,
      timestamp: serverTimestamp(),
    });
    
    console.log('Answer feedback saved to Firebase');
  } catch (error) {
    console.error('Error saving answer feedback:', error);
    throw error;
  }
};
