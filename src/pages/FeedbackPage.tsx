
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { toast } from '@/components/ui/sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface InterviewData {
  messages: Message[];
  completedAt: string;
  userName: string;
}

// Demo data that will change periodically
const demoInterviews: InterviewData[] = [
  {
    userName: "Alex Johnson",
    completedAt: "2025-04-28T15:30:00Z",
    messages: [
      { role: "assistant", content: "Tell me about your experience with React." },
      { role: "user", content: "I've been using React for about 3 years now. I've built several production applications using functional components and hooks. I'm particularly experienced with state management solutions like Redux and Context API, and I've implemented complex UI interactions using React's lifecycle methods." },
      { role: "assistant", content: "Can you describe a challenging problem you solved using React?" },
      { role: "user", content: "I once had to implement a complex data visualization dashboard that needed to handle real-time updates from multiple data sources while maintaining performance. I used memoization, virtualized lists, and WebSockets to create a responsive interface that could handle thousands of data points updating simultaneously." },
      { role: "assistant", content: "How do you approach optimization in React applications?" },
      { role: "user", content: "I focus on preventing unnecessary re-renders using React.memo, useMemo, and useCallback. I also implement code-splitting with React.lazy and Suspense to reduce the initial bundle size. For data fetching, I use techniques like pagination and caching to minimize network requests." }
    ]
  },
  {
    userName: "Sam Rivera",
    completedAt: "2025-04-27T10:15:00Z",
    messages: [
      { role: "assistant", content: "Describe your experience with modern JavaScript frameworks." },
      { role: "user", content: "I've worked with React and Vue extensively. I prefer React for larger applications due to its ecosystem." },
      { role: "assistant", content: "How do you handle state management in your projects?" },
      { role: "user", content: "For simpler apps, I use React context. For more complex state requirements, I implement Redux or Zustand." },
      { role: "assistant", content: "What's your approach to testing UI components?" },
      { role: "user", content: "I use Jest with React Testing Library for component testing, focusing on user interactions rather than implementation details." }
    ]
  },
  {
    userName: "Taylor Kim",
    completedAt: "2025-04-29T14:20:00Z",
    messages: [
      { role: "assistant", content: "What frontend technologies are you most comfortable with?" },
      { role: "user", content: "I'm most comfortable with React, TypeScript, and styled-components. I've been building production applications with this stack for the past two years and have become very familiar with the React ecosystem including libraries like React Query for data fetching." },
      { role: "assistant", content: "Tell me about a challenging project you worked on recently." },
      { role: "user", content: "I recently led the frontend development for a healthcare portal that required handling sensitive patient data, complex form validations, and integration with multiple third-party APIs. The main challenge was maintaining performance while implementing strict security measures and handling real-time notifications." },
      { role: "assistant", content: "How do you stay updated with the rapidly evolving frontend landscape?" },
      { role: "user", content: "I follow several tech blogs, participate in online communities like Dev.to and Reddit's r/reactjs, and regularly experiment with new tools in side projects. I also attend virtual conferences and watch conference talks to learn about emerging patterns and practices." }
    ]
  }
];

const FeedbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [interviewData, setInterviewData] = useState<InterviewData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Simulate loading data
    setLoading(true);
    
    // Attempt to load real interview data first
    const storedData = sessionStorage.getItem('interviewData');
    
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setInterviewData(parsedData);
      } catch (e) {
        console.error('Error parsing interview data', e);
        toast.error('Error loading interview results, showing demo data instead');
        
        // Fall back to demo data if parsing fails
        const randomIndex = Math.floor(Math.random() * demoInterviews.length);
        setInterviewData(demoInterviews[randomIndex]);
      }
    } else {
      // No stored data, use demo data with periodical changes
      console.log('No stored data found, using demo data');
      
      // Change demo data every 30 seconds
      const randomIndex = Math.floor(Math.random() * demoInterviews.length);
      setInterviewData(demoInterviews[randomIndex]);
      
      const intervalId = setInterval(() => {
        const newIndex = Math.floor(Math.random() * demoInterviews.length);
        setInterviewData(demoInterviews[newIndex]);
        console.log('Demo data refreshed');
      }, 30000); // Change every 30 seconds
      
      // Clear the interval when the component unmounts
      return () => clearInterval(intervalId);
    }
    
    setLoading(false);
  }, [navigate]);
  
  // Generate simple feedback based on responses
  const generateFeedback = (messages: Message[]) => {
    const userResponses = messages.filter(m => m.role === 'user');
    
    // Simple scoring system
    let score = 0;
    let verbosity = 0;
    let technicalTermsCount = 0;
    const technicalTerms = ['react', 'javascript', 'component', 'api', 'state', 'props', 'hooks', 'jsx', 'rest', 'graphql', 'database', 'optimization', 'performance'];
    
    userResponses.forEach(response => {
      const content = response.content.toLowerCase();
      const wordCount = content.split(' ').length;
      
      // Score based on response length
      if (wordCount > 100) score += 3;
      else if (wordCount > 50) score += 2;
      else if (wordCount > 20) score += 1;
      
      // Track overall verbosity
      verbosity += wordCount;
      
      // Count technical terms
      technicalTerms.forEach(term => {
        const regex = new RegExp(`\\b${term}\\b`, 'gi');
        const matches = content.match(regex);
        if (matches) technicalTermsCount += matches.length;
      });
    });
    
    // Calculate average response length
    const avgResponseLength = Math.round(verbosity / (userResponses.length || 1));
    
    // Normalize score to be between 0-100
    const normalizedScore = Math.min(Math.round((score / (userResponses.length * 3)) * 100), 100);
    
    return {
      score: normalizedScore,
      responseCount: userResponses.length,
      averageResponseLength: avgResponseLength,
      technicalTermsUsed: technicalTermsCount,
      strength: normalizedScore > 70 ? 'Strong technical communication' : 'Clear and concise responses',
      improvement: normalizedScore < 60 ? 'Could provide more detailed technical examples' : 'Could structure responses with more clarity'
    };
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-black to-background z-[-1]"></div>
      <div className="fixed inset-0 bg-grid-white/[0.02] z-[-1]"></div>
      
      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 pt-8 pb-12">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Home
        </Button>
        
        <h1 className="text-3xl font-bold mb-6">Interview Feedback</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : !interviewData ? (
          <div className="text-center py-12">
            <AlertCircle size={48} className="mx-auto mb-4 text-yellow-500" />
            <h3 className="text-xl font-medium">No Interview Data Found</h3>
            <p className="text-muted-foreground mt-2">Please complete an interview to see feedback</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Performance summary card */}
            <Card className="col-span-1 bg-card/70 backdrop-blur border-border/20">
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const feedback = generateFeedback(interviewData.messages);
                  return (
                    <div className="space-y-6">
                      {/* Score */}
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-secondary border-4 border-primary">
                          <span className="text-3xl font-bold">{feedback.score}%</span>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">Overall Score</p>
                      </div>
                      
                      <Separator className="bg-border" />
                      
                      {/* Metrics */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Clock size={16} className="mr-2 text-primary" />
                            <span className="text-sm">Responses</span>
                          </div>
                          <span className="font-medium">{feedback.responseCount}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Clock size={16} className="mr-2 text-primary" />
                            <span className="text-sm">Avg. Length</span>
                          </div>
                          <span className="font-medium">{feedback.averageResponseLength} words</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Clock size={16} className="mr-2 text-primary" />
                            <span className="text-sm">Technical Terms</span>
                          </div>
                          <span className="font-medium">{feedback.technicalTermsUsed}</span>
                        </div>
                      </div>
                      
                      <Separator className="bg-border" />
                      
                      {/* Strengths & Improvements */}
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center mb-2">
                            <CheckCircle size={16} className="mr-2 text-green-500" />
                            <span className="text-sm font-medium">Strength</span>
                          </div>
                          <p className="text-sm text-muted-foreground pl-6">{feedback.strength}</p>
                        </div>
                        
                        <div>
                          <div className="flex items-center mb-2">
                            <XCircle size={16} className="mr-2 text-yellow-500" />
                            <span className="text-sm font-medium">Area for Improvement</span>
                          </div>
                          <p className="text-sm text-muted-foreground pl-6">{feedback.improvement}</p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
            
            {/* Conversation transcript */}
            <Card className="col-span-1 md:col-span-2 bg-card/70 backdrop-blur border-border/20">
              <CardHeader>
                <CardTitle>Interview Transcript</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 scroll-container">
                  {interviewData.messages.map((message, index) => (
                    <div 
                      key={index} 
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg p-4 ${
                          message.role === 'user' 
                            ? 'bg-primary/10 border border-primary/30' 
                            : 'bg-secondary/30 border border-secondary/30'
                        }`}
                      >
                        <div className="text-xs text-muted-foreground mb-1">
                          {message.role === 'user' ? interviewData.userName : 'AI Interviewer'}
                        </div>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        <div className="mt-12 flex justify-center">
          <Button 
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft size={16} />
            Return to Home
          </Button>
        </div>
      </main>
    </div>
  );
};

export default FeedbackPage;
