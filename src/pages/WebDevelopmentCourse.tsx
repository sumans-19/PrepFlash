import React, { useState, useEffect } from 'react';
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
import ResourceList from '@/components/webdev/ResourceList';
import { BookOpen, Code, FileCode, HelpCircle, Sun, Moon, Rocket, Star, Zap } from 'lucide-react';
import WeeklyGoals from '@/components/webdev/WeeklyGoals';
import SetWeeklyGoals from '@/components/webdev/SetWeeklyGoals';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

// Theme toggle component with professional styling
const ThemeToggle = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        setTheme('dark');
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newTheme);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full bg-indigo-100/80 dark:bg-indigo-900/50 backdrop-blur-md border border-indigo-200 dark:border-indigo-700 hover:bg-indigo-200 dark:hover:bg-indigo-800 shadow-lg transition-all duration-300"
      aria-label="Toggle theme"
    >
      {theme === 'light' ?
        <Moon size={20} className="text-indigo-600 dark:text-indigo-300" /> :
        <Sun size={20} className="text-yellow-500" />
      }
    </Button>
  );
};

// Resources data (unchanged)
const resources = [
  {
    id: "resource-1",
    title: "MDN Web Docs",
    description: "Comprehensive documentation for web technologies",
    url: "https://developer.mozilla.org",
    category: "Documentation",
    icon: <BookOpen size={24} />,
    thumbnailUrl: "https://static-assets.codecademy.com/Courses/reading-documentation/mdn_homepage.png"
  },
  {
    id: "resource-2",
    title: "freeCodeCamp",
    description: "Free interactive coding lessons",
    url: "https://www.freecodecamp.org",
    category: "Interactive Learning",
    icon: <HelpCircle size={24} />,
    thumbnailUrl: "https://images.pexels.com/photos/4144222/pexels-photo-4144222.jpeg"
  },
  {
    id: "resource-3",
    title: "CSS-Tricks",
    description: "Tips, tricks, and techniques on using CSS",
    url: "https://css-tricks.com",
    category: "CSS",
    icon: <Code size={24} />,
    thumbnailUrl: "https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: "resource-4",
    title: "Frontend Masters",
    description: "In-depth courses from industry experts",
    url: "https://frontendmasters.com",
    category: "Course",
    icon: <BookOpen size={24} />,
    thumbnailUrl: "https://static.frontendmasters.com/assets/fm/med/features/dashboard.webp"
  },
  {
    id: "resource-5",
    title: "W3Schools",
    description: "Web development tutorials covering all the major web technologies",
    url: "https://www.w3schools.com",
    category: "Tutorial",
    icon: <BookOpen size={24} />,
    thumbnailUrl: "https://www.skillfinder.com.au/media/wysiwyg/W3.png"
  },
  {
    id: "resource-6",
    title: "GitHub - Front-end Checklist",
    description: "The perfect Front-End Checklist for modern websites",
    url: "https://github.com/thedaviddias/Front-End-Checklist",
    category: "JavaScript",
    icon: <FileCode size={24} />,
    thumbnailUrl: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
  },
  {
    id: "resource-7",
    title: "Can I Use",
    description: "Browser support tables for modern web technologies",
    url: "https://caniuse.com/",
    category: "Tool",
    icon: <HelpCircle size={24} />,
    thumbnailUrl: "https://caniuse.com/img/favicon-128.png"
  },
  {
    id: "resource-8",
    title: "web.dev",
    description: "Guidance and tools from Google's web team",
    url: "https://web.dev/",
    category: "Documentation",
    icon: <BookOpen size={24} />,
    thumbnailUrl: "https://thumbs.dreamstime.com/b/web-development-coding-programming-internet-technology-business-concept-web-development-coding-programming-internet-technology-121903546.jpg"
  },
  {
    id: "resource-9",
    title: "JavaScript.info",
    description: "Modern JavaScript Tutorial",
    url: "https://javascript.info/",
    category: "JavaScript",
    icon: <Code size={24} />,
    thumbnailUrl: "https://bairesdev.mo.cloudinary.net/blog/2023/08/What-Is-JavaScript-Used-For.jpg?tx=w_1920,q_auto"
  }
];

