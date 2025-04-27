import React, { useState, useEffect, useRef } from 'react';
import { DashboardNav } from '@/components/DashboardNav';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Send, MessageSquare, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useGemini } from '@/hooks/useGemini';
import { useFirestore } from '@/hooks/useFirestore';
import { useUser } from '@/contexts/UserContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  feedback?: string;
}

interface Session {
  id: string;
  jobRole: string;
  techStack: string;
  difficultyLevel: string;
  questionsCount: number;
  messages: Message[];
  currentQuestionIndex: number;
  feedback: string[];
  overallFeedback?: string;
  createdAt: number;
  status: 'setup' | 'in-progress' | 'completed';
  firestoreId?: string;
}

const difficultyOptions = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' }
];

const ChatPractice = () => {
  const { user } = useUser();
  const { generateChatResponse, isGenerating } = useGemini();
  const { saveInterviewSession, updateInterviewSession, getInterviewSessions } = useFirestore();
  
  const [jobRole, setJobRole] = useState('');
  const [techStack, setTechStack] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('intermediate');
  const [questionsCount, setQuestionsCount] = useState(5);
  
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [userInput, setUserInput] = useState('');
  const [pastSessions, setPastSessions] = useState<Session[]>([]);
  const [isFeedbackView, setIsFeedbackView] = useState(false);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      const loadSessions = async () => {
        const sessions = await getInterviewSessions(user.uid);
        setPastSessions(sessions as Session[]);
      };
      loadSessions();
    }
  }, [user, getInterviewSessions]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentSession?.messages]);

  const startInterview = async () => {
    if (!jobRole.trim() || !techStack.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newSession: Session = {
      id: Date.now().toString(),
      jobRole,
      techStack,
      difficultyLevel,
      questionsCount,
      messages: [],
      currentQuestionIndex: 0,
      feedback: [],
      createdAt: Date.now(),
      status: 'in-progress'
    };

    setCurrentSession(newSession);
    
    if (user) {
      await saveInterviewSession(user.uid, newSession);
    }

    generateQuestion(newSession);
  };

  const generateQuestion = async (session: Session) => {
    const { jobRole, techStack, difficultyLevel, currentQuestionIndex, questionsCount } = session;
    
    try {
      const prompt = `
        You are an AI interviewer conducting a technical interview for a ${jobRole} position.
        The candidate has experience with these technologies: ${techStack}.
        Please ask the candidate a single ${difficultyLevel} level technical question (question ${currentQuestionIndex + 1} of ${questionsCount}).
        Focus on practical coding and problem-solving scenarios they might face in this role.
        Only provide the question without any additional text like "Question:" or "Next question:".
      `;
      
      const response = await generateChatResponse(prompt);
      
      if (response) {
        const updatedSession = { 
          ...session, 
          messages: [
            ...session.messages, 
            { 
              role: 'assistant' as const, 
              content: response.trim(), 
              timestamp: Date.now() 
            }
          ]
        };
        
        setCurrentSession(updatedSession);
        
        if (user) {
          await updateInterviewSession(user.uid, updatedSession);
        }
      }
    } catch (error) {
      console.error('Failed to generate question:', error);
      toast.error('Failed to generate question. Please try again.');
    }
  };

  const handleSubmitResponse = async () => {
    if (!userInput.trim() || !currentSession) return;
    
    const userMessage: Message = { 
      role: 'user', 
      content: userInput, 
      timestamp: Date.now() 
    };
    
    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, userMessage]
    };
    
    setCurrentSession(updatedSession);
    setUserInput('');
    
    if (user) {
      await updateInterviewSession(user.uid, updatedSession);
    }
    
    await generateFeedbackForAnswer(updatedSession, userMessage);
  };

  const generateFeedbackForAnswer = async (session: Session, userMessage: Message) => {
    if (!session) return;
    
    try {
      const lastQuestion = session.messages[session.messages.length - 2]?.content;
      
      const feedbackPrompt = `
        You are an expert interviewer evaluating a candidate's response for a ${session.jobRole} position.
        
        The question was: "${lastQuestion}"
        
        The candidate's answer is: "${userMessage.content}"
        
        Please provide a detailed evaluation of the answer based on:
        1. Technical accuracy
        2. Depth of understanding
        3. Communication clarity
        4. Practical implementation knowledge
        
        Format your feedback in a constructive manner with clear strengths and areas for improvement.
        Keep your feedback under 100 words.
      `;
      
      const feedbackResponse = await generateChatResponse(feedbackPrompt);
      
      if (feedbackResponse) {
        const updatedMessages = session.messages.map((msg, index) => {
          if (index === session.messages.length - 1) {
            return { ...msg, feedback: feedbackResponse };
          }
          return msg;
        });
        
        const updatedFeedback = [...session.feedback, feedbackResponse];
        
        const updatedSession: Session = {
          ...session,
          messages: updatedMessages,
          feedback: updatedFeedback,
          currentQuestionIndex: session.currentQuestionIndex + 1
        };
        
        setCurrentSession(updatedSession);
        
        if (user) {
          await updateInterviewSession(user.uid, updatedSession);
        }
        
        if (updatedSession.currentQuestionIndex < updatedSession.questionsCount) {
          await generateQuestion(updatedSession);
        } else {
          await generateOverallFeedback(updatedSession);
        }
      }
    } catch (error) {
      console.error('Failed to generate feedback:', error);
      toast.error('Failed to generate feedback. Please try again.');
    }
  };

  const generateOverallFeedback = async (session: Session) => {
    setIsGeneratingFeedback(true);
    
    try {
      const questionsAndAnswers = session.messages
        .map((msg, index, arr) => {
          if (msg.role === 'assistant' && index < arr.length - 1 && arr[index + 1].role === 'user') {
            return `Question: ${msg.content}\nAnswer: ${arr[index + 1].content}`;
          }
          return null;
        })
        .filter(Boolean)
        .join('\n\n');
      
      const overallPrompt = `
        You are an experienced technical interviewer for a ${session.jobRole} position.
        
        You have just completed an interview with a candidate who has experience with: ${session.techStack}.
        
        Here are the questions and answers from the interview:
        
        ${questionsAndAnswers}
        
        Please provide an overall assessment of this candidate based on their responses. Include:
        1. Technical skills demonstrated
        2. Understanding of concepts
        3. Communication ability
        4. Areas of strength
        5. Areas for improvement
        6. Suggested resources for further development
        7. Overall hiring recommendation on a scale of 1-10
        
        Format your feedback in a clear, structured way that would be helpful for both the candidate and hiring managers.
        Keep your feedback under 200 words.
      `;
      
      const overallFeedbackResponse = await generateChatResponse(overallPrompt);
      
      if (overallFeedbackResponse) {
        const completedSession: Session = {
          ...session,
          overallFeedback: overallFeedbackResponse,
          status: 'completed'
        };
        
        setCurrentSession(completedSession);
        setIsFeedbackView(true);
        
        if (user) {
          await updateInterviewSession(user.uid, completedSession);
        }
      }
    } catch (error) {
      console.error('Failed to generate overall feedback:', error);
      toast.error('Failed to generate overall feedback. Please try again.');
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  const resetInterview = () => {
    setCurrentSession(null);
    setJobRole('');
    setTechStack('');
    setDifficultyLevel('intermediate');
    setQuestionsCount(5);
    setIsFeedbackView(false);
  };

  const toggleView = () => {
    setIsFeedbackView(!isFeedbackView);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <DashboardNav />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#9b87f5] to-[#7E69AB]">
            Chat Interview Practice
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Perfect your interview skills with our AI-powered chat interview simulator
          </p>
        </motion.div>

        {!currentSession ? (
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>Set Up Your Interview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="job-role">Job Role You're Applying For</Label>
                <Input 
                  id="job-role" 
                  placeholder="e.g. Frontend Developer, Data Scientist" 
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tech-stack">Primary Tech Stack / Skills</Label>
                <Input 
                  id="tech-stack" 
                  placeholder="e.g. React, TypeScript, Node.js" 
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select value={difficultyLevel} onValueChange={setDifficultyLevel}>
                  <SelectTrigger id="difficulty">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficultyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Number of Questions: {questionsCount}</Label>
                <Slider 
                  min={3} 
                  max={10} 
                  step={1} 
                  value={[questionsCount]} 
                  onValueChange={(value) => setQuestionsCount(value[0])}
                  className="mt-2"
                />
              </div>
              
              <Button 
                className="w-full font-medium mt-6"
                style={{
                  background: `linear-gradient(135deg, #9b87f5 0%, #7E69AB 100%)`,
                }}
                onClick={startInterview}
              >
                Start Interview
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex flex-col">
                <h2 className="text-2xl font-semibold">{currentSession.jobRole} Interview</h2>
                <div className="flex flex-wrap gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {currentSession.techStack}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-xs"
                    style={{ backgroundColor: `rgba(155, 135, 245, 0.1)`, borderColor: '#9b87f5', color: '#9b87f5' }}
                  >
                    {difficultyOptions.find(opt => opt.value === currentSession.difficultyLevel)?.label}
                  </Badge>
                </div>
              </div>
              
              <div className="flex gap-2">
                {currentSession.currentQuestionIndex > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={toggleView}
                  >
                    {isFeedbackView ? 'Show Chat' : 'View Feedback'}
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  onClick={resetInterview}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  New Session
                </Button>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Progress</span>
                <span>{Math.min(currentSession.currentQuestionIndex, currentSession.questionsCount)}/{currentSession.questionsCount} Questions</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500" 
                  style={{
                    width: `${(Math.min(currentSession.currentQuestionIndex, currentSession.questionsCount) / currentSession.questionsCount) * 100}%`,
                    background: 'linear-gradient(90deg, #9b87f5 0%, #7E69AB 100%)'
                  }}
                />
              </div>
            </div>
            
            {!isFeedbackView ? (
              <Card className="mb-4">
                <CardContent className="p-0">
                  <div 
                    ref={chatContainerRef}
                    className="h-[500px] overflow-y-auto p-4 space-y-4"
                  >
                    {currentSession.messages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                        <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
                        <p>Your chat interview will begin momentarily...</p>
                      </div>
                    ) : (
                      currentSession.messages.map((message, index) => (
                        <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div 
                            className={`max-w-[80%] rounded-2xl p-4 ${
                              message.role === 'user' 
                                ? 'bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-white' 
                                : 'bg-muted'
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{message.content}</p>
                            
                            {message.role === 'user' && message.feedback && (
                              <div className="mt-2 pt-2 border-t border-white/20">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-xs text-white/80 hover:text-white p-1 h-auto"
                                  onClick={() => setIsFeedbackView(true)}
                                >
                                  View Feedback
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                  
                  <div className="p-4 border-t">
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmitResponse();
                      }}
                      className="flex gap-2"
                    >
                      <Textarea 
                        placeholder={
                          currentSession.currentQuestionIndex >= currentSession.questionsCount
                            ? "Interview complete. View feedback or start a new session."
                            : "Type your answer here..."
                        }
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        className="min-h-[60px] flex-grow"
                        disabled={isGenerating || currentSession.currentQuestionIndex >= currentSession.questionsCount}
                      />
                      <Button 
                        type="submit" 
                        size="icon"
                        className="h-[60px] w-[60px]"
                        disabled={isGenerating || !userInput.trim() || currentSession.currentQuestionIndex >= currentSession.questionsCount}
                        style={{
                          background: `linear-gradient(135deg, #9b87f5 0%, #7E69AB 100%)`,
                        }}
                      >
                        <Send className="h-5 w-5" />
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6 space-y-6">
                  {isGeneratingFeedback ? (
                    <div className="py-20 flex flex-col items-center justify-center">
                      <div className="h-12 w-12 rounded-full border-4 border-[#9b87f5] border-t-transparent animate-spin mb-4" />
                      <p className="text-muted-foreground">Generating comprehensive feedback...</p>
                    </div>
                  ) : (
                    <Tabs defaultValue="overall" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="overall">Overall Feedback</TabsTrigger>
                        <TabsTrigger value="questions">Question by Question</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="overall" className="pt-6">
                        {currentSession.overallFeedback ? (
                          <div className="space-y-6">
                            <div className="p-6 bg-muted/50 rounded-lg">
                              <h3 className="font-semibold text-lg mb-4">
                                Interview Assessment
                              </h3>
                              <p className="whitespace-pre-line">{currentSession.overallFeedback}</p>
                            </div>
                            
                            <div className="flex justify-end">
                              <Button 
                                variant="outline" 
                                onClick={resetInterview}
                              >
                                Start New Session
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-12 text-muted-foreground">
                            <p>Complete the interview to receive overall feedback</p>
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="questions" className="pt-6 space-y-8">
                        {currentSession.messages
                          .filter(msg => msg.role === 'assistant')
                          .map((question, index) => {
                            const userAnswer = currentSession.messages[index * 2 + 1];
                            const feedback = userAnswer?.feedback;
                            
                            if (!userAnswer) return null;
                            
                            return (
                              <div key={index} className="space-y-4">
                                <div className="flex gap-4 items-start">
                                  <Avatar className="h-10 w-10 mt-1">
                                    <div className="bg-[#7E69AB] h-full w-full grid place-items-center text-white font-medium">
                                      AI
                                    </div>
                                  </Avatar>
                                  <div className="space-y-2">
                                    <h4 className="font-semibold">Question {index + 1}</h4>
                                    <p>{question.content}</p>
                                  </div>
                                </div>
                                
                                <div className="pl-14">
                                  <div className="p-4 bg-muted rounded-lg">
                                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Your Answer:</h4>
                                    <p>{userAnswer.content}</p>
                                  </div>
                                </div>
                                
                                {feedback && (
                                  <div className="pl-14">
                                    <div className="p-4 rounded-lg border-l-4" style={{ borderLeftColor: '#9b87f5', backgroundColor: 'rgba(155, 135, 245, 0.1)' }}>
                                      <h4 className="font-medium text-sm mb-2" style={{ color: '#9b87f5' }}>Feedback:</h4>
                                      <p className="whitespace-pre-line">{feedback}</p>
                                    </div>
                                  </div>
                                )}
                                
                                <Separator className="mt-8" />
                              </div>
                            );
                          })}
                      </TabsContent>
                    </Tabs>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPractice;
