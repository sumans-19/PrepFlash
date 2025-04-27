
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, User } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { DashboardNav } from '@/components/DashboardNav';

const sampleQuestions = [
  "Tell me about your experience with React and how you've used it in your previous projects.",
  "Can you explain how you handle state management in complex applications?",
  "Walk me through your approach to debugging a performance issue in a web application.",
  "How do you stay updated with the latest trends and technologies in web development?",
  "Describe a challenging technical problem you solved recently and the approach you took."
];

const InterviewSetup: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>("Adrian");
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);
  
  // Animation effects
  useEffect(() => {
    const cards = document.querySelectorAll('.interview-card');
    
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('animate-fade-in');
      }, index * 150);
    });
  }, []);

  const startAIInterview = () => {
    setIsRedirecting(true);
    
    // Make sure the questions are properly saved to session storage
    try {
      const questionsJson = JSON.stringify(sampleQuestions);
      sessionStorage.setItem('interviewQuestions', questionsJson);
      sessionStorage.setItem('userName', userName);
      
      console.log('Questions saved to session storage:', questionsJson);
      
      toast.success("Starting AI Interview", {
        description: "Preparing your interview experience..."
      });
      
      // Add a small delay to ensure storage is complete before navigation
      setTimeout(() => {
        navigate('/interview');
      }, 500);
    } catch (error) {
      console.error('Error saving interview data:', error);
      toast.error("Failed to start interview. Please try again.");
      setIsRedirecting(false);
    }
  };
  
  const startHumanInterview = () => {
    toast.info("Human interviews are coming soon!", {
      description: "This feature will be available in the next update."
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0A0A1B] to-black z-[-1]"></div>
      <div className="fixed inset-0 bg-grid-white/[0.02] z-[-1]"></div>
      
      {/* Add navigation bar */}
      <DashboardNav />
      
      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-20">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold mb-12">Interview Generation</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
            {/* AI Interviewer Card */}
            <Card className="interview-card bg-[#11112A] border-[#2A2A4A] hover:border-purple-500/50 transition-all duration-300 opacity-0 backdrop-blur-sm">
              <CardContent className="p-8 flex flex-col items-center">
                <div className="mb-6 relative">
                  <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-lg"></div>
                  <Avatar className="w-32 h-32 bg-purple-900 border-2 border-purple-400/30 relative">
                    <AvatarFallback className="bg-purple-900 text-white">
                      <Mic size={40} />
                    </AvatarFallback>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Mic size={40} className="text-white" />
                    </div>
                  </Avatar>
                </div>
                <h2 className="text-2xl font-semibold mb-8">AI Interviewer</h2>
                <Button 
                  onClick={startAIInterview}
                  disabled={isRedirecting}
                  className="w-full bg-gradient-to-r from-purple-700 to-blue-600 hover:from-purple-600 hover:to-blue-500 text-white font-medium py-6"
                >
                  {isRedirecting ? "Starting..." : "Start AI Interview"}
                </Button>
              </CardContent>
            </Card>
            
            {/* Human Interviewer Card */}
            <Card className="interview-card bg-[#1A1A2A] border-[#2A2A4A] hover:border-blue-500/50 transition-all duration-300 opacity-0 backdrop-blur-sm">
              <CardContent className="p-8 flex flex-col items-center">
                <div className="mb-6">
                  <Avatar className="w-32 h-32 bg-gray-800 border-2 border-gray-700">
                    <AvatarImage src="/lovable-uploads/bb98dd7e-069c-4ae0-80a8-b24f44b968c5.png" alt="User" />
                    <AvatarFallback className="bg-gray-800 text-white">
                      <User size={40} />
                    </AvatarFallback>
                  </Avatar>
                </div>
                <h2 className="text-2xl font-semibold mb-8">{userName}</h2>
                <Button 
                  onClick={startHumanInterview}
                  className="w-full bg-gradient-to-r from-blue-700 to-cyan-600 hover:from-blue-600 hover:to-cyan-500 text-white font-medium py-6"
                >
                  Start Human Interview
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Info Text */}
          <div className="mt-16 max-w-3xl text-center text-gray-300 bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10">
            <p>You know the usual React, JavaScript, Next, is that what you are interviewing for today?</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InterviewSetup;
