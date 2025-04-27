import React, { useState } from 'react';
import { Mic, Settings, AlertCircle, Loader } from 'lucide-react';
import InterviewPreparationForm from './InterviewPreparationForm';
import toast from 'react-hot-toast';
import { geminiGenerateQuestions } from '@/lib/gemini.sdk';

interface InterviewGeneratorProps {
  userName: string;
  userId: string;
  onInterviewGenerated: (questions: string[], interviewId: string) => void;
  initialValues?: {
    jobRole?: string;
    techStack?: string;
    experienceLevel?: string;
    industry?: string;
  };
}

const InterviewGenerator: React.FC<InterviewGeneratorProps> = ({
  userName,
  userId,
  onInterviewGenerated,
  initialValues = {}
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>("");
  const [jobRole, setJobRole] = useState(initialValues.jobRole || '');
  const [techStack, setTechStack] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState(initialValues.experienceLevel || '');
  const [industry, setIndustry] = useState(initialValues.industry || '');

  const handleGenerateInterview = async (data: {
    jobRole: string;
    techStack: string[];
    experienceLevel: string;
    industry: string;
    questionCount: number;
    additionalInfo: string;
  }) => {
    if (!userId || !userName) {
      toast.error("Please login to continue.");
      setError("User authentication required.");
      return;
    }
    
    setIsGenerating(true);
    setError("");
    
    setJobRole(data.jobRole);
    setTechStack(data.techStack);
    setExperienceLevel(data.experienceLevel);
    setIndustry(data.industry);

    try {
      const params = {
        userId,
        userName,
        jobRole: data.jobRole,
        industry: data.industry,
        experienceLevel: data.experienceLevel,
        questionCount: data.questionCount,
        techStack: data.techStack
      };

      console.log("Generating interview with params:", params);
      toast.loading("Generating personalized interview questions...");

      const { questions, interviewId } = await geminiGenerateQuestions(params);

      console.log("Generated questions:", questions);
      console.log("Interview ID:", interviewId);
      toast.success("Interview questions generated successfully!");

      onInterviewGenerated(questions, interviewId);
    } catch (err) {
      console.error("Error generating questions:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Failed to generate interview questions: ${errorMessage}`);
      toast.error("Failed to generate interview questions. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
            <Mic className="w-6 h-6 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2 text-gray-900">AI Voice Interview Practice</h1>
        <p className="text-gray-600">
          Practice for your next job interview with our AI-powered voice interview system
        </p>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 p-4 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-800">Setup Your Interview</h2>
        </div>
        
        {error && (
          <div className="p-4 mb-4 bg-red-50 text-red-700 text-sm border-l-4 border-red-500">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}
        
        <div className="p-6">
          <div className="flex flex-col gap-4 w-full">
            <h3 className="font-medium text-lg mb-1 text-center">Interview Preferences</h3>
            <p className="text-center text-gray-500 mb-4">Hello, {userName}! Set up your interview preferences below.</p>

            <InterviewPreparationForm
              onGenerateInterview={handleGenerateInterview}
              isGenerating={isGenerating}
              userName={userName}
              initialValues={{
                jobRole,
                techStack: techStack.join(', '),
                experienceLevel,
                industry
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewGenerator;