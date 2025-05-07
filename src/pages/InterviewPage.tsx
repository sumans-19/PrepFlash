
import React from 'react';
import { useInterview } from '@/contexts/InterviewContext';
import InterviewSetup from '@/components/InterviewSetup';
import InterviewQuestions from '@/components/InterviewQuestions';
import InterviewFeedback from '@/components/InterviewFeedback';
import { Loader2 } from 'lucide-react';

const InterviewPage: React.FC = () => {
  const { step, isProcessing } = useInterview();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-interview-dark mb-2">
            AI Interview Coach
          </h1>
          <p className="text-gray-600">
            Practice your interview skills with our AI-powered interview coach
          </p>
        </header>

        {isProcessing ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-lg shadow-lg p-8">
            <Loader2 className="h-16 w-16 animate-spin text-interview-primary mb-6" />
            <p className="text-xl text-gray-600 font-medium">Preparing your interview experience...</p>
            <p className="text-gray-500 mt-2">This might take a few moments</p>
          </div>
        ) : (
          <div className="transition-all duration-300 ease-in-out">
            {step === 'setup' && <InterviewSetup />}
            {step === 'questions' && <InterviewQuestions />}
            {step === 'feedback' && <InterviewFeedback />}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewPage;
