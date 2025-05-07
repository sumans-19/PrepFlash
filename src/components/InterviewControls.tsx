
import React from 'react';
import { Button } from '@/components/ui/button';
import { RecordingState } from '../types/index';
import { Camera, CameraOff, Mic, MicOff, Pause, Play, Square } from 'lucide-react';

interface InterviewControlsProps {
  recordingState: RecordingState;
  onStartRecording: () => void;
  onPauseRecording: () => void;
  onResumeRecording: () => void;
  onStopRecording: () => void;
  onSetupMedia: () => void;
  hasMediaStream: boolean;
  currentQuestion: number;
  totalQuestions: number;
  onNextQuestion: () => void;
  onPreviousQuestion: () => void;
  className?: string;
}

export const InterviewControls: React.FC<InterviewControlsProps> = ({
  recordingState,
  onStartRecording,
  onPauseRecording,
  onResumeRecording,
  onStopRecording,
  onSetupMedia,
  hasMediaStream,
  currentQuestion,
  totalQuestions,
  onNextQuestion,
  onPreviousQuestion,
  className = ''
}) => {
  return (
    <div className={`flex flex-col space-y-4 ${className}`}>
      {/* Question navigation */}
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={onPreviousQuestion} 
          disabled={currentQuestion <= 0 || recordingState === 'recording'}
        >
          Previous
        </Button>
        
        <span className="text-sm font-medium">
          Question {currentQuestion + 1} of {totalQuestions}
        </span>
        
        <Button 
          variant="outline" 
          onClick={onNextQuestion}
          disabled={currentQuestion >= totalQuestions - 1 || recordingState === 'recording'}
        >
          Next
        </Button>
      </div>
      
      {/* Media controls */}
      <div className="flex justify-center space-x-3">
        {!hasMediaStream && (
          <Button 
            onClick={onSetupMedia} 
            className="bg-interview-blue hover:bg-interview-blue-dark"
            disabled={recordingState !== 'idle'}
          >
            <Camera className="mr-2 h-4 w-4" />
            Setup Camera
          </Button>
        )}
        
        {hasMediaStream && recordingState === 'preparing' && (
          <Button 
            onClick={onStartRecording} 
            variant="default" 
            className="bg-interview-blue hover:bg-interview-blue-dark"
          >
            <Play className="mr-2 h-4 w-4" />
            Start Recording
          </Button>
        )}
        
        {recordingState === 'recording' && (
          <>
            <Button 
              onClick={onPauseRecording} 
              variant="outline"
            >
              <Pause className="mr-2 h-4 w-4" />
              Pause
            </Button>
            
            <Button 
              onClick={onStopRecording} 
              variant="destructive"
            >
              <Square className="mr-2 h-4 w-4" />
              Stop
            </Button>
          </>
        )}
        
        {recordingState === 'paused' && (
          <>
            <Button 
              onClick={onResumeRecording} 
              variant="default"
              className="bg-interview-blue hover:bg-interview-blue-dark"
            >
              <Play className="mr-2 h-4 w-4" />
              Resume
            </Button>
            
            <Button 
              onClick={onStopRecording} 
              variant="destructive"
            >
              <Square className="mr-2 h-4 w-4" />
              Stop
            </Button>
          </>
        )}
        
        {recordingState === 'processing' && (
          <Button disabled>
            Processing...
          </Button>
        )}
      </div>
      
      {/* Recording status */}
      {recordingState !== 'idle' && (
        <div className="flex justify-center items-center space-x-2">
          {recordingState === 'recording' && (
            <>
              <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse-light" />
              <span className="text-sm font-medium">Recording</span>
            </>
          )}
          
          {recordingState === 'paused' && (
            <>
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <span className="text-sm font-medium">Paused</span>
            </>
          )}
          
          {recordingState === 'processing' && (
            <>
              <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse-light" />
              <span className="text-sm font-medium">Processing</span>
            </>
          )}
          
          {recordingState === 'preparing' && (
            <>
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="text-sm font-medium">Ready to Record</span>
            </>
          )}
          
          {recordingState === 'reviewing' && (
            <>
              <div className="h-3 w-3 rounded-full bg-purple-500" />
              <span className="text-sm font-medium">Review Mode</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default InterviewControls;
