
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  CalendarDays, Star, BookOpen, Medal, 
  Check, Clock, Calendar, Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { DailyChallenge, User } from "@/types/models";
import { getDailyChallenge, completeDailyChallenge, getUserProfile } from "@/lib/firestore";
import { auth } from "@/lib/firebase";
import { DashboardNav } from "@/components/DashboardNav";
import { motion } from "framer-motion";

const DailyChallengePage = () => {
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  
  const userId = auth.currentUser?.uid;
  const isCompleted = challenge?.completedBy.includes(userId || "");
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch today's challenge
        const challengeData = await getDailyChallenge();
        setChallenge(challengeData);
        
        // If user is logged in, fetch profile for streak data
        if (userId) {
          const profile = await getUserProfile(userId);
          setUserProfile(profile);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load today's challenge",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [userId]);
  
  const handleCompleteChallenge = async () => {
    if (!challenge || !userId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to complete challenges",
        variant: "destructive"
      });
      return;
    }
    
    setCompleting(true);
    try {
      await completeDailyChallenge(challenge.id, userId);
      
      // Update local state
      setChallenge({
        ...challenge,
        completedBy: [...challenge.completedBy, userId]
      });
      
      // Update user streak if we have profile data
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          streak: userProfile.streak + 1,
          points: userProfile.points + 50
        });
      }
      
      toast({
        title: "Challenge completed!",
        description: "You've earned 50 points and increased your streak!",
      });
    } catch (error) {
      console.error("Error completing challenge:", error);
      toast({
        title: "Error",
        description: "Failed to mark challenge as complete",
        variant: "destructive"
      });
    } finally {
      setCompleting(false);
    }
  };
  
  // Mock week data for the calendar view
  const weekData = [
    { day: "Mon", completed: true },
    { day: "Tue", completed: true },
    { day: "Wed", completed: true },
    { day: "Thu", completed: true },
    { day: "Fri", completed: true },
    { day: "Sat", completed: true },
    { day: "Sun", completed: isCompleted }, // Today
  ];
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background/90 to-slate-950/90 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading daily challenge...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background/90 to-slate-950/90">
      <DashboardNav />
      
      <div className="container mx-auto max-w-6xl px-4 pt-24 pb-16">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-blue-400 to-purple-400 bg-clip-text text-transparent pb-2">
            Daily Interview Challenge
          </h1>
          <p className="text-xl text-muted-foreground">
            Complete daily challenges to improve skills and build consistency
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="today" className="w-full">
              <TabsList className="bg-slate-900/50 mb-6">
                <TabsTrigger value="today">Today's Challenge</TabsTrigger>
                <TabsTrigger value="history">Challenge History</TabsTrigger>
                <TabsTrigger value="rewards">Rewards</TabsTrigger>
              </TabsList>
              
              <TabsContent value="today" className="space-y-8">
                <Card className="bg-gradient-to-br from-indigo-950/70 to-slate-900/90 backdrop-blur-md border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge 
                        className={challenge?.type === 'system-design' 
                          ? 'bg-blue-600/30 text-blue-400 border-blue-500/30' 
                          : 'bg-emerald-600/30 text-emerald-400 border-emerald-500/30'
                        }
                      >
                        {challenge?.type === 'system-design' ? 'System Design' : 'Algorithm'}
                      </Badge>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                      </div>
                    </div>
                    <CardTitle className="text-2xl">{challenge?.title}</CardTitle>
                    <CardDescription>
                      Complete this challenge to maintain your streak and earn points
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-6 bg-slate-900/70 rounded-lg border border-slate-800/50">
                      <h3 className="font-medium mb-3">Problem Statement</h3>
                      <p className="text-muted-foreground">{challenge?.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-900/50 rounded-lg">
                        <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <span>Estimated Time</span>
                        </h3>
                        <p className="text-muted-foreground">45 minutes</p>
                      </div>
                      
                      <div className="p-4 bg-slate-900/50 rounded-lg">
                        <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Medal className="h-4 w-4 text-amber-400" />
                          <span>Difficulty</span>
                        </h3>
                        <p className="text-muted-foreground">Intermediate</p>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-slate-900/70 rounded-lg border border-slate-800/50">
                      <h3 className="text-sm font-medium mb-3">Tips</h3>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Consider scalability requirements</li>
                        <li>Think about notification delivery guarantees</li>
                        <li>Plan for handling different notification types</li>
                        <li>Consider user preferences and settings</li>
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className={`w-full ${
                        isCompleted 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-gradient-to-r from-primary to-blue-500 hover:from-primary/80 hover:to-blue-600'
                      }`}
                      onClick={handleCompleteChallenge}
                      disabled={isCompleted || completing}
                    >
                      {isCompleted ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Completed
                        </>
                      ) : completing ? (
                        "Marking as complete..."
                      ) : (
                        "Mark as Complete"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="bg-gradient-to-br from-indigo-950/70 to-slate-900/90 backdrop-blur-md border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Related Resources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-slate-900/50 rounded-lg flex items-center gap-3">
                        <div className="bg-primary/20 p-2 rounded">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-medium">System Design Interview Guide</h3>
                          <p className="text-xs text-muted-foreground">Comprehensive overview of notification systems</p>
                        </div>
                        <Button size="sm" variant="outline">View</Button>
                      </div>
                      
                      <div className="p-3 bg-slate-900/50 rounded-lg flex items-center gap-3">
                        <div className="bg-blue-500/20 p-2 rounded">
                          <BookOpen className="h-5 w-5 text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-medium">Designing Data-Intensive Applications</h3>
                          <p className="text-xs text-muted-foreground">Chapter on messaging systems and event streaming</p>
                        </div>
                        <Button size="sm" variant="outline">View</Button>
                      </div>
                      
                      <div className="p-3 bg-slate-900/50 rounded-lg flex items-center gap-3">
                        <div className="bg-emerald-500/20 p-2 rounded">
                          <BookOpen className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-medium">Notification System Implementation</h3>
                          <p className="text-xs text-muted-foreground">Real-world case study with example architecture</p>
                        </div>
                        <Button size="sm" variant="outline">View</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="history" className="space-y-6">
                <Card className="bg-gradient-to-br from-indigo-950/70 to-slate-900/90 backdrop-blur-md border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Challenge History</CardTitle>
                    <CardDescription>
                      Your past challenges and completion status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-900/70 rounded-lg flex items-center gap-3">
                        <div className="bg-slate-800 p-3 rounded-lg w-14 h-14 flex items-center justify-center">
                          <span className="text-xs">May 2</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">
                            Two-Sum Algorithm Challenge
                            <Badge className="bg-emerald-600/30 text-emerald-400 ml-2">Algorithm</Badge>
                          </h3>
                          <p className="text-xs text-muted-foreground">Find pairs that sum to target value</p>
                        </div>
                        <Button variant="outline" className="border-green-500/30 text-green-500" size="sm">
                          <Check className="h-4 w-4 mr-2" />
                          Completed
                        </Button>
                      </div>
                      
                      <div className="p-4 bg-slate-900/70 rounded-lg flex items-center gap-3">
                        <div className="bg-slate-800 p-3 rounded-lg w-14 h-14 flex items-center justify-center">
                          <span className="text-xs">May 1</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">
                            URL Shortener Design
                            <Badge className="bg-blue-600/30 text-blue-400 ml-2">System Design</Badge>
                          </h3>
                          <p className="text-xs text-muted-foreground">Design a scalable URL shortening service</p>
                        </div>
                        <Button variant="outline" className="border-green-500/30 text-green-500" size="sm">
                          <Check className="h-4 w-4 mr-2" />
                          Completed
                        </Button>
                      </div>
                      
                      <div className="p-4 bg-slate-900/70 rounded-lg flex items-center gap-3">
                        <div className="bg-slate-800 p-3 rounded-lg w-14 h-14 flex items-center justify-center">
                          <span className="text-xs">Apr 30</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">
                            Binary Tree Traversal
                            <Badge className="bg-emerald-600/30 text-emerald-400 ml-2">Algorithm</Badge>
                          </h3>
                          <p className="text-xs text-muted-foreground">Implement in-order, pre-order, and post-order traversal</p>
                        </div>
                        <Button variant="outline" className="border-green-500/30 text-green-500" size="sm">
                          <Check className="h-4 w-4 mr-2" />
                          Completed
                        </Button>
                      </div>
                      
                      <div className="p-4 bg-slate-900/70 rounded-lg flex items-center gap-3">
                        <div className="bg-slate-800 p-3 rounded-lg w-14 h-14 flex items-center justify-center">
                          <span className="text-xs">Apr 29</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">
                            Distributed Cache System
                            <Badge className="bg-blue-600/30 text-blue-400 ml-2">System Design</Badge>
                          </h3>
                          <p className="text-xs text-muted-foreground">Design a distributed caching system</p>
                        </div>
                        <Button variant="outline" className="border-red-500/30 text-red-500" size="sm">
                          Missed
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="rewards" className="space-y-6">
                <Card className="bg-gradient-to-br from-indigo-950/70 to-slate-900/90 backdrop-blur-md border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Challenge Rewards</CardTitle>
                    <CardDescription>
                      Earn points and unlock achievements by completing daily challenges
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="p-4 bg-slate-900/50 rounded-lg">
                        <h3 className="text-lg font-medium mb-3">How It Works</h3>
                        <ul className="space-y-3 text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <div className="bg-primary/20 p-1 rounded mt-0.5">
                              <Check className="h-4 w-4 text-primary" />
                            </div>
                            <span><strong>Daily Completion:</strong> Earn 50 points each day you complete a challenge</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="bg-primary/20 p-1 rounded mt-0.5">
                              <Check className="h-4 w-4 text-primary" />
                            </div>
                            <span><strong>Streak Bonus:</strong> Each 7-day streak earns a 100 point bonus</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="bg-primary/20 p-1 rounded mt-0.5">
                              <Check className="h-4 w-4 text-primary" />
                            </div>
                            <span><strong>Monthly Reward:</strong> Complete 25+ challenges in a month for exclusive badges</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Milestone Rewards</h3>
                        
                        <div className="p-4 bg-amber-900/20 border border-amber-700/30 rounded-lg flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="bg-amber-500/20 p-2 rounded-lg">
                              <Trophy className="h-6 w-6 text-amber-400" />
                            </div>
                            <div>
                              <h4 className="font-medium">7-Day Streak</h4>
                              <p className="text-xs text-muted-foreground">Complete 7 consecutive daily challenges</p>
                            </div>
                          </div>
                          <Badge className="bg-amber-500/30 text-amber-300">
                            +100 Points
                          </Badge>
                        </div>
                        
                        <div className="p-4 bg-violet-900/20 border border-violet-700/30 rounded-lg flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="bg-violet-500/20 p-2 rounded-lg">
                              <Trophy className="h-6 w-6 text-violet-400" />
                            </div>
                            <div>
                              <h4 className="font-medium">30-Day Perfect Month</h4>
                              <p className="text-xs text-muted-foreground">Complete every challenge for a full month</p>
                            </div>
                          </div>
                          <Badge className="bg-violet-500/30 text-violet-300">
                            +500 Points
                          </Badge>
                        </div>
                        
                        <div className="p-4 bg-blue-900/20 border border-blue-700/30 rounded-lg flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-500/20 p-2 rounded-lg">
                              <Trophy className="h-6 w-6 text-blue-400" />
                            </div>
                            <div>
                              <h4 className="font-medium">100 Challenges Completed</h4>
                              <p className="text-xs text-muted-foreground">Complete 100 daily challenges total</p>
                            </div>
                          </div>
                          <Badge className="bg-blue-500/30 text-blue-300">
                            Exclusive Badge
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-indigo-950/70 to-slate-900/90 backdrop-blur-md border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  <span>Daily Streak</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-7 gap-2">
                  {weekData.map((item, index) => (
                    <motion.div 
                      key={index}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg ${
                        item.completed 
                          ? "bg-primary/20 border border-primary/30" 
                          : "bg-slate-800/50 border border-slate-700/30"
                      }`}
                    >
                      <div className="text-sm font-medium">{item.day}</div>
                      <div className="mt-1">
                        {item.completed ? (
                          <Star className="h-5 w-5 text-primary fill-primary" />
                        ) : (
                          <Star className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-slate-900/50">
                    <div className="text-3xl font-bold text-primary">{userProfile?.streak || 0}</div>
                    <div className="text-sm text-muted-foreground">Current Streak</div>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-slate-900/50">
                    <div className="text-3xl font-bold">{userProfile?.streak || 0}</div>
                    <div className="text-sm text-muted-foreground">Longest Streak</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link to="/community" className="w-full">
                  <Button variant="outline" className="w-full">
                    View Community Streaks
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            
            <Card className="bg-gradient-to-br from-indigo-950/70 to-slate-900/90 backdrop-blur-md border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Progress Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Weekly Completion</span>
                    <span className="text-sm font-medium">6/7 days</span>
                  </div>
                  <Progress value={86} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Monthly Completion</span>
                    <span className="text-sm font-medium">22/30 days</span>
                  </div>
                  <Progress value={73} className="h-2" />
                </div>
                
                <div className="p-4 bg-slate-900/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Total Points Earned</span>
                    <span className="font-medium text-primary">{userProfile?.points || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>From daily challenges</span>
                    <span>+50 today</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyChallengePage;
