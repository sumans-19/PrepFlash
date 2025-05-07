
// User profile
export type UserProfile = {
    name: string;
    role: string;
    techStack: string[];
    experienceLevel: 'junior' | 'mid-level' | 'senior';
  };
  
  // Interview mode
  export type InterviewMode = 'voice' | 'video';
  
  // Interview settings
  export type InterviewSettings = {
    mode: InterviewMode;
    questionCount: number;
    duration: number; // minutes
  };
  
  // Question
  export type Question = {
    id: number;
    text: string;
    asked?: boolean;
    answered?: boolean;
    answer?: string;
    feedback?: any;
  };
  
  // Interview session
  export type InterviewSession = {
    id: string;
    userId: string;
    date: Date;
    duration: number; // seconds
    mode: InterviewMode;
    role: string;
    techStack: string[];
    questions: Question[];
    overallFeedback?: any;
  };
  
  // Behavioral types
  export type BehavioralFlashcard = {
    id: number;
    question: string;
    trait: string;
    insight: string;
    choices?: string[];
    bestAnswer?: number;
  };
  
  export type BehavioralScenario = {
    id: string;
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    duration: string;
    skills: string[];
    progress: number;
    image?: string;
    steps?: BehavioralScenarioStep[];
  };
  
  export type BehavioralScenarioStep = {
    situation: string;
    choices: string[];
    feedback: Record<string, string>;
    bestChoice: number;
  };
  
  export type BehavioralQuiz = {
    id: string;
    title: string;
    description: string;
    questions: number;
    timeEstimate: string;
    category: string;
    completed: boolean;
    image?: string;
  };
  
  export type BehavioralQuizQuestion = {
    id: number;
    text: string;
    options: string[];
  };
  
  export type BehavioralQuizResult = {
    primaryStyle: string;
    secondaryStyle: string;
    description: string;
    strengths: string[];
    improvements: string[];
    interviewTips: string[];
  };
  
  export type PracticeQuestion = {
    id: number;
    text: string;
    category: string;
    difficulty: string;
    estimatedTime: string;
  };
  
  export type ExampleAnswer = {
    id: number;
    question: string;
    role: string;
    company: string;
    experience: string;
    answers: {
      id: number;
      rating: number;
      answer: string;
      strengths: string[];
    }[];
  };
  
  // Add the AudioAnalysis type that's needed by speechService.ts
  export type AudioAnalysis = {
    fillerWords: {
      count: number;
      words: string[];
    };
    speechSpeed: number; // words per minute
  };
  
  export type VideoAnalysis = {
    expression: string;
    confidence: number;
    details: Record<string, number>;
  };
  
  export type ScenarioFeedback = {
    score: number;
    feedback: string;
    traitDevelopment: Record<string, number>;
    nextSteps: string[];
  };
  
  export type BehavioralResponse = {
    score: number;
    strengths: string[];
    improvements: string[];
    overall: string;
  };
  