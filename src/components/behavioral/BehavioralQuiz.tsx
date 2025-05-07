
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { BarChart3, Brain, Check, ChevronRight } from 'lucide-react';

// Sample quizzes
const quizzes = [
  {
    id: 'communication-style',
    title: 'Communication Style Assessment',
    description: 'Discover your natural communication tendencies in professional settings',
    questions: 12,
    timeEstimate: '5-8 min',
    category: 'Communication',
    completed: true,
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 'leadership-tendency',
    title: 'Leadership Tendencies',
    description: 'Identify your leadership style and how it impacts your team dynamics',
    questions: 15,
    timeEstimate: '7-10 min',
    category: 'Leadership',
    completed: false,
    image: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 'conflict-resolution',
    title: 'Conflict Resolution Profile',
    description: 'Understand how you naturally respond to workplace disagreements',
    questions: 10,
    timeEstimate: '4-6 min',
    category: 'Conflict Resolution',
    completed: false,
    image: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 'stress-response',
    title: 'Stress Response Pattern',
    description: 'Learn how you react under pressure and high-stakes situations',
    questions: 14,
    timeEstimate: '6-9 min',
    category: 'Resilience',
    completed: false,
    image: 'https://images.unsplash.com/photo-1594819047050-99defca82545?q=80&w=500&auto=format&fit=crop'
  },
];

// Sample quiz questions for Communication Style Assessment
const sampleQuizQuestions = [
  {
    id: 1,
    text: "When sharing ideas in a meeting, I typically:",
    options: [
      "Wait until asked for my opinion",
      "Share concise points only when I feel strongly",
      "Speak up often and elaborate on my thinking",
      "Focus on asking questions of others"
    ]
  },
  {
    id: 2,
    text: "When receiving critical feedback, I prefer it to be delivered:",
    options: [
      "In writing so I can process privately",
      "In a straightforward, direct manner",
      "With specific examples and suggestions",
      "In a conversation that explores context"
    ]
  },
  {
    id: 3,
    text: "When explaining complex topics to colleagues, I tend to:",
    options: [
      "Use precise technical language",
      "Use metaphors and analogies",
      "Break it down into step-by-step explanations",
      "Draw diagrams or use visual aids"
    ]
  },
  {
    id: 4,
    text: "In team disagreements, I most often:",
    options: [
      "Listen more than I speak",
      "Advocate strongly for my viewpoint",
      "Look for compromise between perspectives",
      "Try to reframe the conversation entirely"
    ]
  },
  {
    id: 5,
    text: "When planning projects with others, I focus most on:",
    options: [
      "Detailed specifications and requirements",
      "Overall vision and goals",
      "Team roles and responsibilities",
      "Potential challenges and contingencies"
    ]
  }
];

// Mock quiz results
const quizResults = {
  primaryStyle: "Analytical Communicator",
  secondaryStyle: "Strategic Collaborator",
  description: "You tend to approach communication methodically, focusing on accuracy and logical clarity. You excel at data-driven discussions and prefer structured interactions. While you value precision, you also have a secondary tendency to facilitate collaboration by helping connect people's ideas.",
  strengths: [
    "Delivering precise, factual information",
    "Breaking down complex topics",
    "Detecting logical inconsistencies",
    "Asking clarifying questions"
  ],
  improvements: [
    "May need to add more emotional context",
    "Could benefit from more concise messaging",
    "Might occasionally overexplain"
  ],
  interviewTips: [
    "Leverage your analytical strength by using data points in behavioral examples",
    "Balance logic with impact by highlighting how your approach affected others",
    "Prepare concise versions of your accomplishment stories",
    "Demonstrate adaptability by sharing examples of adjusting your style"
  ]
};

const BehavioralQuiz = () => {
  const [activeQuiz, setActiveQuiz] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [showResults, setShowResults] = useState(false);
  
  const handleStartQuiz = (quizId: string) => {
    setActiveQuiz(quizId);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };
  
  const handleAnswer = (questionId: number, answerIndex: number) => {
    setAnswers({ ...answers, [questionId]: answerIndex });
  };
  
  const handleNextQuestion = () => {
    if (currentQuestion < sampleQuizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };
  
  const handleExitQuiz = () => {
    setActiveQuiz(null);
  };
  
  if (activeQuiz) {
    const currentQuizData = quizzes.find(q => q.id === activeQuiz);
    const currentQuestionData = sampleQuizQuestions[currentQuestion];
    
    return (
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">{currentQuizData?.title}</h2>
            <p className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {sampleQuizQuestions.length}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleExitQuiz}>
            Exit Quiz
          </Button>
        </div>
        
        <div className="mb-6">
          <Progress 
            value={((currentQuestion + 1) / sampleQuizQuestions.length) * 100} 
            className="h-2" 
          />
        </div>
        
        {showResults ? (
          <Card className="p-6 bg-gradient-to-br from-interview-blue/5 to-interview-purple/5">
            <div className="flex justify-between items-start mb-6">
              <div>
                <Badge className="mb-2 bg-interview-blue text-white">Your Communication Style</Badge>
                <h3 className="text-2xl font-semibold">{quizResults.primaryStyle}</h3>
                <p className="text-sm text-muted-foreground">with elements of {quizResults.secondaryStyle}</p>
              </div>
              <BarChart3 className="h-12 w-12 text-interview-blue opacity-50" />
            </div>
            
            <p className="mb-6 text-muted-foreground">{quizResults.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg border p-4">
                <h4 className="font-medium mb-3 flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  Communication Strengths
                </h4>
                <ul className="space-y-2">
                  {quizResults.strengths.map((strength, index) => (
                    <li key={index} className="text-sm flex items-start">
                      <span className="bg-green-100 text-green-800 h-5 w-5 rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">
                        {index + 1}
                      </span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white rounded-lg border p-4">
                <h4 className="font-medium mb-3 flex items-center">
                  <Brain className="h-4 w-4 text-amber-600 mr-2" />
                  Areas for Development
                </h4>
                <ul className="space-y-2">
                  {quizResults.improvements.map((item, index) => (
                    <li key={index} className="text-sm flex items-start">
                      <span className="bg-amber-100 text-amber-800 h-5 w-5 rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">
                        {index + 1}
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="bg-interview-blue/10 rounded-lg p-4 mb-6">
              <h4 className="font-medium mb-3">Interview Application Tips</h4>
              <ul className="space-y-2">
                {quizResults.interviewTips.map((tip, index) => (
                  <li key={index} className="text-sm flex items-start">
                    <span className="text-interview-blue mr-2">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={handleExitQuiz} className="bg-interview-blue hover:bg-interview-indigo">
                Complete Quiz
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="p-6">
            <h3 className="text-xl font-medium mb-6">{currentQuestionData.text}</h3>
            
            <RadioGroup 
              value={answers[currentQuestionData.id]?.toString() || ''}
              onValueChange={(value) => handleAnswer(currentQuestionData.id, parseInt(value))}
              className="space-y-3"
            >
              {currentQuestionData.options.map((option, index) => (
                <div 
                  key={index}
                  className={`flex items-center space-x-2 border rounded-md p-4 transition-colors ${
                    answers[currentQuestionData.id] === index 
                      ? 'border-interview-blue bg-interview-blue/5' 
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            
            <div className="flex justify-end mt-6">
              <Button 
                onClick={handleNextQuestion}
                disabled={answers[currentQuestionData.id] === undefined}
                className="bg-interview-blue hover:bg-interview-indigo"
              >
                {currentQuestion < sampleQuizQuestions.length - 1 ? (
                  <>Next Question <ChevronRight className="ml-1 h-4 w-4" /></>
                ) : (
                  "See Results"
                )}
              </Button>
            </div>
          </Card>
        )}
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Behavioral Quizzes</h2>
        <p className="text-sm text-muted-foreground">
          Discover your behavioral tendencies and interview strengths
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quizzes.map((quiz) => (
          <Card key={quiz.id} className="overflow-hidden border hover:shadow-md transition-shadow">
            <div className="h-40 relative overflow-hidden">
              <img 
                src={quiz.image} 
                alt={quiz.title} 
                className="w-full h-full object-cover"
              />
              {quiz.completed && (
                <div className="absolute top-3 right-3">
                  <Badge className="bg-green-500 text-white border-none">
                    <Check className="h-3.5 w-3.5 mr-1" /> Completed
                  </Badge>
                </div>
              )}
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold">{quiz.title}</h3>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  {quiz.category}
                </Badge>
              </div>
              
              <p className="text-muted-foreground text-sm mb-4">{quiz.description}</p>
              
              <div className="flex justify-between text-xs text-muted-foreground mb-4">
                <span>{quiz.questions} questions</span>
                <span>{quiz.timeEstimate}</span>
              </div>
              
              <Button 
                onClick={() => handleStartQuiz(quiz.id)}
                className="w-full"
                variant={quiz.completed ? "outline" : "default"}
              >
                {quiz.completed ? "Retake Quiz" : "Start Quiz"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BehavioralQuiz;
