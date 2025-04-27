
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnswerFeedback } from "@/lib/gemini.sdk";
import { cn } from "@/lib/utils";
import { MessageSquare, ThumbsUp, AlertTriangle, VolumeX, Clock } from 'lucide-react';

interface AnswerFeedbackCardProps {
  question: string;
  answer: string;
  feedback: AnswerFeedback;
  questionNumber: number;
}

const AnswerFeedbackCard: React.FC<AnswerFeedbackCardProps> = ({
  question,
  answer,
  feedback,
  questionNumber
}) => {
  // Helper to get color class based on score
  const getScoreColorClass = (score: number) => {
    if (score >= 8) return "text-green-500";
    if (score >= 5) return "text-amber-500";
    return "text-red-500";
  };
  
  // Helper to get badge variant based on score
  const getScoreBadgeVariant = (score: number) => {
    if (score >= 8) return "default";
    if (score >= 5) return "secondary";
    return "destructive";
  };

  // Format response time to a readable string
  const formatResponseTime = (seconds?: number): string => {
    if (!seconds) return "Not measured";
    
    if (seconds < 60) {
      return `${seconds.toFixed(1)} seconds`;
    } else {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}m ${remainingSeconds.toFixed(0)}s`;
    }
  };

  return (
    <Card className="w-full mb-4 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex flex-row justify-between items-center">
          <CardTitle className="text-lg font-medium">
            Question {questionNumber}: {question}
          </CardTitle>
          <Badge variant={getScoreBadgeVariant(feedback.overallScore)}>
            Score: {feedback.overallScore}/10
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* User's Answer */}
          <div className="bg-muted p-3 rounded-md">
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Your Answer:</span>
            </div>
            <p className="text-sm">{answer}</p>
          </div>
          
          {/* Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div className="bg-background p-2 rounded border">
              <div className="text-xs text-muted-foreground uppercase">Clarity</div>
              <div className={cn("text-lg font-semibold", getScoreColorClass(feedback.clarity))}>
                {feedback.clarity}/10
              </div>
            </div>
            
            <div className="bg-background p-2 rounded border">
              <div className="text-xs text-muted-foreground uppercase">Relevance</div>
              <div className={cn("text-lg font-semibold", getScoreColorClass(feedback.relevance))}>
                {feedback.relevance}/10
              </div>
            </div>
            
            <div className="bg-background p-2 rounded border">
              <div className="text-xs text-muted-foreground uppercase">Completeness</div>
              <div className={cn("text-lg font-semibold", getScoreColorClass(feedback.completeness))}>
                {feedback.completeness}/10
              </div>
            </div>
            
            <div className="bg-background p-2 rounded border">
              <div className="text-xs text-muted-foreground uppercase">Confidence</div>
              <div className={cn("text-lg font-semibold", getScoreColorClass(feedback.confidenceLevel))}>
                {feedback.confidenceLevel}/10
              </div>
            </div>
            
            {feedback.responseTime !== undefined && (
              <div className="bg-background p-2 rounded border">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <div className="text-xs text-muted-foreground uppercase">Response Time</div>
                </div>
                <div className="text-sm font-semibold">
                  {formatResponseTime(feedback.responseTime)}
                </div>
                {feedback.responseTimeScore && (
                  <div className={cn("text-xs font-medium mt-0.5", getScoreColorClass(feedback.responseTimeScore))}>
                    Score: {feedback.responseTimeScore}/10
                  </div>
                )}
              </div>
            )}
            
            <div className="bg-background p-2 rounded border col-span-1 sm:col-span-2">
              <div className="flex items-center gap-2">
                <VolumeX className="h-4 w-4 text-muted-foreground" />
                <div className="text-xs text-muted-foreground uppercase">
                  Filler Words: {feedback.fillerWordsCount}
                </div>
              </div>
              <div className="text-sm mt-1">
                {feedback.fillerWords.length > 0 
                  ? feedback.fillerWords.join(", ") 
                  : "No filler words detected"}
              </div>
            </div>
          </div>
          
          {/* Suggestions */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              {feedback.overallScore >= 7 
                ? <ThumbsUp className="h-4 w-4 text-green-500" />
                : <AlertTriangle className="h-4 w-4 text-amber-500" />
              }
              <span className="font-medium">Improvement Suggestions:</span>
            </div>
            <ul className="text-sm space-y-1 list-disc pl-5">
              {feedback.suggestions.map((suggestion, idx) => (
                <li key={idx}>{suggestion}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnswerFeedbackCard;
