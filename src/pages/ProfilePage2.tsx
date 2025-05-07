
import React, { useState, useEffect } from "react";
import { 
  UserCircle2, Settings, Trophy, CalendarDays, 
  Award, BookOpen, Star, Edit, LogOut,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { getUserProfile } from "@/lib/firestore";
import { auth } from "@/lib/firebase";
import { DashboardNav } from "@/components/DashboardNav";

const ProfilePage = () => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const currentUser = auth.currentUser;
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      
      try {
        // For the purpose of this demo, we'll use a mock profile if we don't have one in firestore
        let profile;
        try {
          profile = await getUserProfile(currentUser.uid);
        } catch (error) {
          // Use mock data if profile doesn't exist
          profile = {
            id: currentUser.uid,
            name: currentUser.displayName || "Anonymous User",
            email: currentUser.email,
            avatar: currentUser.photoURL,
            points: 1250,
            streak: 7,
            solved: 45,
            createdAt: new Date(),
            joinedGroups: [],
            achievements: [
              {
                id: "1",
                title: "Problem Solver",
                description: "Solved 50 practice problems",
                icon: "🏆",
                progress: 100,
                completed: true,
                date: "2 days ago"
              },
              {
                id: "2",
                title: "Consistency Champion",
                description: "Maintained a 10-day streak",
                icon: "🔥",
                progress: 70,
                completed: false,
                current: 7,
                target: 10
              }
            ]
          };
        }
        
        setUserProfile(profile);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load user profile",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [currentUser]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background/90 to-slate-950/90 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }
  
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background/90 to-slate-950/90 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
        <p className="text-muted-foreground mb-6">Please sign in to view your profile</p>
        <Button onClick={() => window.location.href = "/auth"}>
          Sign In
        </Button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background/90 to-slate-950/90">
      <DashboardNav />
      
      <div className="container mx-auto max-w-6xl px-4 pt-24 pb-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24 border-4 border-slate-700/40">
              {userProfile?.avatar ? (
                <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
              ) : (
                <AvatarFallback className="text-4xl">
                  <UserCircle2 className="h-14 w-14" />
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-blue-400 to-purple-400 bg-clip-text text-transparent pb-1">
                {userProfile?.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                  {userProfile?.points} Points
                </Badge>
                <div className="flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  <span>{userProfile?.streak}-day streak</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{userProfile?.solved} problems solved</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              <span>Edit Profile</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-slate-900/50 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="studygroups">Study Groups</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-indigo-950/70 to-slate-900/90 backdrop-blur-md border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-400" />
                    <span>Progress Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Algorithms</span>
                      <span className="text-sm font-medium">28/50</span>
                    </div>
                    <Progress value={56} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">System Design</span>
                      <span className="text-sm font-medium">14/30</span>
                    </div>
                    <Progress value={47} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Behavioral</span>
                      <span className="text-sm font-medium">8/20</span>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-indigo-950/70 to-slate-900/90 backdrop-blur-md border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-primary" />
                    <span>Daily Streak</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <div className="text-5xl font-bold text-primary mb-2">{userProfile?.streak}</div>
                    <div className="text-muted-foreground mb-4">Days in a row</div>
                    
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-blue-500"
                        style={{ width: `${Math.min((userProfile?.streak / 30) * 100, 100)}%` }}
                      />
                    </div>
                    <div className="w-full flex justify-between mt-1 text-xs text-muted-foreground">
                      <span>0</span>
                      <span>30 days</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    variant="outline"
                    onClick={() => window.location.href = "/daily-challenge"}
                  >
                    View Daily Challenge
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="bg-gradient-to-br from-indigo-950/70 to-slate-900/90 backdrop-blur-md border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-amber-400" />
                    <span>Recent Achievements</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userProfile?.achievements
                      .filter((a: any) => a.completed)
                      .slice(0, 2)
                      .map((achievement: any) => (
                        <div
                          key={achievement.id}
                          className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg border border-amber-500/20"
                        >
                          <div className="text-2xl">{achievement.icon}</div>
                          <div className="flex-1">
                            <div className="font-medium">{achievement.title}</div>
                            <div className="text-xs text-muted-foreground flex justify-between">
                              <span>{achievement.description}</span>
                              <span>{achievement.date}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    
                    {userProfile?.achievements
                      .filter((a: any) => !a.completed)
                      .slice(0, 1)
                      .map((achievement: any) => (
                        <div
                          key={achievement.id}
                          className="p-3 bg-slate-900/50 rounded-lg border border-slate-800/50"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className="text-2xl">{achievement.icon}</div>
                            <div className="flex-1">
                              <div className="font-medium">{achievement.title}</div>
                              <div className="text-xs text-muted-foreground">
                                {achievement.description}
                              </div>
                            </div>
                            <div className="text-sm font-medium">
                              {achievement.current}/{achievement.target}
                            </div>
                          </div>
                          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-500 to-blue-500"
                              style={{ width: `${achievement.progress}%` }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    variant="outline"
                    onClick={() => {}}
                  >
                    View All Achievements
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-indigo-950/70 to-slate-900/90 backdrop-blur-md border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-slate-900/50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-primary" />
                          <span className="font-medium">Completed Daily Challenge</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Today
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Earned 50 points and increased streak to {userProfile?.streak} days
                      </p>
                    </div>
                    
                    <div className="p-3 bg-slate-900/50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-blue-400" />
                          <span className="font-medium">Solved Algorithm Problem</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Yesterday
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Completed "Two Sum" problem in O(n) time complexity
                      </p>
                    </div>
                    
                    <div className="p-3 bg-slate-900/50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-amber-400" />
                          <span className="font-medium">Earned Achievement</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          2 days ago
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Unlocked "Problem Solver" achievement for solving 50 problems
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-indigo-950/70 to-slate-900/90 backdrop-blur-md border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>My Study Groups</CardTitle>
                </CardHeader>
                <CardContent>
                  {userProfile?.joinedGroups?.length ? (
                    <div className="space-y-4">
                      <div className="p-3 bg-slate-900/50 rounded-lg">
                        <h3 className="font-medium mb-1">Algorithm Wizards</h3>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <CalendarDays className="h-3.5 w-3.5" />
                            <span>Tuesdays at 6:30 PM</span>
                          </div>
                          <Badge variant="outline" className="text-xs bg-slate-800">
                            12 members
                          </Badge>
                        </div>
                      </div>
                      <div className="p-3 bg-slate-900/50 rounded-lg">
                        <h3 className="font-medium mb-1">System Design Masters</h3>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <CalendarDays className="h-3.5 w-3.5" />
                            <span>Wednesdays at 7:00 PM</span>
                          </div>
                          <Badge variant="outline" className="text-xs bg-slate-800">
                            16 members
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground mb-4">You haven't joined any study groups yet.</p>
                      <Button onClick={() => window.location.href = "/community"}>
                        Explore Study Groups
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="achievements">
            <Card className="bg-gradient-to-br from-indigo-950/70 to-slate-900/90 backdrop-blur-md border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-400" />
                  <span>Achievements</span>
                </CardTitle>
                <CardDescription>
                  Track your progress and earn badges as you prepare for interviews
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="earned">
                  <TabsList className="bg-slate-900/50 mb-6">
                    <TabsTrigger value="earned">Earned</TabsTrigger>
                    <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                    <TabsTrigger value="locked">Locked</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="earned" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-4 bg-slate-900/50 rounded-lg border border-amber-500/20">
                        <div className="text-3xl">🏆</div>
                        <div className="flex-1">
                          <div className="font-medium">Problem Solver</div>
                          <div className="text-sm text-muted-foreground">
                            Solved 50 practice problems
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Earned 2 days ago
                          </div>
                        </div>
                        <Badge className="bg-amber-500/20 text-amber-300 border-amber-400/30">
                          Earned
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-3 p-4 bg-slate-900/50 rounded-lg border border-amber-500/20">
                        <div className="text-3xl">🤝</div>
                        <div className="flex-1">
                          <div className="font-medium">Community Contributor</div>
                          <div className="text-sm text-muted-foreground">
                            Created first forum discussion
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Earned 4 days ago
                          </div>
                        </div>
                        <Badge className="bg-amber-500/20 text-amber-300 border-amber-400/30">
                          Earned
                        </Badge>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="in-progress" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-800/50">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="text-3xl">🔥</div>
                          <div className="flex-1">
                            <div className="font-medium">Consistency Champion</div>
                            <div className="text-sm text-muted-foreground">
                              Maintained a 10-day streak
                            </div>
                          </div>
                          <div className="text-sm font-medium">
                            7/10
                          </div>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-blue-500"
                            style={{ width: '70%' }}
                          />
                        </div>
                      </div>
                      
                      <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-800/50">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="text-3xl">🧠</div>
                          <div className="flex-1">
                            <div className="font-medium">Algorithm Expert</div>
                            <div className="text-sm text-muted-foreground">
                              Master all algorithm categories
                            </div>
                          </div>
                          <div className="text-sm font-medium">
                            2/8
                          </div>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-blue-500"
                            style={{ width: '25%' }}
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="locked" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-4 bg-slate-900/30 rounded-lg border border-slate-800/30 opacity-70">
                        <div className="text-3xl">🎯</div>
                        <div className="flex-1">
                          <div className="font-medium">Mock Interview Master</div>
                          <div className="text-sm text-muted-foreground">
                            Complete 10 mock interviews
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Locked
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-3 p-4 bg-slate-900/30 rounded-lg border border-slate-800/30 opacity-70">
                        <div className="text-3xl">👨‍👩‍👧‍👦</div>
                        <div className="flex-1">
                          <div className="font-medium">Group Leader</div>
                          <div className="text-sm text-muted-foreground">
                            Create and lead a study group
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Locked
                        </Badge>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="activity">
            <Card className="bg-gradient-to-br from-indigo-950/70 to-slate-900/90 backdrop-blur-md border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Activity History</CardTitle>
                <CardDescription>
                  Track your learning journey and progress over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div>
                    <h3 className="font-medium mb-4 text-muted-foreground">Today</h3>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="bg-primary/20 p-2 h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                          <CalendarDays className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 pb-4 border-b border-slate-800">
                          <h4 className="font-medium">Completed Daily Challenge</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            System Design: Notification System
                          </p>
                          <div className="text-xs text-muted-foreground mt-2">
                            +50 points • Today at 10:23 AM
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-4 text-muted-foreground">Yesterday</h3>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="bg-blue-500/20 p-2 h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                          <BookOpen className="h-5 w-5 text-blue-400" />
                        </div>
                        <div className="flex-1 pb-4 border-b border-slate-800">
                          <h4 className="font-medium">Solved Algorithm Problem</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Two Sum (Easy)
                          </p>
                          <div className="text-xs text-muted-foreground mt-2">
                            +25 points • Yesterday at 7:45 PM
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        <div className="bg-primary/20 p-2 h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                          <CalendarDays className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 pb-4 border-b border-slate-800">
                          <h4 className="font-medium">Completed Daily Challenge</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            URLShortener System Design
                          </p>
                          <div className="text-xs text-muted-foreground mt-2">
                            +50 points • Yesterday at 9:15 AM
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-4 text-muted-foreground">May 1, 2025</h3>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="bg-amber-500/20 p-2 h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                          <Award className="h-5 w-5 text-amber-400" />
                        </div>
                        <div className="flex-1 pb-4 border-b border-slate-800">
                          <h4 className="font-medium">Earned Achievement</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Problem Solver - Solved 50 practice problems
                          </p>
                          <div className="text-xs text-muted-foreground mt-2">
                            +100 points • May 1 at 5:30 PM
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        <div className="bg-primary/20 p-2 h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                          <CalendarDays className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 pb-4 border-b border-slate-800">
                          <h4 className="font-medium">Completed Daily Challenge</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Binary Tree Traversal
                          </p>
                          <div className="text-xs text-muted-foreground mt-2">
                            +50 points • May 1 at 10:45 AM
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View Full Activity Log
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="studygroups">
            <Card className="bg-gradient-to-br from-indigo-950/70 to-slate-900/90 backdrop-blur-md border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>My Study Groups</CardTitle>
                  <CardDescription>
                    Groups you've joined or created
                  </CardDescription>
                </div>
                <Button onClick={() => window.location.href = "/study-groups/create"}>
                  Create New Group
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-800/50">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-medium">Algorithm Wizards</h3>
                      <Badge className="bg-emerald-600/30 text-emerald-300">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between mb-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        <span>Tuesdays at 6:30 PM</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>12/15 members</span>
                      </div>
                    </div>
                    <Separator className="mb-3 bg-slate-800/50" />
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        Next meeting: May 9, 2025
                      </div>
                      <Button variant="outline" size="sm" onClick={() => window.location.href = "/study-groups/1"}>
                        View Group
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-800/50">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-medium">System Design Masters</h3>
                      <Badge className="bg-blue-600/30 text-blue-300">Creator</Badge>
                    </div>
                    <div className="flex items-center justify-between mb-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        <span>Wednesdays at 7:00 PM</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>16/20 members</span>
                      </div>
                    </div>
                    <Separator className="mb-3 bg-slate-800/50" />
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        Next meeting: May 10, 2025
                      </div>
                      <Button variant="outline" size="sm" onClick={() => window.location.href = "/study-groups/2"}>
                        View Group
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
