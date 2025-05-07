
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Badge } from '@/components/ui/badge';
import { useInterview } from '@/contexts/InterviewContext';
import { generateInterviewQuestions, textToSpeech, InterviewSetup as SetupType } from '@/services/api';
import useVoiceRecognition from '@/hooks/useVoiceRecognition';
import VoiceWaveform from './VoiceWaveform';
import { Mic, MicOff } from 'lucide-react';

enum SetupStep {
  INTRO = 'intro',
  JOB_ROLE = 'jobRole',
  TECH_STACK = 'techStack',
  DIFFICULTY = 'difficultyLevel',
  QUESTION_COUNT = 'questionCount',
  REVIEW = 'review'
}

const InterviewSetupComponent: React.FC = () => {
  const { toast } = useToast();
  const {
    setSetup,
    setQuestions,
    setStep: setInterviewStep,
    setIsProcessing
  } = useInterview();
  
  const [currentStep, setCurrentStep] = useState<SetupStep>(SetupStep.INTRO);
  const [setupData, setSetupData] = useState<Partial<SetupType>>({});
  const [isReady, setIsReady] = useState<boolean>(false);
  
  const { transcript, isListening, startListening, stopListening } = useVoiceRecognition({
    onResult: (result) => handleVoiceInput(result),
  });

  const setupPrompts = {
    [SetupStep.INTRO]: "Welcome to your virtual interview practice. I'm your AI interviewer today. To set up your interview, I'll ask you a few questions. Please respond verbally when you see the microphone icon. Are you ready to begin?",
    [SetupStep.JOB_ROLE]: "What job role are you applying for?",
    [SetupStep.TECH_STACK]: "Great! What primary technical skills or technology stack will this interview focus on?",
    [SetupStep.DIFFICULTY]: "What difficulty level do you prefer? You can say beginner, intermediate, or advanced.",
    [SetupStep.QUESTION_COUNT]: "How many interview questions would you like? Please say a number between 3 and 10.",
    [SetupStep.REVIEW]: "Great! I've got all the information. Let's review your interview setup:"
  };
  
  const startSetup = async () => {
    await textToSpeech(setupPrompts[SetupStep.INTRO]);
    setCurrentStep(SetupStep.JOB_ROLE);
  };

  useEffect(() => {
    if (currentStep !== SetupStep.INTRO && currentStep !== SetupStep.REVIEW && !isListening) {
      const speakPrompt = async () => {
        await textToSpeech(setupPrompts[currentStep]);
        startListening();
      };
      speakPrompt();
    }
  }, [currentStep, isListening]);

  const handleVoiceInput = (result: string) => {
    if (!result) return;
    
    switch (currentStep) {
      case SetupStep.JOB_ROLE:
        setSetupData(prev => ({ ...prev, jobRole: result }));
        setCurrentStep(SetupStep.TECH_STACK);
        break;
      case SetupStep.TECH_STACK:
        setSetupData(prev => ({ ...prev, techStack: result }));
        setCurrentStep(SetupStep.DIFFICULTY);
        break;
      case SetupStep.DIFFICULTY:
        const lowerResult = result.toLowerCase();
        let difficulty = 'intermediate';
        
        if (lowerResult.includes('beginner') || lowerResult.includes('easy')) {
          difficulty = 'beginner';
        } else if (lowerResult.includes('advanced') || lowerResult.includes('hard')) {
          difficulty = 'advanced';
        }
        
        setSetupData(prev => ({ ...prev, difficultyLevel: difficulty }));
        setCurrentStep(SetupStep.QUESTION_COUNT);
        break;
      case SetupStep.QUESTION_COUNT:
        // Extract number from the string
        const numberMatch = result.match(/\d+/);
        let count = numberMatch ? parseInt(numberMatch[0], 10) : 5;
        
        // Ensure count is within bounds
        count = Math.min(Math.max(count, 3), 10);
        
        setSetupData(prev => ({ ...prev, questionCount: count }));
        setCurrentStep(SetupStep.REVIEW);
        setIsReady(true);
        
        // Speak the review prompt
        textToSpeech(setupPrompts[SetupStep.REVIEW]);
        break;
    }
  };

  const handleStartInterview = async () => {
    if (!setupData.jobRole || !setupData.techStack || !setupData.difficultyLevel || !setupData.questionCount) {
      toast({
        title: "Missing Information",
        description: "Please complete all setup steps before starting the interview.",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    try {
      const fullSetupData = setupData as SetupType;
      setSetup(fullSetupData);
      
      // Generate interview questions
      const generatedQuestions = await generateInterviewQuestions(fullSetupData);
      setQuestions(generatedQuestions);
      
      // Move to the questions step
      setInterviewStep('questions');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate interview questions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg border-t-4 border-t-interview-accent">
      <CardHeader className="bg-gradient-to-r from-interview-primary to-interview-secondary text-white p-6 rounded-t-md">
        <CardTitle className="text-2xl font-bold">Virtual Interview Setup</CardTitle>
        <CardDescription className="text-gray-100">
          Let me help you prepare for your next interview with personalized questions.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6 pb-4 px-6">
        <div className="space-y-6">
          {currentStep === SetupStep.INTRO ? (
            <div className="text-center py-10">
              <h3 className="text-xl font-semibold mb-4">Welcome to your AI Interview Practice</h3>
              <p className="text-gray-600 mb-6">
                I'll be your virtual interviewer today. I'll ask questions using voice, 
                and you'll respond verbally. At the end, you'll receive feedback on your performance.
              </p>
              <Button 
                onClick={startSetup}
                className="bg-interview-primary hover:bg-interview-secondary text-white px-6"
              >
                Begin Setup
              </Button>
            </div>
          ) : currentStep === SetupStep.REVIEW ? (
            <div className="space-y-4 py-4">
              <h3 className="text-xl font-semibold">Your Interview Setup</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-500">Job Role</p>
                  <p className="font-medium">{setupData.jobRole}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-500">Technical Focus</p>
                  <p className="font-medium">{setupData.techStack}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-500">Difficulty</p>
                  <Badge className="bg-interview-secondary">
                    {setupData.difficultyLevel}
                  </Badge>
                </div>
                <div className="p-4 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-500">Number of Questions</p>
                  <p className="font-medium">{setupData.questionCount}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">
              <h3 className="text-xl font-semibold mb-6">{setupPrompts[currentStep]}</h3>
              <div className="mb-4">
                <VoiceWaveform isActive={isListening} />
              </div>
              <div className="relative">
                {isListening ? (
                  <Button 
                    variant="outline" 
                    className="rounded-full h-16 w-16 p-0 border-2 border-interview-accent"
                    onClick={stopListening}
                  >
                    <MicOff className="h-8 w-8 text-interview-accent" />
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    className="rounded-full h-16 w-16 p-0 border-2 border-gray-300"
                    onClick={startListening}
                  >
                    <Mic className="h-8 w-8 text-gray-400" />
                  </Button>
                )}
                <div className="mt-4 text-sm text-gray-500">
                  {isListening ? 'Listening...' : 'Click to speak'}
                </div>
              </div>
              {transcript && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Your response:</p>
                  <p className="text-gray-800">{transcript}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end gap-4 pt-2 pb-6 px-6">
        {currentStep === SetupStep.REVIEW && (
          <>
            <Button 
              variant="outline" 
              onClick={() => {
                setSetupData({});
                setCurrentStep(SetupStep.JOB_ROLE);
              }}
            >
              Reset Setup
            </Button>
            <Button 
              onClick={handleStartInterview}
              className="bg-interview-primary hover:bg-interview-secondary text-white"
            >
              Start Interview
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default InterviewSetupComponent;
