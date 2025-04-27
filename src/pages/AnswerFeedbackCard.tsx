// src/components/AnswerFeedbackCard.tsx

import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnswerFeedback } from "@/lib/gemini.sdk"; // Assuming type is here
import { cn } from "@/lib/utils";
import { MessageSquare, ThumbsUp, AlertTriangle, VolumeX, Clock, HelpCircle, Star, BarChartHorizontal } from 'lucide-react'; // Added icons

interface AnswerFeedbackCardProps {
  question: string;
  answer: string; // Can now receive fallback text like "[No answer recorded]"
  feedback: AnswerFeedback; // Can receive placeholder/error feedback
  questionNumber: number;
}

const AnswerFeedbackCard: React.FC<AnswerFeedbackCardProps> = ({
  question,
  answer,
  feedback,
  questionNumber
}) => {
  // Helper to get color class based on score (0-10 range)
  const getScoreColorClass = (score: number | undefined): string => {
    if (score === undefined) return "text-muted-foreground";
    if (score >= 8) return "text-green-600 dark:text-green-400";
    if (score >= 5) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

   // Helper to get badge variant based on score
    const getScoreBadgeVariant = (score: number | undefined): "default" | "secondary" | "destructive" | "outline" => {
        if (score === undefined) return "outline";
        if (score >= 8) return "default"; // Using Shadcn default (often blue/primary) for good scores
        if (score >= 5) return "secondary";
        return "destructive";
    };

  // Format response time
  const formatResponseTime = (seconds?: number): string => {
    if (seconds === undefined || seconds < 0) return "N/A";
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds.toFixed(0)}s`;
  };

   // Check if feedback indicates an error or skipped state (based on score 0 and specific suggestion text)
   const isPlaceholderFeedback = feedback.overallScore === 0 && feedback.suggestions.some(s => s.includes("No answer") || s.includes("error occurred"));

  return (
    <Card className={cn("w-full mb-4 shadow-sm border", isPlaceholderFeedback && "opacity-70 border-dashed")}>
      <CardHeader className="pb-3 pt-4 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <CardTitle className="text-base md:text-lg font-medium leading-tight">
            Q{questionNumber}: {question}
          </CardTitle>
           {/* Show score only if not placeholder */}
           {!isPlaceholderFeedback && (
                <Badge variant={getScoreBadgeVariant(feedback.overallScore)} className="px-2.5 py-1 text-sm flex-shrink-0">
                    Score: {feedback.overallScore}/10
                </Badge>
           )}
            {isPlaceholderFeedback && (
                 <Badge variant="outline" className="px-2.5 py-1 text-xs flex-shrink-0">
                      Skipped / Error
                 </Badge>
            )}
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4">
        <div className="space-y-4">
          {/* User's Answer */}
           <div className="bg-muted/50 p-3 rounded-md border">
             <div className="flex items-center gap-2 mb-1">
               <MessageSquare className="h-4 w-4 text-muted-foreground flex-shrink-0" />
               <span className="text-sm font-medium">Your Answer:</span>
             </div>
             <p className={cn("text-sm", answer.includes("[No answer recorded]") && "italic text-muted-foreground")}>{answer}</p>
           </div>

          {/* Metrics (Only show if not placeholder) */}
           {!isPlaceholderFeedback && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {/* Clarity */}
                <div className="bg-background p-2 rounded border flex flex-col items-center text-center">
                     <div className="text-muted-foreground uppercase mb-0.5">Clarity</div>
                     <div className={cn("text-lg font-semibold", getScoreColorClass(feedback.clarity))}>
                        {feedback.clarity ?? '?'}/10
                     </div>
                </div>
                 {/* Relevance */}
                <div className="bg-background p-2 rounded border flex flex-col items-center text-center">
                    <div className="text-muted-foreground uppercase mb-0.5">Relevance</div>
                    <div className={cn("text-lg font-semibold", getScoreColorClass(feedback.relevance))}>
                        {feedback.relevance ?? '?'}/10
                    </div>
                </div>
                 {/* Completeness */}
                <div className="bg-background p-2 rounded border flex flex-col items-center text-center">
                     <div className="text-muted-foreground uppercase mb-0.5">Completeness</div>
                     <div className={cn("text-lg font-semibold", getScoreColorClass(feedback.completeness))}>
                        {feedback.completeness ?? '?'}/10
                     </div>
                </div>
                 {/* Confidence */}
                <div className="bg-background p-2 rounded border flex flex-col items-center text-center">
                    <div className="text-muted-foreground uppercase mb-0.5">Confidence</div>
                     <div className={cn("text-lg font-semibold", getScoreColorClass(feedback.confidenceLevel))}>
                         {feedback.confidenceLevel ?? '?'}/10
                     </div>
                </div>
                {/* Response Time */}
                <div className="bg-background p-2 rounded border flex flex-col items-center text-center">
                     <div className="text-muted-foreground uppercase mb-0.5 flex items-center gap-1"><Clock className="w-3 h-3"/>Time</div>
                     <div className="text-base font-semibold">
                         {formatResponseTime(feedback.responseTime)}
                     </div>
                      {feedback.responseTimeScore !== undefined && (
                          <div className={cn("text-xs font-medium mt-0.5", getScoreColorClass(feedback.responseTimeScore))}>
                              (Score: {feedback.responseTimeScore}/10)
                          </div>
                     )}
                </div>
                 {/* Filler Words */}
                <div className="bg-background p-2 rounded border flex flex-col items-center text-center">
                     <div className="text-muted-foreground uppercase mb-0.5 flex items-center gap-1"><VolumeX className="w-3 h-3"/>Fillers</div>
                      <div className="text-lg font-semibold">
                          {feedback.fillerWordsCount ?? 0}
                      </div>
                      {feedback.fillerWords && feedback.fillerWords.length > 0 && (
                           <div className="text-xs text-muted-foreground mt-0.5 truncate w-full px-1">
                                ({feedback.fillerWords.slice(0, 3).join(", ")}{feedback.fillerWords.length > 3 ? '...' : ''})
                           </div>
                      )}
                 </div>
            </div>
           )}

          {/* Suggestions */}
           {feedback.suggestions && feedback.suggestions.length > 0 && (
            <div>
                 <div className="flex items-center gap-2 mb-2 mt-3">
                     {isPlaceholderFeedback
                         ? <HelpCircle className="h-4 w-4 text-muted-foreground" />
                         : feedback.overallScore >= 7
                         ? <ThumbsUp className="h-4 w-4 text-green-500" />
                         : <AlertTriangle className="h-4 w-4 text-amber-500" />
                     }
                     <span className="text-sm font-medium">Suggestions:</span>
                 </div>
                 <ul className="text-sm space-y-1 list-disc pl-5 text-muted-foreground">
                     {feedback.suggestions.map((suggestion, idx) => (
                         <li key={idx}>{suggestion}</li>
                     ))}
                 </ul>
             </div>
           )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnswerFeedbackCard;