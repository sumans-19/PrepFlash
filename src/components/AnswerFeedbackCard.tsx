
import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion";
import { BarChart, MessageSquare, Mic, AlertCircle, Check } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { AnswerFeedback } from '@/lib/gemini.sdk';

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
  // Helper function to get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-500";
    if (score >= 6) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <Card className="mb-4 overflow-hidden shadow border border-border/40">
      <CardHeader className="bg-accent/30 pb-3 pt-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <Badge variant="outline" className="mr-2 bg-primary/20">
              Q{questionNumber}
            </Badge>
            <h3 className="font-medium">{question}</h3>
          </div>
          <Badge className={getScoreColor(feedback.overallScore)}>
            {feedback.overallScore}/10
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-3">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="answer">
            <AccordionTrigger className="text-sm">
              <div className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                Your Answer
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {answer}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="feedback">
            <AccordionTrigger className="text-sm">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Detailed Feedback
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Relevance</span>
                    <div className="flex items-center">
                      <span className={`text-sm font-medium ${getScoreColor(feedback.relevance)}`}>{feedback.relevance}/10</span>
                      <div className="ml-2 bg-muted rounded-full h-1.5 w-full">
                        <div
                          className={`h-1.5 rounded-full ${
                            feedback.relevance >= 8 ? "bg-green-500" :
                            feedback.relevance >= 6 ? "bg-amber-500" : "bg-red-500"
                          }`}
                          style={{ width: `${feedback.relevance * 10}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Clarity</span>
                    <div className="flex items-center">
                      <span className={`text-sm font-medium ${getScoreColor(feedback.clarity)}`}>{feedback.clarity}/10</span>
                      <div className="ml-2 bg-muted rounded-full h-1.5 w-full">
                        <div
                          className={`h-1.5 rounded-full ${
                            feedback.clarity >= 8 ? "bg-green-500" :
                            feedback.clarity >= 6 ? "bg-amber-500" : "bg-red-500"
                          }`}
                          style={{ width: `${feedback.clarity * 10}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Technical Depth</span>
                    <div className="flex items-center">
                      <span className={`text-sm font-medium ${getScoreColor(feedback.depth)}`}>{feedback.depth}/10</span>
                      <div className="ml-2 bg-muted rounded-full h-1.5 w-full">
                        <div
                          className={`h-1.5 rounded-full ${
                            feedback.depth >= 8 ? "bg-green-500" :
                            feedback.depth >= 6 ? "bg-amber-500" : "bg-red-500"
                          }`}
                          style={{ width: `${feedback.depth * 10}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Conciseness</span>
                    <div className="flex items-center">
                      <span className={`text-sm font-medium ${getScoreColor(feedback.conciseness)}`}>{feedback.conciseness}/10</span>
                      <div className="ml-2 bg-muted rounded-full h-1.5 w-full">
                        <div
                          className={`h-1.5 rounded-full ${
                            feedback.conciseness >= 8 ? "bg-green-500" :
                            feedback.conciseness >= 6 ? "bg-amber-500" : "bg-red-500"
                          }`}
                          style={{ width: `${feedback.conciseness * 10}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Confidence</span>
                    <div className="flex items-center">
                      <span className={`text-sm font-medium ${getScoreColor(feedback.confidence)}`}>{feedback.confidence}/10</span>
                      <div className="ml-2 bg-muted rounded-full h-1.5 w-full">
                        <div
                          className={`h-1.5 rounded-full ${
                            feedback.confidence >= 8 ? "bg-green-500" :
                            feedback.confidence >= 6 ? "bg-amber-500" : "bg-red-500"
                          }`}
                          style={{ width: `${feedback.confidence * 10}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Technical Accuracy</span>
                    <div className="flex items-center">
                      <span className={`text-sm font-medium ${getScoreColor(feedback.technicalAccuracy)}`}>{feedback.technicalAccuracy}/10</span>
                      <div className="ml-2 bg-muted rounded-full h-1.5 w-full">
                        <div
                          className={`h-1.5 rounded-full ${
                            feedback.technicalAccuracy >= 8 ? "bg-green-500" :
                            feedback.technicalAccuracy >= 6 ? "bg-amber-500" : "bg-red-500"
                          }`}
                          style={{ width: `${feedback.technicalAccuracy * 10}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Strengths</span>
                  </div>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground">
                    {feedback.strengths.map((strength, idx) => (
                      <li key={idx}>{strength}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-medium">Areas for Improvement</span>
                  </div>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground">
                    {feedback.weaknesses.map((weakness, idx) => (
                      <li key={idx}>{weakness}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="pb-2">
                  <div className="flex items-center gap-1 mb-1">
                    <BarChart className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Summary</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{feedback.summary}</p>
                  {feedback.fillerWordCount > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      <span className="font-medium">Filler words used:</span> {feedback.fillerWordCount}
                    </p>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default AnswerFeedbackCard;
