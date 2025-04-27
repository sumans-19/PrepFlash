import React, { useEffect, useState } from 'react';
import { Mic, MicOff, X, Volume2, PauseCircle } from 'lucide-react';

interface InterviewSessionProps {
  currentQuestionIndex: number;
  interviewQuestions: string[];
  lastMessage: string;
  isSpeaking: boolean;
  userName: string;
  jobRole: string;
  interimTranscript: string;
  onEndInterview: () => void;
  isActive: boolean;
  messages: any[];
}

const InterviewSession: React.FC<InterviewSessionProps> = ({
  currentQuestionIndex,
  interviewQuestions,
  lastMessage,
  isSpeaking,
  userName,
  jobRole,
  interimTranscript,
  onEndInterview,
  isActive
}) => {
  const [timer, setTimer] = useState<number>(0);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [animationFrames, setAnimationFrames] = useState<number[]>([]);
  
  // Start or stop timer based on active status
  useEffect(() => {
    let intervalId: number;
    if (isActive) {
      intervalId = window.setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isActive]);
  
  // Format timer as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Generate random waveform animation for microphone
  useEffect(() => {
    if (!isListening && !interimTranscript) {
      setAnimationFrames([]);
      return;
    }
    
    // Listening just started or has input, generate waveform
    if (interimTranscript.length > 0) {
      setIsListening(true);
      
      // Create random heights for waveform bars
      const frames = Array.from({ length: 20 }, () => 
        Math.floor(Math.random() * 35) + 5
      );
      setAnimationFrames(frames);
      
      // Regenerate waveform every 200ms when speaking
      const animationId = window.setTimeout(() => {
        setAnimationFrames(Array.from({ length: 20 }, () => 
          Math.floor(Math.random() * 35) + 5
        ));
      }, 200);
      
      return () => {
        window.clearTimeout(animationId);
      };
    } else {
      setIsListening(false);
    }
  }, [interimTranscript, isListening]);
  
  return (
    <div className="w-full max-w-3xl mx-auto relative">
      {/* Status Bar */}
      <div className="flex items-center justify-between mb-6 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
          <span className="text-sm font-medium">Interview in Progress</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm font-mono">{formatTime(timer)}</div>
          <button 
            onClick={onEndInterview}
            className="p-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition-colors"
            title="End Interview"
          >
            <X size={18} />
          </button>
        </div>
      </div>
      
      {/* Interview Content */}
      <div className="space-y-6">
        {/* Progress Indicator */}
        <div className="mb-4 flex items-center justify-center">
          <div className="w-full max-w-md bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div 
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-500 ease-out"
              style={{ 
                width: `${interviewQuestions.length > 0 
                  ? ((currentQuestionIndex + 1) / interviewQuestions.length) * 100 
                  : 0}%` 
              }}
            ></div>
          </div>
          {interviewQuestions.length > 0 && (
            <span className="text-xs font-medium ml-3 text-gray-500">
              {currentQuestionIndex + 1}/{interviewQuestions.length}
            </span>
          )}
        </div>
        
        {/* Current Question Display */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm mb-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Current Question
          </h3>
          <p className="text-lg font-medium">
            {currentQuestionIndex >= 0 && currentQuestionIndex < interviewQuestions.length 
              ? interviewQuestions[currentQuestionIndex]
              : lastMessage || "The interview will begin shortly..."}
          </p>
          
          {/* AI Speaking Indicator */}
          {isSpeaking && (
            <div className="flex items-center mt-4 text-blue-600 dark:text-blue-400 animate-pulse">
              <Volume2 size={16} className="mr-2" />
              <span className="text-sm font-medium">AI Interviewer is speaking...</span>
            </div>
          )}
        </div>
        
        {/* Microphone and Transcript Display */}
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Your Response
            </h3>
            
            {/* Mic Status Indicator */}
            <div className={`flex items-center text-sm ${isListening ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
              {isListening ? (
                <>
                  <Mic size={16} className="mr-1.5" />
                  <span>Listening</span>
                </>
              ) : (
                <>
                  <MicOff size={16} className="mr-1.5" />
                  <span>Not listening</span>
                </>
              )}
            </div>
          </div>
          
          {/* Audio Waveform Visualization */}
          {isListening && animationFrames.length > 0 && (
            <div className="flex items-center justify-center h-12 mb-3 space-x-1">
              {animationFrames.map((height, index) => (
                <div 
                  key={index}
                  className="w-1.5 bg-green-500 dark:bg-green-400 rounded-full transition-all duration-150"
                  style={{ 
                    height: `${height}%`,
                    opacity: height / 40 + 0.3
                  }}
                />
              ))}
            </div>
          )}
          
          {/* Live Transcript */}
          <div className="min-h-24 max-h-32 overflow-y-auto bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-3">
            {interimTranscript ? (
              <p className="text-gray-700 dark:text-gray-300">{interimTranscript}</p>
            ) : (
              <p className="text-gray-400 dark:text-gray-500 italic">
                {isActive 
                  ? "Speak your answer when the AI interviewer finishes asking the question..." 
                  : "Waiting for interview to begin..."}
              </p>
            )}
          </div>
          
          {/* Tips */}
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            <p>Speak clearly and naturally. The AI will automatically detect when you've finished answering.</p>
          </div>
        </div>
      </div>
      
      {/* End Interview Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={onEndInterview}
          className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-md transition-colors flex items-center"
        >
          <PauseCircle size={18} className="mr-2" />
          End Interview
        </button>
      </div>
    </div>
  );
};

export default InterviewSession;