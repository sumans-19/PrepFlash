import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useInterview } from '@/contexts/InterviewContext';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const InterviewFeedback: React.FC = () => {
  const { feedback, resetInterview, setup } = useInterview();
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  if (!feedback) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="py-10 text-center">
          <p>No feedback available. Please complete an interview first.</p>
          <Button 
            onClick={resetInterview}
            className="mt-4 bg-interview-primary hover:bg-interview-secondary text-white"
          >
            Start New Interview
          </Button>
        </CardContent>
      </Card>
    );
  }

  const getRatingColor = (score: number) => {
    if (score >= 8.5) return "bg-green-500";
    if (score >= 7) return "bg-blue-500";
    if (score >= 5) return "bg-yellow-500";
    return "bg-red-500";
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Extract emotion data from feedback
  const emotions = {
    confident: feedback.confidence || 0,
    clarity: feedback.clarity || 0,
    knowledge: feedback.knowledgeDepth || 0,
    composed: 7.5, // Example values based on Python analysis
    attentive: 6.8,
    nervous: 3.2
  };
  
  // For detailed emotional analysis (this would come from your Python analysis)
  const emotionDurations = {
    confident: 95,
    composed: 45, 
    attentive: 35,
    nervous: 25
  };
  
  // Convert to array for visualization
  const emotionData = Object.entries(emotions).map(([name, value]) => ({
    name,
    value: value * 10 // Scale to percentage
  }));

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg border-t-4 border-t-interview-accent">
        <CardHeader className="bg-gradient-to-r from-interview-primary to-interview-secondary text-white p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">Interview Feedback</CardTitle>
              <CardDescription className="text-gray-100">
                Here's how you performed in your {setup?.difficultyLevel} level {setup?.jobRole} interview
              </CardDescription>
            </div>
            <div>
              <Badge className="text-lg px-4 py-2 bg-white text-interview-dark">
                Overall Score: {feedback.overallScore.toFixed(1)}/10
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <div className="border-b border-gray-200">
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="verbal">Verbal Analysis</TabsTrigger>
              <TabsTrigger value="emotional">Emotional Analysis</TabsTrigger>
              <TabsTrigger value="interview">Interview Recording</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <CardContent className="p-6">
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Clarity</span>
                    <span className={`px-2 py-0.5 rounded-full text-white text-xs ${getRatingColor(feedback.clarity)}`}>
                      {feedback.clarity.toFixed(1)}/10
                    </span>
                  </div>
                  <Progress value={feedback.clarity * 10} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Confidence</span>
                    <span className={`px-2 py-0.5 rounded-full text-white text-xs ${getRatingColor(feedback.confidence)}`}>
                      {feedback.confidence.toFixed(1)}/10
                    </span>
                  </div>
                  <Progress value={feedback.confidence * 10} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Knowledge Depth</span>
                    <span className={`px-2 py-0.5 rounded-full text-white text-xs ${getRatingColor(feedback.knowledgeDepth)}`}>
                      {feedback.knowledgeDepth.toFixed(1)}/10
                    </span>
                  </div>
                  <Progress value={feedback.knowledgeDepth * 10} className="h-2" />
                </div>
              </div>
              
              <div className="bg-gray-50 p-5 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Interview Statistics</h3>
                <ul className="space-y-3">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Average Response Time:</span>
                    <span className="font-medium">{formatTime(feedback.averageResponseTime)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Filler Words Used:</span>
                    <span className="font-medium">{feedback.fillerWordCount}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Face Detection Rate:</span>
                    <span className="font-medium">96.3%</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Emotional Stability:</span>
                    <span className="font-medium">72.5/100</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-lg bg-green-50 border border-green-100">
                <h3 className="font-semibold text-lg mb-3 text-green-800">Strengths</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {feedback.strengths.map((strength, index) => (
                    <li key={index} className="text-green-800">{strength}</li>
                  ))}
                </ul>
              </div>
              
              <div className="p-5 rounded-lg bg-amber-50 border border-amber-100">
                <h3 className="font-semibold text-lg mb-3 text-amber-800">Areas for Improvement</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {feedback.improvements.map((improvement, index) => (
                    <li key={index} className="text-amber-800">{improvement}</li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="verbal" className="space-y-6">
            <div className="bg-white rounded-lg p-5 border border-gray-200">
              <h3 className="font-semibold text-lg mb-3">Transcript</h3>
              <div className="bg-gray-50 p-4 rounded-md text-gray-800">
                <p className="whitespace-pre-line">
                  "Thank you for the opportunity to interview today. I've been working with React and TypeScript for about three years now. In my previous role, I led a team of four developers to create a customer portal that improved user engagement by 32%. One of the most challenging aspects was integrating with legacy systems while maintaining modern development practices. I stay updated by following industry blogs and participating in weekly coding challenges. I believe my experience aligns well with what you're looking for."
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-5 border border-gray-200">
              <h3 className="font-semibold text-lg mb-3">Content Analysis</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Structure & Organization</h4>
                  <Progress value={75} className="h-2 mb-1" />
                  <p className="text-sm text-gray-600">Your answers had a clear structure but could benefit from more consistent use of the STAR method.</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Relevance to Questions</h4>
                  <Progress value={85} className="h-2 mb-1" />
                  <p className="text-sm text-gray-600">Your responses were closely aligned with the questions being asked.</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Technical Detail</h4>
                  <Progress value={65} className="h-2 mb-1" />
                  <p className="text-sm text-gray-600">Consider including more specific technical details when discussing your experience.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-5 border border-gray-200">
              <h3 className="font-semibold text-lg mb-3">Language Analysis</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-500 mb-1">Filler Words</p>
                  <div className="flex justify-between">
                    <span className="font-medium">{feedback.fillerWordCount}</span>
                    <span className="text-xs text-gray-500">instances detected</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-500 mb-1">Speaking Pace</p>
                  <div className="flex justify-between">
                    <span className="font-medium">145</span>
                    <span className="text-xs text-gray-500">words per minute</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm">
                  <span className="font-medium">Strengths:</span> Clear articulation, good vocabulary, effective use of industry terminology.
                </p>
                <p className="text-sm">
                  <span className="font-medium">Areas for Improvement:</span> Reduce usage of "um" and "like", vary sentence structure for more engaging responses.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="emotional" className="space-y-6">
            <div className="bg-white rounded-lg p-5 border border-gray-200">
              <h3 className="font-semibold text-lg mb-3">Emotional State Analysis</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-md text-center">
                  <p className="text-sm text-gray-500 mb-2">Primary Emotion</p>
                  <div className="text-xl font-semibold text-interview-dark">Confident</div>
                  <p className="text-sm text-gray-500 mt-1">65.2% of interview</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md text-center">
                  <p className="text-sm text-gray-500 mb-2">Emotional Stability</p>
                  <div className="text-xl font-semibold text-interview-dark">72.5/100</div>
                  <p className="text-sm text-gray-500 mt-1">8 detected changes</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md text-center">
                  <p className="text-sm text-gray-500 mb-2">Face Detection</p>
                  <div className="text-xl font-semibold text-interview-dark">96.3%</div>
                  <p className="text-sm text-gray-500 mt-1">of frames analyzed</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Emotion Distribution</h4>
                <div className="space-y-3">
                  {Object.entries(emotionDurations).map(([emotion, duration]) => (
                    <div key={emotion}>
                      <div className="flex justify-between mb-1">
                        <span className="capitalize">{emotion}</span>
                        <span>{duration}s</span>
                      </div>
                      <Progress 
                        value={(duration / Object.values(emotionDurations).reduce((a, b) => a + b, 0)) * 100} 
                        className="h-2" 
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-5 border border-gray-200">
              <h3 className="font-semibold text-lg mb-3">Emotional Feedback</h3>
              <ul className="space-y-3 list-disc pl-5">
                <li>Your primary emotion of 'Confident' is positive, but aim to maintain it more consistently.</li>
                <li>The high number of emotion changes might suggest nervousness; practice steadying your expression.</li>
                <li>You appeared most confident when discussing technical achievements, but showed signs of anxiety during challenging questions.</li>
                <li>Your facial expressions aligned well with your verbal content, reinforcing your message.</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="interview" className="space-y-6">
            <div className="bg-white rounded-lg p-5 border border-gray-200">
              <h3 className="font-semibold text-lg mb-3">Interview Recording</h3>
              
              <div className="bg-gray-900 rounded-lg p-2 aspect-video flex items-center justify-center">
                <p className="text-white text-center">
                  Interview recording player would appear here.<br/>
                  (Implementation requires backend integration)
                </p>
              </div>
              
              <div className="flex justify-center mt-4">
                <Button variant="outline" className="mr-2">
                  Download Recording
                </Button>
                <Button>
                  Share Results
                </Button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-5 border border-gray-200">
              <h3 className="font-semibold text-lg mb-3">Interview Questions</h3>
              <ul className="space-y-3 list-decimal pl-5">
                <li>Tell me about your experience with React and TypeScript.</li>
                <li>Describe a challenging project you completed in your previous role.</li>
                <li>How do you stay updated with the latest industry trends?</li>
                <li>What skills do you believe make you a good fit for this position?</li>
              </ul>
            </div>
          </TabsContent>
        </CardContent>
        
        <CardFooter className="flex justify-between p-6 bg-gray-50">
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline">View Full Analysis Report</Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[85vh] overflow-y-auto">
              <DrawerHeader>
                <DrawerTitle>Complete Interview Analysis Report</DrawerTitle>
                <DrawerDescription>
                  Comprehensive breakdown of your interview performance
                </DrawerDescription>
              </DrawerHeader>
              <div className="px-4 py-2 space-y-6">
                <div>
                  <h3 className="font-bold text-lg mb-2">Content & Structure Feedback</h3>
                  <div className="pl-4 border-l-2 border-gray-300 text-gray-700">
                    <p className="whitespace-pre-line mb-4">
                      * Your answer about your experience with React and TypeScript was clear and specific, with good quantitative results (32% improvement in user engagement).
                      * You effectively highlighted leadership skills by mentioning team management.
                      * Consider using more structured STAR responses (Situation, Task, Action, Result) for behavioral questions.
                      * Your answers could benefit from more specific technical details when discussing the challenges of integrating with legacy systems.
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-2">Non-verbal & Emotional Feedback</h3>
                  <div className="pl-4 border-l-2 border-gray-300 text-gray-700">
                    <p className="whitespace-pre-line mb-4">
                      * Your primary emotion of 'Confident' (65.2% of the interview) creates a positive impression.
                      * The facial detection rate of 96.3% indicates you maintained good eye contact with the camera.
                      * Your emotional stability score of 72.5/100 is good, though the 8 emotional shifts suggest some underlying nervousness.
                      * There was a noticeable shift to nervousness when discussing technical challenges, which could be interpreted as uncertainty.
                      * You maintained composure well during pauses and transitions between questions.
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-2">Overall Recommendations</h3>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Practice maintaining your confident expression when discussing technical challenges, as there was a slight shift to nervousness during these moments.</li>
                    <li>Structure your answers using the STAR method to ensure you're fully addressing each question with concrete examples.</li>
                    <li>Include more quantifiable results and metrics in your answers to strengthen their impact.</li>
                  </ol>
                </div>
              </div>
              <DrawerFooter>
                <Button>Download Full Report</Button>
                <DrawerClose asChild>
                  <Button variant="outline">Close</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
          
          <Button 
            onClick={resetInterview}
            className="bg-interview-primary hover:bg-interview-secondary text-white"
          >
            Start New Interview
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default InterviewFeedback;