const WeeklyGoalsDialog = ({ children, title, component: Component }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <Component />
      </DialogContent>
    </Dialog>
  );
};

const WebDevelopmentCourse = () => {
  const { toast } = useToast();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(30), 750);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen pb-16 relative bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-blue-50/50 dark:from-gray-900 dark:via-indigo-950/30 dark:to-purple-950/50 transition-all duration-500">
      {/* Top Bar Section - More Professional */}
      <div className="mx-4 md:mx-8 mt-4 flex justify-between items-start z-10 relative">
        <Badge className="mb-4 bg-white/20 hover:bg-white/30 text-gray-800 dark:text-gray-200 transition-all duration-300"></Badge>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          {/* Weekly Goals dialog with professional styling */}
          <WeeklyGoalsDialog title="Weekly Goals" component={() => <WeeklyGoals courseType="web-development" />}>
            <Button 
              size="sm" 
              variant="outline"
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all duration-300"
            >
              Weekly Goals
            </Button>
          </WeeklyGoalsDialog>
          
          {/* Set Weekly Goals dialog with professional styling */}
          <WeeklyGoalsDialog title="Set Weekly Goals" component={() => <SetWeeklyGoals />}>
            <Button 
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white shadow-md transition-all duration-300"
            >
              Set Weekly Goals
            </Button>
          </WeeklyGoalsDialog>
        </div>
      </div>
      
      {/* Enhanced Cosmic Background - Keeping the space theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        {/* Stars */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute rounded-full bg-white dark:bg-indigo-100 animate-twinkle"
            style={{
              top: `${Math.random() * 100}vh`,
              left: `${Math.random() * 100}vw`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
              opacity: Math.random() * 0.7 + 0.3
            }}
          />
        ))}
        
        {/* Nebulae */}
        {[...Array(5)].map((_, i) => (
          <div
            key={`nebula-${i}`}
            className="absolute rounded-full blur-3xl opacity-20 dark:opacity-30 animate-float"
            style={{
              background: i % 2 === 0 ? 
                'radial-gradient(circle, rgba(122,0,255,0.4) 0%, rgba(122,0,255,0) 70%)' : 
                'radial-gradient(circle, rgba(0,122,255,0.4) 0%, rgba(0,122,255,0) 70%)',
              top: `${Math.random() * 100}vh`,
              left: `${Math.random() * 100}vw`,
              width: `${Math.random() * 300 + 200}px`,
              height: `${Math.random() * 300 + 200}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 20 + 30}s`,
            }}
          />
        ))}
      </div>

      {/* Cosmic Hero Section - UNCHANGED as requested */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white py-20 shadow-xl rounded-xl overflow-hidden mx-4 md:mx-8 mt-8 border border-indigo-400/30 dark:border-indigo-700/30">
        {/* Hero Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Particle effects */}
          {[...Array(8)].map((_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute rounded-full bg-white/10 blur-md"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 120 + 50}px`,
                height: `${Math.random() * 120 + 50}px`,
                transform: `scale(${Math.random() * 0.5 + 0.5})`,
              }}
            />
          ))}
          
          {/* Grid lines */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDYwaDYwVjBoLTYweiIvPjxwYXRoIGQ9Ik0zMCAwdjYwIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjxwYXRoIGQ9Ik0wIDMwaDYwIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvZz48L3N2Zz4=')]" />
        </div>
        
        <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-6 md:w-3/5">
            <Badge className="bg-white/10 backdrop-blur-md border border-white/20 text-indigo-100 hover:bg-white/20 px-4 py-2 text-sm font-medium transition-all duration-300 shadow-lg">
              <Rocket className="mr-2 inline-block h-4 w-4" /> Web Development Odyssey
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              Embark on Your<br/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">Web Dev Universe</span>
            </h1>
            
            <p className="text-lg md:text-xl text-indigo-100 max-w-2xl leading-relaxed">
              Unlock the secrets of the web. From foundational principles to crafting interactive experiences, prepare for liftoff into a new dimension of development mastery!
            </p>
            
            <div className="mt-6">
              <div className="flex items-center gap-4 text-sm text-indigo-200">
                <span className="font-semibold">Progress:</span>
                <Progress value={progress} className="w-64 h-2 bg-white/10" />
                <span className="font-mono">{progress}% Explored</span>
              </div>
            </div>
            
            <Button className="mt-4 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white px-6 py-2 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2">
              <Zap size={18} />
              Begin Your Journey
            </Button>
          </div>
          
          {/* Enhanced 3D Hero Visual */}
          <div className="hidden md:flex md:w-2/5 justify-center">
            <div className="relative w-72 h-72">
              {/* Orbiting circles */}
              <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: '30s' }}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full border-2 border-dashed border-indigo-400/40 rounded-full"></div>
              </div>
              
              <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: '20s', animationDirection: 'reverse' }}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-3/4 border-2 border-dashed border-pink-400/40 rounded-full"></div>
              </div>
              
              {/* Central glowing orb */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full blur-md opacity-60"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-indigo-300 to-purple-400 rounded-full flex items-center justify-center shadow-lg">
                <Code className="text-white h-16 w-16" />
              </div>
              
              {/* Orbiting elements */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-orbit"
                style={{ '--orbit-speed': '15s', '--orbit-size': '36' } as React.CSSProperties}
              >
                <div className="w-10 h-10 rounded-full bg-blue-500/80 flex items-center justify-center shadow-lg">
                  <FileCode className="text-white h-5 w-5" />
                </div>
              </div>
              
              <div
                className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 animate-orbit"
                style={{
                  '--orbit-speed': '20s',
                  '--orbit-size': '36',
                  animationDelay: '5s',
                } as React.CSSProperties}
              >
                <div className="w-10 h-10 rounded-full bg-purple-500/80 flex items-center justify-center shadow-lg">
                  <Star className="text-white h-5 w-5" />
                </div>
              </div>
              
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 animate-orbit"
                style={{
                  '--orbit-speed': '25s',
                  '--orbit-size': '36',
                  animationDelay: '2.5s',
                } as React.CSSProperties}
              >
                <div className="w-10 h-10 rounded-full bg-pink-500/80 flex items-center justify-center shadow-lg">
                  <HelpCircle className="text-white h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Professional UI */}
      <div className="max-w-6xl mx-auto px-4 mt-12 space-y-8">
        <Tabs defaultValue="theory" className="animate-fade-in">
          <TabsList className="grid grid-cols-4 gap-2 md:gap-4 mb-8 p-1.5 rounded-xl bg-white/80 dark:bg-gray-900/70 backdrop-blur-md shadow-lg">
            <TabsTrigger 
              value="theory" 
              className="text-lg py-2 px-1 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
              <BookOpen className="h-5 w-5" /> 
              <span className="hidden sm:inline">Theory</span>
            </TabsTrigger>
            <TabsTrigger 
              value="resources" 
              className="text-lg py-2 px-1 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
              <FileCode className="h-5 w-5" /> 
              <span className="hidden sm:inline">Resources</span>
            </TabsTrigger>
            <TabsTrigger 
              value="quiz" 
              className="text-lg py-2 px-1 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
              <HelpCircle className="h-5 w-5" /> 
              <span className="hidden sm:inline">Quiz</span>
            </TabsTrigger>
            <TabsTrigger 
              value="practice" 
              className="text-lg py-2 px-1 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
              <Code className="h-5 w-5" /> 
              <span className="hidden sm:inline">Practice</span>
            </TabsTrigger>
          </TabsList>

          {/* Theory Section - Professional Redesign */}
          <TabsContent value="theory" className="space-y-8">
            <Card className="border-0 shadow-lg bg-white/95 dark:bg-gray-900/90 backdrop-blur-md rounded-lg transition-all duration-300">
              <CardHeader className="bg-indigo-600 p-6">
                <div className="relative z-10">
                  <Badge className="bg-white/10 text-xs mb-2 font-normal px-2 py-1">
                    FUNDAMENTALS
                  </Badge>
                  <CardTitle className="text-2xl font-bold tracking-tight text-white flex items-center">
                    <BookOpen className="mr-3 h-6 w-6" /> 
                    Introduction to Web Development
                  </CardTitle>
                  <CardDescription className="text-indigo-100 mt-2">
                    Understanding the foundation of web technologies
                  </CardDescription>
                </div>
              </CardHeader>
              
              <CardContent className="p-6 animate-fade-in">
                <div className="prose max-w-none text-gray-800 dark:text-gray-200">
                  <p className="text-lg leading-relaxed mb-6">
                    The web's creation involves a fascinating duality: the visible <strong>front-end</strong>, where user interactions spark, and the hidden <strong>back-end</strong>, the silent engine powering it all.
                  </p>

                  <h3 className="text-xl font-semibold mt-8 mb-4 text-indigo-700 dark:text-indigo-400 flex items-center gap-2 pb-2 border-b border-indigo-200 dark:border-indigo-800/50">
                    <Star className="h-5 w-5" /> The Front-End Technologies
                  </h3>
                  
                  <p className="mb-4">The trinity of front-end technologies shapes the user experience:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                      <h4 className="font-semibold text-indigo-600 dark:text-indigo-400 mb-2">HTML</h4>
                      <p className="text-sm">The structural foundation of web pages, defining content elements.</p>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                      <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">CSS</h4>
                      <p className="text-sm">The styling language that controls the presentation and layout.</p>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                      <h4 className="font-semibold text-purple-600 dark:text-purple-400 mb-2">JavaScript</h4>
                      <p className="text-sm">The programming language that adds interactivity to websites.</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-lg mb-8 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h4 className="font-semibold mb-3 text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                      <Zap className="h-4 w-4" /> Modern Frontend Frameworks
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      Modern front-end development often leverages frameworks like React, Vue, and Angular – collections of reusable components simplifying the creation of complex interfaces.
                    </p>
                  </div>

                  <h3 className="text-xl font-semibold mt-10 mb-4 text-blue-700 dark:text-blue-400 flex items-center gap-2 pb-2 border-b border-blue-200 dark:border-blue-800/50">
                    <Star className="h-5 w-5" /> The Back-End Systems
                  </h3>
                  
                  <p className="mb-4">The back-end handles the server-side operations:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-6">
                    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-blue-600 dark:text-blue-400">
                          <path d="M20 16l-4-4 4-4" />
                          <path d="M4 8l4 4-4 4" />
                          <path d="M16 4l-8 16" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Server-side Processing</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">The calculations and logic behind the scenes.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-full">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-green-600 dark:text-green-400">
                          <path d="M3 3h18v18H3z" />
                          <path d="M7 7h10v10H7z" />
                          <path d="M15 15h2v2h-2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Database Management</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Storing and retrieving application data.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-full">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-purple-600 dark:text-purple-400">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">API Development</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Creating interfaces for data exchange between systems.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="bg-orange-100 dark:bg-orange-900/50 p-2 rounded-full">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-orange-600 dark:text-orange-400">
                          <path d="M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0 -20 0" />
                          <path d="M12 16v-8" />
                          <path d="M12 8h.01" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">User Authentication</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Verifying user identities and managing access control.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
  <h4 className="font-semibold mb-3 text-blue-700 dark:text-blue-300 flex items-center gap-2">
    <Zap className="h-4 w-4" /> Popular Back-End Technologies
  </h4>
  <p className="text-gray-700 dark:text-gray-300">
    Back-end development commonly uses languages and frameworks like Node.js, Python (Django, Flask), Ruby on Rails, PHP, and Java Spring Boot to build robust server-side applications.
  </p>
</div>

<h3 className="text-xl font-semibold mt-10 mb-4 text-purple-700 dark:text-purple-400 flex items-center gap-2 pb-2 border-b border-purple-200 dark:border-purple-800/50">
  <Star className="h-5 w-5" /> The Full Stack Journey
</h3>

<p className="mb-6">
  The path to becoming a proficient web developer involves mastering both front-end and back-end technologies. This "full-stack" approach empowers you to create complete web applications from start to finish.
</p>

<div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-px shadow-xl shadow-indigo-500/20 mb-8">
  <div className="bg-white dark:bg-gray-900 rounded-[calc(0.75rem-1px)] p-6">
    <h4 className="text-lg font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">Development Workflow</h4>
    <ol className="space-y-3 text-gray-700 dark:text-gray-300">
      <li className="flex items-start gap-3">
        <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
        <div>
          <span className="font-medium">Planning & Design</span>: Define requirements and create wireframes/mockups
        </div>
      </li>
      <li className="flex items-start gap-3">
        <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
        <div>
          <span className="font-medium">Front-End Development</span>: Build the user interface and client-side functionality
        </div>
      </li>
      <li className="flex items-start gap-3">
        <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
        <div>
          <span className="font-medium">Back-End Development</span>: Create server, database, and APIs
        </div>
      </li>
      <li className="flex items-start gap-3">
        <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">4</div>
        <div>
          <span className="font-medium">Testing & Debugging</span>: Ensure functionality and fix issues
        </div>
      </li>
      <li className="flex items-start gap-3">
        <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">5</div>
        <div>
          <span className="font-medium">Deployment & Maintenance</span>: Launch and continually improve
        </div>
      </li>
    </ol>
  </div>
</div>

<div className="flex flex-col md:flex-row gap-4 mb-8">
  <div className="flex-1 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 p-5 rounded-lg border border-indigo-100 dark:border-gray-700 shadow-sm">
    <h4 className="font-semibold mb-3 text-indigo-700 dark:text-indigo-400">Typical Front-End Skills</h4>
    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
      <li className="flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-indigo-500"></div>
        <span>HTML5 & Semantic Markup</span>
      </li>
      <li className="flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-indigo-500"></div>
        <span>CSS & Layout Techniques</span>
      </li>
      <li className="flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-indigo-500"></div>
        <span>JavaScript & DOM Manipulation</span>
      </li>
      <li className="flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-indigo-500"></div>
        <span>React, Vue, or Angular</span>
      </li>
      <li className="flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-indigo-500"></div>
        <span>Responsive Design</span>
      </li>
    </ul>
  </div>
  
  <div className="flex-1 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-5 rounded-lg border border-blue-100 dark:border-gray-700 shadow-sm">
    <h4 className="font-semibold mb-3 text-blue-700 dark:text-blue-400">Typical Back-End Skills</h4>
    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
      <li className="flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
        <span>Server-side Programming</span>
      </li>
      <li className="flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
        <span>Database Management</span>
      </li>
      <li className="flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
        <span>API Development</span>
      </li>
      <li className="flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
        <span>Authentication & Security</span>
      </li>
      <li className="flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
        <span>Server Configuration</span>
      </li>
    </ul>
  </div>
</div>

<div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 p-5 rounded-lg shadow-sm">
  <h4 className="font-semibold text-blue-800 dark:text-blue-300 flex items-center gap-2 mb-3">
    <HelpCircle className="h-4 w-4" /> Why Learn Web Development?
  </h4>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700 dark:text-gray-300">
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
      <h5 className="font-medium text-indigo-600 dark:text-indigo-400 mb-2">High Demand</h5>
      <p className="text-sm">Web developers are consistently among the most sought-after professionals in the tech industry.</p>
    </div>
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
      <h5 className="font-medium text-indigo-600 dark:text-indigo-400 mb-2">Creative Freedom</h5>
      <p className="text-sm">Express your creativity while solving complex problems with elegant solutions.</p>
    </div>
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
      <h5 className="font-medium text-indigo-600 dark:text-indigo-400 mb-2">Remote Work</h5>
      <p className="text-sm">Enjoy the flexibility of working from anywhere with just a computer and internet connection.</p>
    </div>
  </div>
</div>
</div>
</CardContent>
</Card>
</TabsContent>

{/* Resources Section */}
<TabsContent value="resources" className="min-h-[500px]">
<ResourceList resources={resources} />
</TabsContent>

{/* Quiz Section */}
<TabsContent value="quiz" className="min-h-[500px]">
<QuizSection />
</TabsContent>

{/* Practice Section */}
<TabsContent value="practice" className="min-h-[500px]">
<Card className="border-0 shadow-lg bg-white/95 dark:bg-gray-900/90 backdrop-blur-md">
<CardHeader className="bg-purple-600">
  <div className="relative z-10">
    <Badge className="bg-white/10 text-xs mb-2 font-normal px-2 py-1">
      HANDS-ON PRACTICE
    </Badge>
    <CardTitle className="text-2xl font-bold tracking-tight text-white flex items-center">
      <Code className="mr-3 h-6 w-6" /> 
      Interactive Coding Environment
    </CardTitle>
    <CardDescription className="text-purple-100 mt-2">
      Apply what you've learned in a real coding environment
    </CardDescription>
  </div>
</CardHeader>

<CardContent className="p-6">
  <div className="mb-6">
    <h3 className="text-lg font-semibold mb-2 text-purple-700 dark:text-purple-400">Task: Create a Simple Button Component</h3>
    <p className="text-gray-700 dark:text-gray-300 mb-4">
      Practice your HTML and CSS skills by creating a styled button component.
    </p>
  </div>
  
  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-6">
    <CodeEditor 
      initialCode={`
<!-- Create a button with these requirements: -->
<!-- 1. Use proper HTML5 semantic elements -->
<!-- 2. Style it with CSS to have rounded corners -->
<!-- 3. Add a hover effect -->
<!-- 4. Include an icon (you can use emoji) -->

<button class="custom-button">
  <!-- Your code here -->
</button>

<style>
  .custom-button {
    /* Your styles here */
  }
</style>
      `}
      language="html"
      height="300px"
    />
  </div>
  
  <div className="flex gap-3 justify-end">
    <Button 
      variant="outline" 
      className="border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/50"
      onClick={() => toast({
        title: "Hint",
        description: "Try using padding, border-radius, and transition properties for a smooth effect.",
      })}
    >
      Get Hint
    </Button>
    
    <Button 
      className="bg-purple-600 hover:bg-purple-700" 
      onClick={() => toast({
        title: "Code submitted!",
        description: "Great job on completing the practice exercise.",
      })}
    >
      Submit Solution
    </Button>
  </div>
</CardContent>
</Card>
</TabsContent>
</Tabs>
</div>

{/* Community Section */}
<div className="max-w-6xl mx-auto px-4 mt-16">
<Card className="border-0 overflow-hidden shadow-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white">
<CardContent className="p-8">
  <div className="flex flex-col md:flex-row gap-8 items-center">
    <div className="md:w-2/3 space-y-4">
      <Badge className="bg-white/10 backdrop-blur-md text-white hover:bg-white/20 px-3 py-1">
        JOIN THE COMMUNITY
      </Badge>
      <h2 className="text-3xl font-bold tracking-tight">Connect with Fellow Space Travelers</h2>
      <p className="text-purple-100">
        Share your journey, ask questions, and collaborate with other developers exploring the web development universe.
      </p>
      <div className="flex gap-3 mt-4">
        <Button className="bg-white text-purple-700 hover:bg-purple-100">
          Join Discord
        </Button>
        <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
          Browse Forums
        </Button>
      </div>
    </div>
    
    <div className="md:w-1/3 flex justify-center">
      {/* Abstract community illustration */}
      <div className="relative w-48 h-48">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-full"></div>
        
        {/* Community nodes */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-purple-400/80 rounded-full flex items-center justify-center">
          <div className="h-16 w-16 bg-white/90 rounded-full flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-purple-600">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
        </div>
        
        {/* Connecting lines and nodes */}
        {[...Array(6)].map((_, i) => {
          const angle = (i * Math.PI * 2) / 6;
          const distance = 80;
          const x = Math.cos(angle) * distance;
          const y = Math.sin(angle) * distance;
          
          return (
            <React.Fragment key={`connection-${i}`}>
              <div 
                className="absolute top-1/2 left-1/2 w-1 bg-white/30"
                style={{
                  height: `${distance * 0.8}px`,
                  transform: `translate(-50%, 0%) rotate(${angle + Math.PI/2}rad)`,
                  transformOrigin: 'center bottom',
                }}
              ></div>
              
              <div
                className="absolute w-8 h-8 bg-indigo-500/80 rounded-full flex items-center justify-center shadow-lg"
                style={{
                  top: `calc(50% + ${y}px)`,
                  left: `calc(50% + ${x}px)`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="h-4 w-4 bg-white/90 rounded-full"></div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  </div>
</CardContent>
</Card>
</div>

{/* Footer */}
<footer className="mt-20 bg-indigo-950/30 backdrop-blur-md border-t border-indigo-900/50 py-8">
<div className="max-w-6xl mx-auto px-4">
  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
    <div className="flex items-center gap-2">
      <Code className="text-indigo-400 h-5 w-5" />
      <span className="text-indigo-200 font-medium">Web Development Odyssey</span>
    </div>
    
    <div className="text-indigo-300/60 text-sm">
      Embark on your journey through the cosmos of web development.
    </div>
    
    <div className="flex gap-4">
      <Button variant="ghost" size="icon" className="text-indigo-300 hover:text-indigo-200 hover:bg-indigo-900/50">
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      </Button>
      
      <Button variant="ghost" size="icon" className="text-indigo-300 hover:text-indigo-200 hover:bg-indigo-900/50">
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 11.7c0 6.45-5.27 11.68-11.78 11.68-2.07 0-4-.53-5.7-1.45L0 24l2.13-6.27a11.57 11.57 0 0 1-1.7-6.04C.44 5.23 5.72 0 12.23 0 18.72 0 24 5.23 24 11.7M12.22 1.85c-5.46 0-9.9 4.41-9.9 9.83 0 2.15.7 4.14 1.88 5.76L2.96 21.1l3.8-1.2a9.9 9.9 0 0 0 5.46 1.62c5.46 0 9.9-4.4 9.9-9.83a9.88 9.88 0 0 0-9.9-9.83m5.95 12.52c-.08-.12-.27-.19-.56-.33-.28-.14-1.7-.84-1.97-.93-.26-.1-.46-.15-.65.14-.2.29-.75.93-.92 1.12-.17.2-.34.22-.63.07-.29-.15-1.22-.45-2.32-1.43a8.64 8.64 0 0 1-1.6-1.98c-.18-.29-.02-.44.12-.58.13-.13.29-.34.43-.5.15-.17.2-.3.29-.48.1-.2.05-.36-.02-.5-.08-.15-.65-1.56-.9-2.13-.24-.58-.48-.48-.65-.48-.17 0-.37-.03-.56-.03-.2 0-.5.08-.77.36-.26.29-1 .98-1 2.4 0 1.4 1.03 2.76 1.17 2.96.14.19 2 3.17 4.93 4.32 2.94 1.15 2.94.77 3.47.72.53-.05 1.7-.7 1.95-1.36.24-.67.24-1.25.17-1.37"/>
        </svg>
      </Button>
      
      <Button variant="ghost" size="icon" className="text-indigo-300 hover:text-indigo-200 hover:bg-indigo-900/50">
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
        </svg>
      </Button>
    </div>
  </div>
</div>
</footer>
</div>
);
};

export default WebDevelopmentCourse;