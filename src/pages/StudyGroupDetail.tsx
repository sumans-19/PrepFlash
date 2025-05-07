
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  Users, Calendar, Clock, Plus, Send, 
  FileText, Link as LinkIcon, ExternalLink, User 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { toast } from "@/hooks/use-toast";
import { StudyGroup, User as UserType } from "@/types/models";
import { getStudyGroup, joinStudyGroup, leaveStudyGroup, getUserProfile } from "@/lib/firestore";
import { auth } from "@/lib/firebase";
import { DashboardNav } from "@/components/DashboardNav";

const StudyGroupDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [group, setGroup] = useState<StudyGroup | null>(null);
  const [members, setMembers] = useState<UserType[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [leaving, setLeaving] = useState(false);
  
  const userId = auth.currentUser?.uid;
  const isMember = group?.members.includes(userId || "");
  const isCreator = group?.creatorId === userId;
  const isFull = group ? group.members.length >= group.capacity : false;
  
  useEffect(() => {
    const fetchGroupData = async () => {
      if (!id) return;
      
      try {
        const groupData = await getStudyGroup(id);
        setGroup(groupData);
        
        // Fetch all member profiles
        const memberProfiles = await Promise.all(
          groupData.members.map(async (memberId) => {
            try {
              return await getUserProfile(memberId);
            } catch (error) {
              console.error(`Error fetching member ${memberId}:`, error);
              // Return a placeholder user if profile fetch fails
              return {
                id: memberId,
                name: "Unknown User",
                email: "",
                points: 0,
                streak: 0,
                solved: 0,
                createdAt: new Date(),
                joinedGroups: [],
                achievements: []
              };
            }
          })
        );
        
        setMembers(memberProfiles);
      } catch (error) {
        console.error("Error fetching study group:", error);
        toast({
          title: "Error",
          description: "Failed to load study group details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchGroupData();
  }, [id]);
  
  const handleJoin = async () => {
    if (!id || !userId) return;
    
    setJoining(true);
    try {
      await joinStudyGroup(id, userId);
      
      // Update local state
      if (group) {
        const updatedGroup = { ...group };
        updatedGroup.members = [...updatedGroup.members, userId];
        setGroup(updatedGroup);
        
        // Add current user to members list
        const currentUser = auth.currentUser;
        if (currentUser) {
          const newMember: UserType = {
            id: currentUser.uid,
            name: currentUser.displayName || "Anonymous",
            email: currentUser.email || "",
            avatar: currentUser.photoURL || undefined,
            points: 0,
            streak: 0,
            solved: 0,
            createdAt: new Date(),
            joinedGroups: [id],
            achievements: []
          };
          setMembers([...members, newMember]);
        }
      }
      
      toast({
        title: "Success",
        description: "You've joined the study group!"
      });
    } catch (error) {
      console.error("Error joining group:", error);
      toast({
        title: "Error",
        description: "Failed to join the study group",
        variant: "destructive"
      });
    } finally {
      setJoining(false);
    }
  };
  
  const handleLeave = async () => {
    if (!id || !userId) return;
    
    setLeaving(true);
    try {
      await leaveStudyGroup(id, userId);
      
      // Update local state
      if (group) {
        const updatedGroup = { ...group };
        updatedGroup.members = updatedGroup.members.filter(m => m !== userId);
        setGroup(updatedGroup);
        setMembers(members.filter(m => m.id !== userId));
      }
      
      toast({
        title: "Success",
        description: "You've left the study group"
      });
    } catch (error) {
      console.error("Error leaving group:", error);
      toast({
        title: "Error",
        description: "Failed to leave the study group",
        variant: "destructive"
      });
    } finally {
      setLeaving(false);
    }
  };
  
  const handleMessageSend = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // In a real app, this would send the message to Firestore
    toast({
      title: "Message sent",
      description: "Group chat functionality coming soon"
    });
    
    setMessage("");
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background/90 to-slate-950/90 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading study group details...</p>
        </div>
      </div>
    );
  }
  
  if (!group) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background/90 to-slate-950/90 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Study Group Not Found</h1>
        <p className="text-muted-foreground mb-6">The study group you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate("/community")}>
          Back to Community
        </Button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background/90 to-slate-950/90">
      <DashboardNav />
      
      <div className="container mx-auto max-w-6xl px-4 pt-24 pb-16">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/community" className="text-muted-foreground hover:text-primary transition-colors">
              Community
            </Link>
            <span className="text-muted-foreground">/</span>
            <span>Study Group</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-blue-400 to-purple-400 bg-clip-text text-transparent pb-1">
                {group.name}
              </h1>
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{group.members.length}/{group.capacity} members</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{group.meetingDay}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{group.meetingTime}</span>
                </div>
              </div>
            </div>
            
            {!isCreator && (
              <div>
                {isMember ? (
                  <Button 
                    onClick={handleLeave}
                    variant="outline"
                    className="border-red-500/50 hover:bg-red-500/10 text-red-400"
                    disabled={leaving}
                  >
                    {leaving ? "Leaving..." : "Leave Group"}
                  </Button>
                ) : (
                  <Button 
                    onClick={handleJoin}
                    className="bg-gradient-to-r from-primary to-blue-500 hover:from-primary/80 hover:to-blue-600"
                    disabled={joining || isFull}
                  >
                    {joining ? "Joining..." : isFull ? "Group Full" : "Join Group"}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="bg-slate-900/50 mb-6">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="discussions">Discussions</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="meetings">Meetings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="space-y-6">
                <Card className="bg-gradient-to-br from-indigo-950/70 to-slate-900/90 backdrop-blur-md border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>About this group</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Description</h3>
                        <p className="text-muted-foreground">{group.description}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Focus Area</h3>
                        <Badge variant="outline" className="bg-slate-800 text-primary">
                          {group.focus}
                        </Badge>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Meeting Schedule</h3>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-primary" />
                          <span>{group.meetingDay}s at {group.meetingTime}</span>
                        </div>
                        {group.meetingLink && (
                          <a 
                            href={group.meetingLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 mt-2 text-primary hover:underline"
                          >
                            <LinkIcon className="h-4 w-4" />
                            <span>Meeting Link</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-indigo-950/70 to-slate-900/90 backdrop-blur-md border-0 shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle>Group Progress</CardTitle>
                    <CardDescription>Track your group's collaborative achievements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">Problems Solved</span>
                          <span className="text-sm font-medium">12/50</span>
                        </div>
                        <Progress value={24} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">Mock Interviews Completed</span>
                          <span className="text-sm font-medium">8/20</span>
                        </div>
                        <Progress value={40} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">Meeting Attendance</span>
                          <span className="text-sm font-medium">90%</span>
                        </div>
                        <Progress value={90} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="discussions">
                <Card className="bg-gradient-to-br from-indigo-950/70 to-slate-900/90 backdrop-blur-md border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Group Discussion</CardTitle>
                    <CardDescription>Chat with your study group members</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px] bg-slate-900/50 rounded-md p-4 flex flex-col">
                      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                        <div className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="https://i.pravatar.cc/150?img=1" />
                            <AvatarFallback>AJ</AvatarFallback>
                          </Avatar>
                          <div className="bg-slate-800 rounded-lg p-3 max-w-[80%]">
                            <div className="text-sm font-medium">Alex Johnson</div>
                            <div className="text-sm text-muted-foreground">
                              Hey everyone! What topic should we focus on for our next meeting?
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              2 hours ago
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="https://i.pravatar.cc/150?img=2" />
                            <AvatarFallback>JS</AvatarFallback>
                          </Avatar>
                          <div className="bg-slate-800 rounded-lg p-3 max-w-[80%]">
                            <div className="text-sm font-medium">Jamie Smith</div>
                            <div className="text-sm text-muted-foreground">
                              I'd like to go over system design patterns. I have an interview coming up next week.
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              1 hour ago
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="https://i.pravatar.cc/150?img=3" />
                            <AvatarFallback>TK</AvatarFallback>
                          </Avatar>
                          <div className="bg-slate-800 rounded-lg p-3 max-w-[80%]">
                            <div className="text-sm font-medium">Taylor Kim</div>
                            <div className="text-sm text-muted-foreground">
                              Sounds good to me. We could specifically look at designing a distributed cache system.
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              30 minutes ago
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <form onSubmit={handleMessageSend} className="flex gap-2">
                        <Input 
                          placeholder="Type your message..." 
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="bg-slate-800"
                        />
                        <Button type="submit">
                          <Send className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="resources">
                <Card className="bg-gradient-to-br from-indigo-950/70 to-slate-900/90 backdrop-blur-md border-0 shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Shared Resources</CardTitle>
                      <CardDescription>Study materials shared by group members</CardDescription>
                    </div>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Resource
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Sample resources */}
                      <div className="p-3 bg-slate-900/70 rounded-lg flex items-center gap-3">
                        <div className="bg-primary/20 p-2 rounded">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-medium">System Design Interview Guide</h3>
                          <p className="text-xs text-muted-foreground">Shared by Alex Johnson • PDF</p>
                        </div>
                        <Button size="sm" variant="ghost">
                          <LinkIcon className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="p-3 bg-slate-900/70 rounded-lg flex items-center gap-3">
                        <div className="bg-blue-500/20 p-2 rounded">
                          <FileText className="h-5 w-5 text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-medium">Distributed Systems Cheatsheet</h3>
                          <p className="text-xs text-muted-foreground">Shared by Taylor Kim • Google Doc</p>
                        </div>
                        <Button size="sm" variant="ghost">
                          <LinkIcon className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="p-3 bg-slate-900/70 rounded-lg flex items-center gap-3">
                        <div className="bg-green-500/20 p-2 rounded">
                          <FileText className="h-5 w-5 text-green-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-medium">Common System Design Patterns</h3>
                          <p className="text-xs text-muted-foreground">Shared by Jamie Smith • Slides</p>
                        </div>
                        <Button size="sm" variant="ghost">
                          <LinkIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="meetings">
                <Card className="bg-gradient-to-br from-indigo-950/70 to-slate-900/90 backdrop-blur-md border-0 shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Upcoming Meetings</CardTitle>
                      <CardDescription>Schedule for upcoming study sessions</CardDescription>
                    </div>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule Meeting
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-900/70 rounded-lg border border-primary/30">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">System Design: Distributed Cache</h3>
                          <Badge className="bg-primary/20 text-primary">Next Meeting</Badge>
                        </div>
                        <div className="mb-2 text-muted-foreground">
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="h-4 w-4" />
                            <span>Wednesday, May 10, 2025</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{group.meetingTime}</span>
                          </div>
                        </div>
                        {group.meetingLink && (
                          <a 
                            href={group.meetingLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mt-2 text-primary hover:underline"
                          >
                            <LinkIcon className="h-4 w-4" />
                            <span>Join Meeting</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                      
                      <div className="p-4 bg-slate-900/70 rounded-lg">
                        <h3 className="font-medium mb-2">Algorithm Practice: Dynamic Programming</h3>
                        <div className="mb-2 text-muted-foreground">
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="h-4 w-4" />
                            <span>Wednesday, May 17, 2025</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{group.meetingTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-indigo-950/70 to-slate-900/90 backdrop-blur-md border-0 shadow-lg mt-6">
                  <CardHeader>
                    <CardTitle>Past Meetings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-slate-900/50 rounded-lg flex items-center gap-3">
                        <div className="bg-slate-800 p-2 rounded">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-medium">Introduction & Goal Setting</h3>
                          <p className="text-xs text-muted-foreground">May 3, 2025 • 8 participants</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          First Meeting
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-indigo-950/70 to-slate-900/90 backdrop-blur-md border-0 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span>Members</span>
                  </div>
                  <Badge variant="outline" className="bg-slate-800 text-xs">
                    {group.members.length}/{group.capacity}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-blue-500"
                      style={{ width: `${(group.members.length / group.capacity) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {members.map(member => (
                    <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/50">
                      <Avatar className="h-8 w-8">
                        {member.avatar ? (
                          <AvatarImage src={member.avatar} />
                        ) : (
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{member.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {member.id === group.creatorId && (
                            <Badge variant="outline" className="text-xs bg-primary/20 text-primary">
                              Creator
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-indigo-950/70 to-slate-900/90 backdrop-blur-md border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Next Meeting</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">System Design: Distributed Cache</h3>
                  <div className="text-muted-foreground mt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-4 w-4" />
                      <span>Wednesday, May 10, 2025</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{group.meetingTime}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Preparation</h3>
                  <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                    <li>Review distributed caching strategies</li>
                    <li>Read the shared System Design guide</li>
                    <li>Prepare questions for discussion</li>
                  </ul>
                </div>
                
                {group.meetingLink && (
                  <Button 
                    asChild
                    className="w-full bg-gradient-to-r from-primary to-blue-500"
                  >
                    <a 
                      href={group.meetingLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Join Meeting
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyGroupDetail;
