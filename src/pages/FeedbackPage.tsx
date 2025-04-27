
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { DashboardNav } from '@/components/DashboardNav';
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

const FeedbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [interviewData, setInterviewData] = useState<InterviewData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Attempt to load interview data
    const storedData = sessionStorage.getItem('interviewData');
    
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setInterviewData(parsedData);
      } catch (e) {
        console.error('Error parsing interview data', e);
        toast.error('Error loading interview results');
      }
    } else {
      toast.error('No interview data found');
      // Redirect after a brief delay
      setTimeout(() => navigate('/'), 1500);
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
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0A0A1B] to-black z-[-1]"></div>
      <div className="fixed inset-0 bg-grid-white/[0.02] z-[-1]"></div>
      
      <DashboardNav />
      
      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 pt-20 pb-12">
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
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : !interviewData ? (
          <div className="text-center py-12">
            <AlertCircle size={48} className="mx-auto mb-4 text-yellow-500" />
            <h3 className="text-xl font-medium">No Interview Data Found</h3>
            <p className="text-gray-400 mt-2">Please complete an interview to see feedback</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Performance summary card */}
            <Card className="col-span-1 bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
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
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-800 border-4 border-purple-600">
                          <span className="text-3xl font-bold">{feedback.score}%</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-400">Overall Score</p>
                      </div>
                      
                      <Separator className="bg-gray-700" />
                      
                      {/* Metrics */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Clock size={16} className="mr-2 text-blue-400" />
                            <span className="text-sm">Responses</span>
                          </div>
                          <span className="font-medium">{feedback.responseCount}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Clock size={16} className="mr-2 text-green-400" />
                            <span className="text-sm">Avg. Length</span>
                          </div>
                          <span className="font-medium">{feedback.averageResponseLength} words</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Clock size={16} className="mr-2 text-yellow-400" />
                            <span className="text-sm">Technical Terms</span>
                          </div>
                          <span className="font-medium">{feedback.technicalTermsUsed}</span>
                        </div>
                      </div>
                      
                      <Separator className="bg-gray-700" />
                      
                      {/* Strengths & Improvements */}
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center mb-2">
                            <CheckCircle size={16} className="mr-2 text-green-500" />
                            <span className="text-sm font-medium">Strength</span>
                          </div>
                          <p className="text-sm text-gray-300 pl-6">{feedback.strength}</p>
                        </div>
                        
                        <div>
                          <div className="flex items-center mb-2">
                            <XCircle size={16} className="mr-2 text-yellow-500" />
                            <span className="text-sm font-medium">Area for Improvement</span>
                          </div>
                          <p className="text-sm text-gray-300 pl-6">{feedback.improvement}</p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
            
            {/* Conversation transcript */}
            <Card className="col-span-1 md:col-span-2 bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle>Interview Transcript</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                  {interviewData.messages.map((message, index) => (
                    <div 
                      key={index} 
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg p-4 ${
                          message.role === 'user' 
                            ? 'bg-blue-900/40 border border-blue-800/50' 
                            : 'bg-purple-900/40 border border-purple-800/50'
                        }`}
                      >
                        <div className="text-xs text-gray-400 mb-1">
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
            className="bg-gradient-to-r from-purple-700 to-blue-600 hover:from-purple-600 hover:to-blue-500 text-white"
          >
            Return to Home
          </Button>
        </div>
      </main>
    </div>
  );
};

export default FeedbackPage;
