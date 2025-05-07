import React, { createContext, useContext, useState, ReactNode } from "react";
import { 
  InterviewSetup, 
  InterviewQuestion, 
  InterviewResponse,
  InterviewFeedback
} from "@/services/api";

interface InterviewContextType {
  step: 'setup' | 'questions' | 'feedback';
  setup: InterviewSetup | null;
  questions: InterviewQuestion[];
  currentQuestionIndex: number;
  responses: InterviewResponse[];
  feedback: InterviewFeedback | null;
  isRecording: boolean;
  isProcessing: boolean;
  setStep: (step: 'setup' | 'questions' | 'feedback') => void;
  setSetup: (setup: InterviewSetup) => void;
  setQuestions: (questions: InterviewQuestion[]) => void;
  setCurrentQuestionIndex: (index: number) => void;
  addResponse: (response: InterviewResponse) => void;
  setFeedback: (feedback: InterviewFeedback) => void;
  setIsRecording: (isRecording: boolean) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  resetInterview: () => void;
}

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

export const InterviewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [step, setStep] = useState<'setup' | 'questions' | 'feedback'>('setup');
  const [setup, setSetup] = useState<InterviewSetup | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<InterviewResponse[]>([]);
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const addResponse = (response: InterviewResponse) => {
    setResponses(prev => [...prev, response]);
  };

  const resetInterview = () => {
    setStep('setup');
    setSetup(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setResponses([]);
    setFeedback(null);
    setIsRecording(false);
    setIsProcessing(false);
  };

  return (
    <InterviewContext.Provider
      value={{
        step,
        setup,
        questions,
        currentQuestionIndex,
        responses,
        feedback,
        isRecording,
        isProcessing,
        setStep,
        setSetup,
        setQuestions,
        setCurrentQuestionIndex,
        addResponse,
        setFeedback,
        setIsRecording,
        setIsProcessing,
        resetInterview
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (context === undefined) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
};
