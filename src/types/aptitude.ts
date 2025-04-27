
export interface Formula {
    id: string;
    topic: string;
    title: string;
    expression: string;
    description: string;
    example?: string;
  }
  
  export interface AptitudeQuestion {
    id: string;
    question: string;
    options?: string[];
    correctAnswer: string;
    explanation: string;
    topic: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    targetRole: string[];
    company: string[];
    format: 'MCQ' | 'Fill in the blanks' | 'Descriptive';
    timeRequired: number; // in seconds
    isBookmarked?: boolean;
    lastAttempted?: Date;
  }
  
  export type Topic = {
    id: string;
    name: string;
    icon: string;
  }
  
  export type Difficulty = 'Easy' | 'Medium' | 'Hard';
  export type Format = 'MCQ' | 'Fill in the blanks' | 'Descriptive';
  