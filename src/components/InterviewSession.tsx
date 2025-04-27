
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader, ArrowDown, Mic, User, MessageSquare } from 'lucide-react';
import { cn } from "@/lib/utils";

interface Message {
  role: "assistant" | "user";
  content: string;
}

interface InterviewSessionProps {
  currentQuestionIndex: number;
  interviewQuestions: string[];
  lastMessage: string;
  isSpeaking: boolean;
  userName: string;
  jobRole: string;
  interimTranscript?: string;
  onEndInterview: () => void;
  isActive: boolean;
  messages: Message[];
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
  isActive,
  messages
}) => {
  return (
    <div className="w-full flex flex-col gap-4 items-center animate-fade-in">
      {/* Interviewer/User Display */}
      <div className="flex items-center justify-center gap-8 mb-4 w-full">
        {/* AI Interviewer */}
        <div className="flex flex-col items-center text-center p-4 rounded-lg bg-primary/5 border border-primary/10 shadow-sm w-1/2">
          <div className="relative mb-2">
            <div className={cn(
              "h-16 w-16 rounded-full border-2 border-primary/20 shadow-md flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/20 transition-all duration-300",
              isSpeaking ? "ring-4 ring-primary/40 ring-offset-2 ring-offset-background scale-110" : "scale-100"
            )}>
              <Mic className="h-8 w-8 text-primary" />
            </div>
            {isSpeaking && (
              <span className="absolute right-0 bottom-0 block w-4 h-4 rounded-full bg-green-400 animate-pulse ring-2 ring-white dark:ring-gray-800" />
            )}
          </div>
          <div className="font-medium text-sm text-primary">AI Interviewer</div>
          <Badge variant="outline" className="mt-1 text-xs">
            {isSpeaking ? "Speaking..." : "Listening..."}
          </Badge>
        </div>
        
        {/* User */}
        <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50 border border-border shadow-sm w-1/2">
          <div className="relative mb-2">
            <User className="h-16 w-16 rounded-full bg-muted border-2 border-muted-foreground/20 text-muted-foreground p-3" />
          </div>
          <div className="font-medium text-sm text-foreground">{userName}</div>
          <Badge variant="secondary" className="mt-1 text-xs">{jobRole}</Badge>
        </div>
      </div>

      {/* Current Question Display */}
      {currentQuestionIndex >= 0 && currentQuestionIndex < interviewQuestions.length && (
        <div className="w-full p-3 bg-background border rounded-md shadow-sm text-center">
          <Badge variant="outline" className="mb-2 text-xs">
            Question {currentQuestionIndex + 1} of {interviewQuestions.length}
          </Badge>
          <p className="font-medium text-sm md:text-base">{interviewQuestions[currentQuestionIndex]}</p>
        </div>
      )}

      {/* Last Message / Status Display */}
      <div className="w-full bg-muted rounded-lg p-4 min-h-[60px] text-center shadow-inner transition-all duration-500 border border-border">
        <span className="text-sm text-muted-foreground italic">
          {!isActive ? "Connecting to interview..." : (lastMessage || "Waiting for AI...")}
        </span>
      </div>
      
      {/* Interim Transcript Display (real-time feedback) */}
      {interimTranscript && (
        <div className="w-full p-3 bg-background/80 border border-dashed border-primary/30 rounded-md">
          <div className="flex items-center gap-1 mb-1">
            <MessageSquare className="h-3 w-3 text-primary/70" />
            <span className="text-xs text-primary/70">Your response (in progress):</span>
          </div>
          <p className="text-sm text-muted-foreground">{interimTranscript}</p>
        </div>
      )}

      {/* Conversation History Display */}
      {messages.length > 0 && (
        <div className="w-full border rounded-md shadow-sm overflow-y-auto max-h-[300px] bg-background/70">
          <div className="p-4 space-y-3">
            <h3 className="text-sm font-medium mb-2">Conversation History</h3>
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                <div className={cn(
                  "rounded-lg px-3 py-2 max-w-[80%] break-words text-sm",
                  msg.role === 'assistant' 
                    ? "bg-primary/10 text-primary-foreground/90" 
                    : "bg-secondary/20 text-secondary-foreground/90"
                )}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Call Controls */}
      <div className="flex gap-4 mt-4 justify-center">
        {isActive ? (
          <Button
            variant="destructive"
            size="lg"
            className="px-8 py-3 text-base"
            onClick={onEndInterview}
          >
            <ArrowDown className="mr-2 w-5 h-5" /> End Interview
          </Button>
        ) : (
          <Button
            size="lg"
            className="px-8 py-3 text-base"
            disabled
          >
            <Loader className="animate-spin mr-2 w-4 h-4" /> Connecting...
          </Button>
        )}
      </div>
    </div>
  );
};

export default InterviewSession;
