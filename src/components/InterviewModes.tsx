import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Mic, 
  Video, 
  Play, 
  Pause, 
  SkipBack,
  SkipForward,
  Settings, 
  ChevronRight, 
  ArrowRight, 
  CheckCircle2,
  Brain
} from "lucide-react";
import { Link } from "react-router-dom";

export const InterviewModes = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [animatedContent, setAnimatedContent] = useState(true);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  useEffect(() => {
    setAnimatedContent(false);
    const timer = setTimeout(() => {
      setAnimatedContent(true);
    }, 50);
    return () => clearTimeout(timer);
  }, [activeTab]);
  
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 bg-prep-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-prep-accent/10 rounded-full blur-3xl"></div>
        </div>

        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 px-3 py-1 border-prep-accent/30 bg-prep-accent/5">
            <Brain className="mr-1 h-3.5 w-3" /> Interview Technology
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 animate-text-pulse">
            Personalized Interview Experiences
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Choose your comfort level and gradually build confidence with our adaptive interview formats.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Tabs 
            defaultValue="chat"
            value={activeTab}
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <div className="flex items-center justify-center mb-8">
              <TabsList className="grid grid-cols-3 p-1 w-full max-w-md bg-muted/50 backdrop-blur-sm">
                <TabsTrigger 
                  value="chat" 
                  onClick={() => setActiveTab("chat")}
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-prep-primary data-[state=active]:to-prep-secondary data-[state=active]:text-white transition-all duration-300"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">Text</span> Chat
                </TabsTrigger>
                <TabsTrigger 
                  value="audio"
                  onClick={() => setActiveTab("audio")}
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-prep-coral data-[state=active]:to-prep-accent data-[state=active]:text-white transition-all duration-300"
                >
                  <Mic className="h-4 w-4" />
                  <span className="hidden sm:inline">Voice</span> Audio
                </TabsTrigger>
                <TabsTrigger 
                  value="video"
                  onClick={() => setActiveTab("video")}
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-prep-aqua data-[state=active]:to-prep-accent data-[state=active]:text-white transition-all duration-300"
                >
                  <Video className="h-4 w-4" />
                  <span className="hidden sm:inline">Live</span> Video
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="relative mt-4">
              <TabsContent value="chat" className={`border-0 p-0 mt-0 ${animatedContent ? 'animate-fade-in' : 'opacity-0'}`}>
                <Card className="overflow-hidden border shadow-lg dark:shadow-inner hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-r from-prep-primary/10 via-transparent to-transparent p-4 border-b flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-medium flex items-center">
                        <MessageSquare className="mr-2 h-5 w-5 text-prep-primary" />
                        Text-based Interview
                      </h3>
                      <p className="text-sm text-muted-foreground">Perfect for beginners and preparation</p>
                    </div>
                    <Badge variant="outline" className="bg-prep-primary/5 text-prep-primary border-prep-primary/20">
                      Beginner Friendly
                    </Badge>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-prep-primary to-prep-secondary flex-shrink-0 flex items-center justify-center text-white font-medium">AI</div>
                        <div className="max-w-[80%]">
                          <div className="bg-muted rounded-2xl p-3 relative animate-fade-in">
                            <p className="text-sm">Tell me about a time when you had to handle a difficult customer or stakeholder. How did you approach the situation?</p>
                            <div className="typing-indicator flex space-x-1 mt-2 items-center">
                              <div className="w-1.5 h-1.5 bg-muted-foreground/40 animate-pulse rounded-full delay-0"></div>
                              <div className="w-1.5 h-1.5 bg-muted-foreground/40 animate-pulse rounded-full delay-150"></div>
                              <div className="w-1.5 h-1.5 bg-muted-foreground/40 animate-pulse rounded-full delay-300"></div>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1 ml-2">PrepFlash AI • Behavioral Question</div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 flex-row-reverse">
                        <div className="w-10 h-10 rounded-full bg-muted flex-shrink-0 flex items-center justify-center border-2 border-prep-accent text-prep-accent font-medium">You</div>
                        <div className="max-w-[80%]">
                          <div className="bg-prep-accent/10 border border-prep-accent/20 rounded-2xl p-3 text-sm">
                            <span className="text-sm">In my previous role, I had a customer who was frustrated about...</span>
                            <span className="animate-pulse-soft cursor text-sm">|</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 rounded-xl bg-gradient-to-r from-prep-primary/5 to-prep-accent/5 border border-prep-primary/10 mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Brain className="h-4 w-4 text-prep-primary" />
                            <h4 className="text-sm font-medium text-prep-primary">AI Coach Suggestions</h4>
                          </div>
                          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 hover:bg-prep-primary/10">
                            View more tips
                            <ChevronRight className="h-3 w-3" />
                          </Button>
                        </div>
                        <ul className="text-xs space-y-2 text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-prep-primary mt-0.5" />
                            <span>Use the STAR method (Situation, Task, Action, Result)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-prep-primary mt-0.5" />
                            <span>Include specific metrics or outcomes if available</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="pt-4 flex justify-center">
                      <Link to="/chat-practices">
                      <Button className="bg-gradient-to-r from-prep-primary to-prep-secondary hover:opacity-90 text-white transition-all duration-300 transform hover:scale-105">
                        Try Text Interview Mode
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="audio" className={`border-0 p-0 mt-0 ${animatedContent ? 'animate-fade-in' : 'opacity-0'}`}>
                <Card className="overflow-hidden border shadow-lg dark:shadow-inner hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-r from-prep-coral/20 via-transparent to-transparent p-4 border-b flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-medium flex items-center">
                        <Mic className="mr-2 h-5 w-5 text-prep-coral" />
                        Audio Interview
                      </h3>
                      <p className="text-sm text-muted-foreground">Practice your verbal communication skills</p>
                    </div>
                    <Badge variant="outline" className="bg-prep-coral/5 text-prep-coral border-prep-coral/20">
                      Intermediate
                    </Badge>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    <div className="flex flex-col items-center">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-prep-coral to-prep-accent flex items-center justify-center mb-4 relative shadow-xl">
                        <div className="absolute inset-0 rounded-full animate-pulse-soft opacity-50 bg-gradient-to-br from-prep-coral to-prep-accent blur-md"></div>
                        <div className="w-28 h-28 rounded-full bg-card flex items-center justify-center z-10">
                          <Mic className="h-12 w-12 text-prep-coral" />
                        </div>
                      </div>
                      
                      <div className="text-center mb-6">
                        <h4 className="text-lg font-medium">Voice Response Recording</h4>
                        <p className="text-sm text-muted-foreground mt-1">00:47 / 02:00</p>
                      </div>
                      
                      <div className="w-full max-w-md bg-muted h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-prep-coral to-prep-accent h-full rounded-full" style={{width: "40%"}}></div>
                      </div>
                      
                      <div className="flex items-center justify-center space-x-4 mt-8">
                        <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                          <SkipBack className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={togglePlay}
                          className="rounded-full h-14 w-14 bg-gradient-to-r from-prep-coral to-prep-accent text-white hover:opacity-90 transition-transform duration-200 hover:scale-105"
                        >
                          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                          <SkipForward className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-3 rounded-xl bg-gradient-to-r from-prep-coral/5 to-prep-accent/5 border border-prep-coral/10 mt-6">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Brain className="h-4 w-4 text-prep-coral" />
                          <h4 className="text-sm font-medium text-prep-coral">Voice Analysis</h4>
                        </div>
                        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 hover:bg-prep-coral/10">
                          More details
                          <Settings className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="p-2 rounded-lg bg-prep-coral/5 border border-prep-coral/10">
                          <p className="font-medium text-prep-coral">Pace</p>
                          <p className="text-muted-foreground">Moderate</p>
                        </div>
                        <div className="p-2 rounded-lg bg-prep-accent/5 border border-prep-accent/10">
                          <p className="font-medium text-prep-accent">Clarity</p>
                          <p className="text-muted-foreground">Good</p>
                        </div>
                        <div className="p-2 rounded-lg bg-prep-primary/5 border border-prep-primary/10">
                          <p className="font-medium text-prep-primary">Confidence</p>
                          <p className="text-muted-foreground">High</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 flex justify-center">
                    <Link to="/voice-practice">
                      <Button className="bg-gradient-to-r from-prep-coral to-prep-accent hover:opacity-90 text-white transition-all duration-300 transform hover:scale-105">
                        Try Audio Interview Mode
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="video" className={`border-0 p-0 mt-0 ${animatedContent ? 'animate-fade-in' : 'opacity-0'}`}>
                <Card className="overflow-hidden border shadow-lg dark:shadow-inner hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-r from-prep-aqua/20 via-transparent to-transparent p-4 border-b flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-medium flex items-center">
                        <Video className="mr-2 h-5 w-5 text-prep-aqua" />
                        Video Interview
                      </h3>
                      <p className="text-sm text-muted-foreground">Full interview simulation with visual feedback</p>
                    </div>
                    <Badge variant="outline" className="bg-prep-aqua/5 text-prep-aqua border-prep-aqua/20">
                      Advanced
                    </Badge>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    <div className="aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-black/80 to-black/60 relative shadow-xl">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <Button 
                            className="bg-gradient-to-r from-prep-aqua to-prep-accent hover:opacity-90 rounded-full h-16 w-16 flex items-center justify-center mb-4 ml-12 transition-transform duration-300 hover:scale-110"
                          >
                            <Video className="h-10 w-10 text-white" />
                          </Button>
                          <h4 className="text-white font-medium">Start Video Interview</h4>
                          <p className="text-white/70 text-sm mt-1">Full-featured interview experience</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-prep-aqua/5 to-transparent border border-prep-aqua/10 flex items-center gap-3 transition-all duration-300 hover:shadow-md">
                        <div className="bg-prep-aqua/10 p-2 rounded-full">
                          <CheckCircle2 className="h-5 w-5 text-prep-aqua" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Body Language</h4>
                          <p className="text-xs text-muted-foreground">Posture and gestures analysis</p>
                        </div>
                      </div>
                      
                      <div className="p-3 rounded-xl bg-gradient-to-r from-prep-accent/5 to-transparent border border-prep-accent/10 flex items-center gap-3 transition-all duration-300 hover:shadow-md">
                        <div className="bg-prep-accent/10 p-2 rounded-full">
                          <CheckCircle2 className="h-5 w-5 text-prep-accent" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Eye Contact</h4>
                          <p className="text-xs text-muted-foreground">Focus and engagement tracking</p>
                        </div>
                      </div>
                      
                      <div className="p-3 rounded-xl bg-gradient-to-r from-prep-primary/5 to-transparent border border-prep-primary/10 flex items-center gap-3 transition-all duration-300 hover:shadow-md">
                        <div className="bg-prep-primary/10 p-2 rounded-full">
                          <CheckCircle2 className="h-5 w-5 text-prep-primary" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Facial Expression</h4>
                          <p className="text-xs text-muted-foreground">Emotion and confidence analysis</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 flex justify-center">
                    <Link to="/video-mode">
                      <Button className="bg-gradient-to-r from-prep-aqua to-prep-accent hover:opacity-90 text-white transition-all duration-300 transform hover:scale-105">
                        Try Video Interview Mode
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      </Link>
                      
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </section>
  );
};
