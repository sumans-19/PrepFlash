
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, ChevronRight, Home, Lightbulb, Star } from 'lucide-react';
import { DashboardNav } from '@/components/DashboardNav';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

const InterviewFeedback = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      if (!interviewId) {
        setError("No interview ID provided");
        setLoading(false);
        return;
      }

      try {
        // First get the interview to find its feedback ID
        const interviewDoc = await getDoc(doc(db, "interviews", interviewId));
        
        if (!interviewDoc.exists()) {
          setError("Interview not found");
          setLoading(false);
          return;
        }
        
        const interviewData = interviewDoc.data();
        const feedbackId = interviewData.feedbackId;
        
        if (!feedbackId) {
          setError("No feedback available for this interview yet");
          setLoading(false);
          return;
        }
        
        // Now get the feedback using the feedback ID
        const feedbackDoc = await getDoc(doc(db, "feedback", feedbackId));
        
        if (!feedbackDoc.exists()) {
          setError("Feedback not found");
          setLoading(false);
          return;
        }
        
        setFeedback(feedbackDoc.data());
        setLoading(false);
      } catch (err) {
        console.error("Error fetching feedback:", err);
        setError("Failed to load feedback");
        setLoading(false);
      }
    };
    
    fetchFeedback();
  }, [interviewId]);

  // If we're still loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <DashboardNav />
        <div className="container mx-auto pt-24 pb-12 px-4 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading feedback...</p>
          </div>
        </div>
      </div>
    );
  }

  // If there was an error
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <DashboardNav />
        <div className="container mx-auto pt-24 pb-12 px-4">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Error</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/')} className="mt-4">
                <Home className="mr-2 h-4 w-4" />
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Display the feedback
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <DashboardNav />
      <div className="container mx-auto pt-24 pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              Your Interview Feedback
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Review your performance and areas for improvement
            </p>
          </div>
          
          {/* Overall Score Card */}
          <Card className="mb-8 overflow-hidden border-2 dark:bg-gray-800/50 bg-white/50 backdrop-blur-sm">
            <div className="bg-gradient-to-r from-primary/30 to-background/10 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Overall Performance</h2>
                  <p className="text-muted-foreground">Interview completed on {new Date(feedback?.timestamp?.toDate()).toLocaleString()}</p>
                </div>
                <div className="flex items-center justify-center w-24 h-24 rounded-full bg-white dark:bg-gray-800 shadow-lg">
                  <span className="text-3xl font-bold text-primary">{feedback?.overallScore || 0}%</span>
                </div>
              </div>
            </div>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium flex items-center">
                    <Check className="text-green-500 mr-2 h-5 w-5" />
                    Strengths
                  </h3>
                  <p className="mt-1 text-muted-foreground">{feedback?.summary?.overallStrength || "No strengths identified"}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium flex items-center">
                    <Lightbulb className="text-amber-500 mr-2 h-5 w-5" />
                    Areas for Improvement
                  </h3>
                  <p className="mt-1 text-muted-foreground">{feedback?.summary?.overallImprovement || "No improvements suggested"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Detailed Feedback */}
          <h2 className="text-2xl font-bold mb-4">Question-by-Question Feedback</h2>
          <div className="space-y-6">
            {feedback?.feedbackItems?.map((item: any, index: number) => (
              <Card key={index} className="overflow-hidden border-2 dark:bg-gray-800/50 bg-white/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold pr-4">Q{index + 1}: {item.question}</h3>
                    <Badge variant={item.score >= 70 ? "default" : "secondary"} className="whitespace-nowrap">
                      Score: {item.score}/100
                    </Badge>
                  </div>
                  
                  <div className="mt-4 space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Your Answer:</h4>
                      <p className="mt-1 text-sm border-l-2 border-primary/30 pl-3 py-1">
                        {item.answer}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Feedback:</h4>
                      <p className="mt-1 text-sm">{item.feedback}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center">
                          <Check className="h-4 w-4 mr-1" /> Strengths
                        </h4>
                        <ul className="mt-1 space-y-1">
                          {item.strengths.map((strength: string, i: number) => (
                            <li key={i} className="text-sm flex items-start">
                              <ChevronRight className="h-4 w-4 mr-1 shrink-0 mt-0.5" />
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-amber-600 dark:text-amber-400 flex items-center">
                          <Lightbulb className="h-4 w-4 mr-1" /> Improvements
                        </h4>
                        <ul className="mt-1 space-y-1">
                          {item.improvements.map((improvement: string, i: number) => (
                            <li key={i} className="text-sm flex items-start">
                              <ChevronRight className="h-4 w-4 mr-1 shrink-0 mt-0.5" />
                              <span>{improvement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Recommended Resources */}
          <Card className="mt-8 overflow-hidden border-2 dark:bg-gray-800/50 bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2 text-primary" />
                Recommended Resources
              </CardTitle>
              <CardDescription>Resources to help you improve your interview skills</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {feedback?.summary?.recommendedResources?.map((resource: string, i: number) => (
                  <li key={i} className="flex items-start">
                    <ChevronRight className="h-4 w-4 mr-2 shrink-0 mt-1 text-primary" />
                    <span>{resource}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8 flex justify-end space-x-4">
                <Button onClick={() => navigate('/')} variant="outline">
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
                <Button onClick={() => navigate('/mock-interview')}>
                  Try Another Interview
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InterviewFeedback;
