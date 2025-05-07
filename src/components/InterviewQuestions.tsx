
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useInterview } from '@/contexts/InterviewContext';
import { textToSpeech, analyzeInterviewPerformance } from '@/services/api';
import useVoiceRecognition from '@/hooks/useVoiceRecognition';
import VoiceWaveform from './VoiceWaveform';
import { Mic, MicOff } from 'lucide-react';

const InterviewQuestions: React.FC = () => {
  const { toast } = useToast();
  const {
    questions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    addResponse,
    setStep: setInterviewStep,
    setFeedback,
    responses,
    isRecording,
    setIsRecording,
    setIsProcessing
  } = useInterview();

  const [responseTime, setResponseTime] = useState<number>(0);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  const [isQuestionSpoken, setIsQuestionSpoken] = useState<boolean>(false);

  const { transcript, isListening, startListening, stopListening } = useVoiceRecognition({
    onResult: (result) => {
      console.log("Transcription result:", result);
    },
    onAudioData: (audioBlob, duration) => {
      if (currentQuestionIndex < questions.length) {
        const questionId = questions[currentQuestionIndex].id;
        addResponse({
          questionId,
          audioBlob,
          transcription: transcript,
          duration
        });
      }
    }
  });

  const currentQuestion = 
    currentQuestionIndex < questions.length 
      ? questions[currentQuestionIndex] 
      : null;

  const progress = ((currentQuestionIndex) / questions.length) * 100;

  useEffect(() => {
    const speakCurrentQuestion = async () => {
      if (currentQuestion && !isQuestionSpoken) {
        await textToSpeech(currentQuestion.question);
        setIsQuestionSpoken(true);
      }
    };

    speakCurrentQuestion();
  }, [currentQuestion, isQuestionSpoken]);

  const handleStartRecording = () => {
    setIsRecording(true);
    startListening();
    
    // Start timer for response duration
    const timer = setInterval(() => {
      setResponseTime(prev => prev + 1);
    }, 1000);
    
    setTimerId(timer);
  };

  const handleStopRecording = () => {
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
    
    stopListening();
    setIsRecording(false);
  };

  const handleNextQuestion = () => {
    // Reset state for next question
    setResponseTime(0);
    setIsQuestionSpoken(false);
    
    // Move to next question or finish interview
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishInterview();
    }
  };

  const finishInterview = async () => {
    setIsProcessing(true);
    try {
      // Analyze interview performance
      const feedbackData = await analyzeInterviewPerformance(responses);
      setFeedback(feedbackData);
      
      // Move to the feedback step
      setInterviewStep('feedback');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze interview responses. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  // If no questions are available
  if (questions.length === 0) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="py-10 text-center">
          <p>No interview questions available. Please set up your interview first.</p>
          <Button 
            onClick={() => setInterviewStep('setup')}
            className="mt-4 bg-interview-primary hover:bg-interview-secondary text-white"
          >
            Go to Setup
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg border-t-4 border-t-interview-accent overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-interview-primary to-interview-secondary text-white p-6">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold">Interview in Progress</CardTitle>
            <CardDescription className="text-gray-100">
              Question {currentQuestionIndex + 1} of {questions.length}
            </CardDescription>
          </div>
          <div className="text-white bg-black/20 px-3 py-1 rounded-full text-sm">
            {formatTime(responseTime)}
          </div>
        </div>
      </CardHeader>
      
      <Progress value={progress} className="h-1 rounded-none" />
      
      <CardContent className="p-6">
        {currentQuestion && (
          <div className="space-y-8">
            <div className="bg-gray-50 p-5 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-1">Question:</h3>
              <p className="text-lg">{currentQuestion.question}</p>
            </div>
            
            <div className="text-center py-4">
              <div className="mb-6">
                <VoiceWaveform isActive={isRecording} />
              </div>
              
              <div className="relative flex flex-col items-center">
                {!isRecording ? (
                  <Button 
                    variant="outline" 
                    className="rounded-full h-16 w-16 p-0 border-2 border-interview-accent"
                    onClick={handleStartRecording}
                  >
                    <Mic className="h-8 w-8 text-interview-accent" />
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    className="rounded-full h-16 w-16 p-0 border-2 border-red-500"
                    onClick={handleStopRecording}
                  >
                    <MicOff className="h-8 w-8 text-red-500" />
                  </Button>
                )}
                <div className="mt-2 text-sm text-gray-500">
                  {isRecording ? 'Recording... Click to stop' : 'Click to start answering'}
                </div>
              </div>
            </div>
            
            {transcript && !isRecording && (
              <div className="bg-gray-50 p-5 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-1">Your Answer:</h3>
                <p>{transcript}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between p-6 bg-gray-50">
        <div className="text-sm text-gray-500">
          {isRecording 
            ? "Speak clearly and take your time" 
            : transcript 
              ? "You can proceed to the next question" 
              : "Click the microphone button to start answering"}
        </div>
        <Button 
          onClick={handleNextQuestion}
          disabled={isRecording || (!transcript && currentQuestionIndex < questions.length - 1)}
          className="bg-interview-primary hover:bg-interview-secondary text-white"
        >
          {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Interview"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InterviewQuestions;
