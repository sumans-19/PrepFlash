
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { CheckIcon, XIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateMultipleChoiceQuestions, GeminiQuestion } from '@/services/GeminiService2';

const GenerativeMultipleChoice: React.FC = () => {
  const [difficulty, setDifficulty] = useState<string>("medium");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [questions, setQuestions] = useState<GeminiQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [topic, setTopic] = useState<string>("web development");

  const { toast } = useToast();

  const generateQuestions = async () => {
    setIsLoading(true);
    try {
      const generatedQuestions = await generateMultipleChoiceQuestions(topic, difficulty, 10);
      
      setQuestions(generatedQuestions);
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setAnsweredQuestions([]);
      setAnswers(Array(generatedQuestions.length).fill(undefined));
      setScore(0);
      setShowResult(false);
      
    } catch (error) {
      console.error('Error generating questions:', error);
      toast({
        variant: "destructive",
        title: "Error generating questions",
        description: "Please try again or check your API key.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || questions.length === 0) return;
    
    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
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
        description: `The correct answer is: ${questions[currentQuestion].correctAnswer}`,
      });
    }

    if (!answeredQuestions.includes(currentQuestion)) {
      setAnsweredQuestions([...answeredQuestions, currentQuestion]);
    }
    
    setSelectedAnswer(null);
  };

  const navigate = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (direction === 'prev' && currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
    setSelectedAnswer(null);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers(Array(questions.length).fill(undefined));
    setAnsweredQuestions([]);
  };

  return (
    <div className="space-y-6">
      {questions.length === 0 || showResult ? (
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle>Generate AI Quiz Questions</CardTitle>
            <CardDescription>
              Choose a topic and difficulty level to generate custom quiz questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {showResult ? (
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
                <div className="text-4xl font-bold mb-6 text-primary">
                  Score: {score}/{questions.length}
                </div>
                
                <div className="space-y-4 mb-8 text-left">
                  {questions.map((q, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="mt-1">
                        {answers[index] ? (
                          <CheckIcon className="h-5 w-5 text-green-500" />
                        ) : (
                          <XIcon className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{q.question}</p>
                        <p className="text-sm text-muted-foreground">
                          Correct answer: <span className="text-primary font-medium">{q.correctAnswer}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-4 justify-center">
                  <Button onClick={restartQuiz} variant="outline">
                    Restart Quiz
                  </Button>
                  <Button onClick={() => setShowResult(false)} className="bg-gradient-primary">
                    Generate New Quiz
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="topic">Topic</Label>
                    <input
                      id="topic"
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="Enter a topic (e.g., JavaScript, React, HTML)"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select value={difficulty} onValueChange={setDifficulty}>
                      <SelectTrigger id="difficulty" className="w-full">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button 
  onClick={generateQuestions} 
  className="w-full bg-purple-300 text-purple-900 hover:bg-purple-400 disabled:opacity-50 disabled:cursor-not-allowed" 
  disabled={isLoading}
>
  {isLoading ? "Generating Questions..." : "Generate Quiz Questions"}
</Button>

              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="glassmorphism">
          <CardContent className="p-6">
            <div className="mb-6">
              <Progress value={((answeredQuestions.length) / questions.length) * 100} className="mb-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>Score: {score}/{answeredQuestions.length}</span>
                <span className="capitalize">{difficulty} Difficulty</span>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-6">{questions[currentQuestion].question}</h2>
            
            <RadioGroup value={selectedAnswer || ""} onValueChange={setSelectedAnswer} className="space-y-4">
              {questions[currentQuestion].options.map((option, index) => (
                <div 
                  key={index} 
                  className={`flex items-center space-x-2 p-4 rounded-lg border transition-colors
                    ${selectedAnswer === option ? 'border-primary bg-primary/10' : 'hover:bg-accent'}`}
                >
                  <RadioGroupItem value={option} id={`option-gen-${index}`} className="border-primary" />
                  <Label htmlFor={`option-gen-${index}`} className="flex-1 cursor-pointer">{option}</Label>
                </div>
              ))}
            </RadioGroup>
            
            <div className="flex justify-between items-center mt-6">
              <Button 
                onClick={() => navigate('prev')}
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
                {currentQuestion < questions.length - 1 ? (
                  <Button 
                    onClick={() => navigate('next')}
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
                {questions.map((_, index) => (
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
      )}
    </div>
  );
};

export default GenerativeMultipleChoice;