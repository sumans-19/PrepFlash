import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckIcon, XIcon, Lightbulb, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FlashCardProps {
  question: string;
  answer: string;
  explanation: string;
}

const FlashCard: React.FC<FlashCardProps> = ({ question, answer, explanation }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserAnswer(e.target.value);
    setIsCorrect(null);
  }, []);

  const handleCheck = useCallback(() => {
    if (!userAnswer.trim()) return;

    const answerKeywords = answer.toLowerCase().split(/\s+/).filter(Boolean);
    const userAnswerLower = userAnswer.toLowerCase();
    const matches = answerKeywords.filter((keyword) => userAnswerLower.includes(keyword));
    const correctnessThreshold = 0.7;
    const isAnswerCorrect =
      answerKeywords.length > 0 &&
      matches.length / answerKeywords.length >= correctnessThreshold;

    setIsCorrect(isAnswerCorrect);
    setIsFlipped(true);
  }, [answer, userAnswer]);

  const handleReset = useCallback(() => {
    setIsFlipped(false);
    setUserAnswer('');
    setIsCorrect(null);
  }, []);

  const feedbackMessage = useMemo(() => {
    if (isCorrect === true) return "That's right!";
    if (isCorrect === false) return 'Not quite.';
    return null;
  }, [isCorrect]);

  return (
    <div className="w-full flex justify-center items-center p-4">
      <div className="relative w-full max-w-2xl h-[500px] perspective-1000">
        <div
          className={cn(
            'absolute inset-0 w-full h-full transition-transform duration-700 transform-style preserve-3d',
            isFlipped ? 'rotate-y-180' : ''
          )}
        >
          {/* Front */}
          <Card
            className={cn(
              'absolute w-full h-full backface-hidden bg-white shadow-md rounded-xl'
            )}
          >
            <CardContent className="p-6 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center mb-4">
                  <BookOpen className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm font-medium text-muted-foreground">Question</span>
                </div>
                <h3 className="text-xl text-primary font-bold text-center mb-6">{question}</h3>
                <textarea
                  value={userAnswer}
                  onChange={handleInputChange}
                  placeholder="Type your answer here..."
                  className="w-full h-32 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={handleFlip} className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Show Answer
                </Button>
                <Button onClick={handleCheck} disabled={!userAnswer.trim()} className="bg-purple-300 text-black">
                  Check Answer
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Back */}
          <Card
            className={cn(
              'absolute w-full h-full backface-hidden rotate-y-180 bg-white shadow-md rounded-xl'
            )}
          >
            <CardContent className="p-6 flex flex-col justify-between h-full">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-primary mr-2" />
                    <span className="text-sm font-medium text-muted-foreground">Answer</span>
                  </div>
                  {isCorrect !== null && (
                    <div className={`flex items-center ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                      {isCorrect ? <CheckIcon className="h-5 w-5 mr-1" /> : <XIcon className="h-5 w-5 mr-1" />}
                      <span className="text-sm font-medium">{feedbackMessage}</span>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-lg">Your Answer:</h4>
                  <p className="p-3 bg-accent/50 rounded-lg mt-1">{userAnswer || 'No answer provided'}</p>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-lg">Correct Answer:</h4>
                  <p className="p-3 bg-primary/10 rounded-lg mt-1 font-medium">{answer}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-lg">Explanation:</h4>
                  <p className="p-3 bg-accent/30 rounded-lg mt-1">{explanation}</p>
                </div>
              </div>

              <Button onClick={handleReset} variant="outline" className="w-full mt-4">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FlashCard;
