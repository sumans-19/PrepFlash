
import React, { useState } from 'react';
import { AptitudeQuestion } from '@/types/aptitude';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bookmark, Clock, CheckCircle2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestionCardProps {
  question: AptitudeQuestion;
  onToggleBookmark: (questionId: string) => void;
  onMarkAttempted: (questionId: string) => void;
}

const QuestionCard = ({ question, onToggleBookmark, onMarkAttempted }: QuestionCardProps) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    onMarkAttempted(question.id);
  };

  const handleToggleBookmark = () => {
    onToggleBookmark(question.id);
  };

  const handleShowAnswer = () => {
    setShowAnswer(!showAnswer);
    if (!showAnswer) onMarkAttempted(question.id);
  };

  const isCorrect = selectedOption === question.correctAnswer;

  return (
    <Card className="w-full h-full flex flex-col overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="space-y-2">
        <div className="flex justify-between items-start">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{question.topic.charAt(0).toUpperCase() + question.topic.slice(1)}</Badge>
            <Badge variant={question.difficulty === 'Easy' ? 'secondary' : question.difficulty === 'Medium' ? 'default' : 'destructive'}>
              {question.difficulty}
            </Badge>
            <Badge variant="outline">{question.format}</Badge>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(question.isBookmarked ? "text-yellow-500" : "text-muted-foreground")}
            onClick={handleToggleBookmark}
          >
            <Bookmark className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-1" />
          <span>{Math.floor(question.timeRequired / 60)}:{(question.timeRequired % 60).toString().padStart(2, '0')}</span>
          <span className="mx-2">•</span>
          {question.company.map((company, i) => (
            <React.Fragment key={company}>
              {i > 0 && ", "}
              <span>{company}</span>
            </React.Fragment>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="mb-4 font-medium">{question.question}</p>

        {question.format === 'MCQ' && question.options && (
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <button 
                key={index}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md border transition-colors",
                  selectedOption === option ? (
                    isCorrect ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700" : 
                    "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700"
                  ) : "hover:bg-accent",
                  showAnswer && option === question.correctAnswer && "ring-2 ring-green-500 dark:ring-green-400"
                )}
                onClick={() => handleOptionSelect(option)}
                disabled={showAnswer || selectedOption !== null}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {selectedOption === option && (
                    isCorrect ? 
                      <CheckCircle2 className="h-5 w-5 text-green-500" /> : 
                      <X className="h-5 w-5 text-red-500" />
                  )}
                  {showAnswer && option === question.correctAnswer && selectedOption !== option && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {question.format !== 'MCQ' && (
          <div className="mt-4 space-y-4">
            {showAnswer ? (
              <div className="space-y-3">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
                  <p className="text-sm font-medium mb-1">Answer:</p>
                  <p>{question.correctAnswer}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md">
                  <p className="text-sm font-medium mb-1">Explanation:</p>
                  <p className="text-sm">{question.explanation}</p>
                </div>
              </div>
            ) : (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleShowAnswer}
              >
                Reveal Answer
              </Button>
            )}
          </div>
        )}

        {question.format === 'MCQ' && (selectedOption || showAnswer) && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md animate-fade-in">
            <p className="text-sm font-medium mb-1">Explanation:</p>
            <p className="text-sm">{question.explanation}</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-4 flex justify-between">
        <div className="text-xs text-muted-foreground">
          For: {question.targetRole.join(", ")}
        </div>
        {!selectedOption && question.format === 'MCQ' && !showAnswer && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleShowAnswer}
          >
            Show Answer
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default QuestionCard;
