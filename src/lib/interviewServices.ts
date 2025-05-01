import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { VoiceMetrics } from './voiceAnalysis';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export interface Interview {
  id: string;
  userId: string;
  questions: string[];
  answers: Answer[];
  jobRole: string;
  industry: string;
  experienceLevel: string;
  techStack: string[];
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface Answer {
  questionIndex: number;
  content: string;
  responseTime: number;
  fillerWords: string[];
  hesitations: number;
  voiceMetrics?: VoiceMetrics;
  feedback?: AnswerFeedback;
}

export interface AnswerFeedback {
  clarity: number;
  relevance: number;
  completeness: number;
  confidenceLevel: number;
  suggestions: string[];
  overallScore: number;
}

export const createInterview = async (params: {
  userId: string;
  jobRole: string;
  industry: string;
  experienceLevel: string;
  techStack: string[];
}): Promise<Interview> => {
  try {
    // Generate questions using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `Generate 5 technical interview questions for a ${params.jobRole} position.
      Industry: ${params.industry}
      Experience Level: ${params.experienceLevel}
      Required Tech Stack: ${params.techStack.join(', ')}
      
      Format the response as a JSON array of strings containing only the questions.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const questions = JSON.parse(response.text());

    const interview: Omit<Interview, 'id'> = {
      userId: params.userId,
      questions,
      answers: [],
      jobRole: params.jobRole,
      industry: params.industry,
      experienceLevel: params.experienceLevel,
      techStack: params.techStack,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await addDoc(collection(db, 'interviews'), interview);
    return { ...interview, id: docRef.id };
  } catch (error) {
    console.error('Error creating interview:', error);
    throw error;
  }
};

export const getInterview = async (id: string): Promise<Interview | null> => {
  try {
    const docRef = doc(db, 'interviews', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Interview;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting interview:', error);
    throw error;
  }
};

export const saveAnswer = async (
  interviewId: string,
  answer: Answer
): Promise<void> => {
  try {
    const docRef = doc(db, 'interviews', interviewId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Interview not found');
    }
    
    const interview = docSnap.data() as Interview;
    const answers = [...interview.answers];
    answers[answer.questionIndex] = answer;
    
    await updateDoc(docRef, {
      answers,
      status: answer.questionIndex === interview.questions.length - 1 ? 'completed' : 'in-progress',
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error saving answer:', error);
    throw error;
  }
};

export const analyzeAnswer = async (
  question: string,
  answer: string,
  jobRole: string,
  experienceLevel: string,
  voiceMetrics?: VoiceMetrics
): Promise<AnswerFeedback> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `Analyze this technical interview response:
      Question: ${question}
      Answer: ${answer}
      Role: ${jobRole}
      Experience Level: ${experienceLevel}
      ${voiceMetrics ? `
      Voice Metrics:
      - Volume: ${voiceMetrics.volume}
      - Clarity: ${voiceMetrics.clarity}
      - Confidence: ${voiceMetrics.confidence}
      ` : ''}
      
      Provide feedback in JSON format with these fields:
      - clarity (1-10)
      - relevance (1-10)
      - completeness (1-10)
      - confidenceLevel (1-10)
      - suggestions (array of improvement suggestions)
      - overallScore (1-10)`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error('Error analyzing answer:', error);
    throw error;
  }
};