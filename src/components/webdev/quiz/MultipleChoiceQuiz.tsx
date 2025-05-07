
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { CheckIcon, XIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { multipleChoiceQuiz } from '@/data/web/multipleChoiceData';

const MultipleChoiceQuiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>(Array(multipleChoiceQuiz.length).fill(undefined));
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  
  const { toast } = useToast();
  
  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;
    
    const isCorrect = selectedAnswer === multipleChoiceQuiz[currentQuestion].correctAnswer;
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = isCorrect;
    setAnswers(newAnswers);
    
    if (isCorrect) {
      setScore(score + 1);
      toast({
        title: "Correct!",
        description: "Great job! That's the right answer.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Incorrect",
        description: `The correct answer is: ${multipleChoiceQuiz[currentQuestion].correctAnswer}`,
      });
    }

    if (!answeredQuestions.includes(currentQuestion)) {
      setAnsweredQuestions([...answeredQuestions, currentQuestion]);
    }
  };
  
  const navigateMultipleChoice = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentQuestion < multipleChoiceQuiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (direction === 'prev' && currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
    setSelectedAnswer(null);
  };
  
  const restartMultipleChoiceQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers(Array(multipleChoiceQuiz.length).fill(undefined));
    setAnsweredQuestions([]);
  };

  return (
    <>
      {!showResult ? (
        <Card className="glassmorphism">
          <CardContent className="p-6">
            <div className="mb-6">
              <Progress value={((answeredQuestions.length) / multipleChoiceQuiz.length) * 100} className="mb-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Question {currentQuestion + 1} of {multipleChoiceQuiz.length}</span>
                <span>Score: {score}/{answeredQuestions.length}</span>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-6">{multipleChoiceQuiz[currentQuestion].question}</h2>
            
            <RadioGroup value={selectedAnswer || ""} onValueChange={setSelectedAnswer} className="space-y-4">
              {multipleChoiceQuiz[currentQuestion].options.map((option, index) => (
                <div 
                  key={index} 
                  className={`flex items-center space-x-2 p-4 rounded-lg border transition-colors
                    ${selectedAnswer === option ? 'border-primary bg-primary/10' : 'hover:bg-accent'}`}
                >
                  <RadioGroupItem value={option} id={`option-${index}`} className="border-primary" />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">{option}</Label>
                </div>
              ))}
            </RadioGroup>
            
            <div className="flex justify-between items-center mt-6">
              <Button 
                onClick={() => navigateMultipleChoice('prev')}
                variant="outline"
                disabled={currentQuestion === 0}
                className="px-6"
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              
              <Button 
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer}
                className="bg-gradient-primary px-8"
              >
                Submit Answer
              </Button>
              
              <div className="flex gap-2">
                {currentQuestion < multipleChoiceQuiz.length - 1 ? (
                  <Button 
                    onClick={() => navigateMultipleChoice('next')}
                    variant="outline"
                    className="px-6"
                  >
                    Next <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    onClick={() => setShowResult(true)}
                    variant="outline"
                    className="px-6"
                    disabled={answeredQuestions.length === 0}
                  >
                    See Results
                  </Button>
                )}
              </div>
            </div>
            
            {/* Question Navigation */}
            <div className="mt-6">
              <div className="flex flex-wrap gap-2 justify-center">
                {multipleChoiceQuiz.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                      ${currentQuestion === index ? 'bg-primary text-white' : 
                        answers[index] !== undefined ? 
                          answers[index] ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                          : 'bg-secondary hover:bg-secondary/80'
                      }
                    `}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="glassmorphism animate-scale-in">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
            <div className="text-4xl font-bold mb-6 text-primary">
              Score: {score}/{answeredQuestions.length}
            </div>
            
            <div className="space-y-4 mb-8 text-left">
              {answeredQuestions.map((questionIndex) => (
                <div key={questionIndex} className="flex items-start space-x-2">
                  <div className="mt-1">
                    {answers[questionIndex] ? (
                      <CheckIcon className="h-5 w-5 text-green-500" />
                    ) : (
                      <XIcon className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{multipleChoiceQuiz[questionIndex].question}</p>
                    <p className="text-sm text-muted-foreground">
                      Correct answer: <span className="text-primary font-medium">{multipleChoiceQuiz[questionIndex].correctAnswer}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <Button onClick={restartMultipleChoiceQuiz} className="bg-gradient-primary">
              Restart Quiz
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default MultipleChoiceQuiz;
