
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import CodeEditor from '@/components/webdev/CodeEditor';
import QuizSection from '@/components/webdev/QuizSection';
import ResourceCard from '@/components/webdev/ResourceCard';

const GameDevelopmentCourse = () => {
  const { toast } = useToast();
  const [progress, setProgress] = useState(0);
  
  // Simulate progress increase
  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(10), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-indigo-50 pb-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-indigo-600 text-white p-6 md:p-16 animate-fade-in">
        <div className="max-w-6xl mx-auto">
          <Badge className="mb-4 bg-white/20 hover:bg-white/30">Game Development</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Master Game Development</h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl">
            Learn to design and create engaging games for multiple platforms
          </p>
          <div className="mt-6">
            <div className="flex items-center gap-3 text-sm">
              <span>Course Progress</span>
              <Progress value={progress} className="w-64 bg-white/20" />
              <span>{progress}% Complete</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <Tabs defaultValue="theory" className="animate-fade-in-slow">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="theory" className="text-lg py-3">Theory</TabsTrigger>
            <TabsTrigger value="resources" className="text-lg py-3">Resources</TabsTrigger>
            <TabsTrigger value="quiz" className="text-lg py-3">Quiz</TabsTrigger>
            <TabsTrigger value="practice" className="text-lg py-3">Practice</TabsTrigger>
          </TabsList>
          
          {/* Theory Section */}
          <TabsContent value="theory" className="space-y-8">
            <Card className="glassmorphism overflow-hidden border-0">
              <CardHeader className="bg-gradient-to-r from-emerald-600 to-indigo-600 text-white">
                <CardTitle className="text-2xl">Introduction to Game Development</CardTitle>
                <CardDescription className="text-white/80">
                  Understanding the fundamentals of game design and development
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 animate-fade-in">
                <div className="prose max-w-none">
                  <p className="text-lg leading-relaxed mb-4">
                    Game development is the process of creating video games, combining art, programming, sound design, 
                    storytelling, and more. It's a multidisciplinary field that requires both technical skills and creative thinking.
                  </p>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3 section-header pb-2">Game Development Disciplines</h3>
                  <p className="mb-4">Game development encompasses several key disciplines:</p>
                  <ul className="space-y-3 list-disc pl-5 mb-6">
                    <li>
                      <span className="font-semibold">Game Design</span>: Creating rules, gameplay mechanics, and overall player experience
                    </li>
                    <li>
                      <span className="font-semibold">Game Programming</span>: Implementing game mechanics, physics, AI, and systems
                    </li>
                    <li>
                      <span className="font-semibold">Game Art</span>: Creating visual assets, characters, environments, and animations
                    </li>
                    <li>
                      <span className="font-semibold">Game Audio</span>: Designing sound effects, music, and voice acting
                    </li>
                    <li>
                      <span className="font-semibold">Game Testing</span>: Finding bugs, balancing gameplay, and ensuring quality
                    </li>
                  </ul>
                  
                  <div className="bg-accent p-4 rounded-lg mb-6">
                    <h4 className="font-semibold mb-2">Popular Game Engines</h4>
                    <p>
                      Game engines like Unity, Unreal Engine, Godot, and GameMaker Studio provide developers with 
                      tools and frameworks for building games efficiently across multiple platforms.
                    </p>
                  </div>
                  
                  <h3 className="text-xl font-semibold mt-8 mb-3 section-header pb-2">Game Development Concepts</h3>
                  <p className="mb-4">Important concepts in game development include:</p>
                  <ul className="space-y-3 list-disc pl-5 mb-6">
                    <li>Game loops and update cycles</li>
                    <li>Physics systems and collision detection</li>
                    <li>Input handling and player controls</li>
                    <li>Asset management and optimization</li>
                    <li>Level design and world building</li>
                  </ul>
                  
                  <div className="bg-accent p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Game Development Process</h4>
                    <p>
                      The game development process typically includes concept development, pre-production, production, 
                      testing, and post-launch support. Each phase involves different tasks and challenges.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end mt-8">
                  <Button 
                    onClick={() => {
                      setProgress(Math.min(progress + 10, 100));
                      toast({
                        title: "Progress updated!",
                        description: "You've completed this section.",
                      });
                    }}
                    className="bg-gradient-to-r from-emerald-600 to-indigo-600"
                  >
                    Mark as Completed
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Resources Section */}
          <TabsContent value="resources" className="space-y-6">
            <h2 className="text-2xl font-bold section-header pb-2">Learning Resources</h2>
            <p className="text-lg text-muted-foreground mb-8">Explore these hand-picked resources to deepen your knowledge</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              <ResourceCard 
                title="Unity Learn" 
                description="Official tutorials and courses from Unity Technologies"
                type="Learning Platform"
                url="https://learn.unity.com"
                imageUrl="https://unity.com/logo-unity-web.png"
              />
              
              <ResourceCard 
                title="Unreal Engine Documentation" 
                description="Comprehensive guides for Unreal Engine development"
                type="Documentation"
                url="https://docs.unrealengine.com"
                imageUrl="https://cdn2.unrealengine.com/ue-logo-stacked-unreal-engine-w-677x545-fac11de0943f.png"
              />
              
              <ResourceCard 
                title="Game Dev.tv" 
                description="Online courses for aspiring game developers"
                type="Courses"
                url="https://www.gamedev.tv"
                imageUrl="https://www.gamedev.tv/assets/logo-e9b969a20721d7d60cf449c3dedba2f4fa16b1cbdc1adcd4476af109d9c44332.svg"
              />
              
              <ResourceCard 
                title="Godot Engine" 
                description="Free and open source game engine"
                type="Game Engine"
                url="https://godotengine.org"
                imageUrl="https://godotengine.org/assets/press/logo_large_color_dark.png"
              />
            </div>
          </TabsContent>
          
          {/* Quiz Section */}
          <TabsContent value="quiz">
            <QuizSection />
          </TabsContent>
          
          {/* Practice Section */}
          <TabsContent value="practice">
            <Card className="glassmorphism mb-8 animate-fade-in">
              <CardHeader>
                <CardTitle>Practice Exercise: Game Character Movement</CardTitle>
                <CardDescription>
                  Practice implementing basic character movement with JavaScript
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-2">Instructions:</h3>
                  <p className="mb-4">
                    Create a simple 2D character movement system with the following features:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-1">
                    <li>Character represented by a square</li>
                    <li>Arrow key or WASD movement controls</li>
                    <li>Character stays within the boundaries of the canvas</li>
                    <li>Smooth movement animation</li>
                    <li>Optional: Add obstacles to avoid</li>
                  </ul>
                </div>
                
                <CodeEditor 
                  defaultCode={`<!DOCTYPE html>
<html>
<head>
  <style>
    #game-canvas {
      border: 1px solid black;
      background-color: #f0f0f0;
    }
  </style>
</head>
<body>
  <canvas id="game-canvas" width="400" height="400"></canvas>
  
  <script>
    // Get the canvas and context
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    
    // Define character properties
    const character = {
      x: 200,
      y: 200,
      width: 20,
      height: 20,
      color: 'blue',
      speed: 5
    };
    
    // Your code here to:
    // 1. Add keyboard input handling
    // 2. Implement movement logic
    // 3. Add boundary checking
    // 4. Create the game loop
    // 5. Draw the character
    
  </script>
</body>
</html>`}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GameDevelopmentCourse;
