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

// Theme toggle component with enhanced styling
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
      className="rounded-full bg-white/10 dark:bg-gray-800/30 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
      aria-label="Toggle theme"
    >
      {theme === 'light' ?
        <Moon size={18} className="text-gray-700 dark:text-gray-300" /> :
        <Sun size={18} className="text-purple-400" />
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
    <div className="min-h-screen pb-16 relative bg-gray-950 dark:bg-gray-950 transition-all duration-500">
      {/* Top Bar Section */}
      <div className="mx-4 md:mx-8 pt-6 flex justify-between items-center z-10 relative">
        <div className="flex items-center space-x-2">
          <Code className="h-5 w-5 text-purple-500 dark:text-purple-400" strokeWidth={2.5} />
          <span className="font-semibold text-white dark:text-white">WebDevPath</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Weekly Goals dialog */}
          <WeeklyGoalsDialog title="Weekly Goals" component={() => <WeeklyGoals courseType="web-development" />}>
            <Button
              size="sm"
              variant="outline"
              className="bg-purple-600 text-white hover:bg-purple-700 shadow-sm transition-all duration-300"
            >
              View Goals
            </Button>
          </WeeklyGoalsDialog>

          {/* Set Weekly Goals dialog */}
          <WeeklyGoalsDialog title="Set Weekly Goals" component={() => <SetWeeklyGoals />}>
            <Button
              size="sm"
              className="bg-purple-700 text-white hover:bg-purple-800 shadow-sm transition-all duration-300"
            >
              Set Goals
            </Button>
          </WeeklyGoalsDialog>
        </div>
      </div>

      {/* Subtle Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        {/* Gradient spots */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-purple-900/20 dark:bg-purple-900/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-purple-900/20 dark:bg-purple-900/20 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gray-900 dark:bg-gray-900 shadow-md rounded-xl overflow-hidden mx-4 md:mx-8 mt-8 border border-gray-800 dark:border-gray-800 transition-all duration-300 hover:shadow-lg">
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-12 md:py-16 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="space-y-6 md:w-3/5">
              <Badge className="bg-purple-900/50 dark:bg-purple-900/50 text-purple-300 dark:text-purple-300 hover:bg-purple-800 dark:hover:bg-purple-800">
                <Rocket className="mr-2 inline-block h-3 w-3" /> Web Development Path
              </Badge>

              <h1 className="text-3xl md:text-4xl font-bold text-white dark:text-white tracking-tight">
                Master Modern Web Development <span className="text-purple-500 dark:text-purple-400">Step by Step</span>
              </h1>

              <p className="text-gray-300 dark:text-gray-300 leading-relaxed">
                From fundamentals to advanced concepts, build your skills through structured learning paths and hands-on projects.
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-400 dark:text-gray-400">
                <span className="font-medium">Progress:</span>
                <Progress value={progress} className="w-32 md:w-48 h-2 bg-gray-700" />
                <span className="font-mono">{progress}%</span>
              </div>

              <Button className="mt-2 bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-all duration-300 animate-fade-in">
                Continue Learning
              </Button>
            </div>

            {/* Simple, clean illustration */}
            <div className="hidden md:block md:w-2/5">
              <div className="relative aspect-square max-w-xs mx-auto">
                <div className="absolute inset-4 rounded-full border-4 border-dashed border-purple-800/40 dark:border-purple-800/40 opacity-60 animate-spin-slow" style={{ animationDuration: '30s' }}></div>
                <div className="absolute inset-12 rounded-full border-4 border-dashed border-purple-700/40 dark:border-purple-700/40 opacity-70 animate-spin-slow" style={{ animationDuration: '20s', animationDirection: 'reverse' }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg flex items-center justify-center transform transition-transform duration-700 hover:scale-110 hover:rotate-3">
                    <Code className="text-white h-12 w-12" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <div className="max-w-6xl mx-auto px-4 mt-10 space-y-6">
        <Tabs defaultValue="theory" className="animate-fade-in">
          <TabsList className="flex w-full md:w-auto overflow-x-auto p-1 rounded-lg bg-gray-900 dark:bg-gray-900 shadow-sm border border-gray-800 dark:border-gray-800">
            <TabsTrigger
              value="theory"
              className="flex-1 md:flex-none px-4 py-2 text-sm rounded-md data-[state=active]:bg-purple-900/50 data-[state=active]:text-purple-300 dark:data-[state=active]:bg-purple-900/50 dark:data-[state=active]:text-purple-300 transition-all duration-200">
              <BookOpen className="h-4 w-4 md:mr-2 md:inline-block" />
              <span className="hidden md:inline">Theory</span>
            </TabsTrigger>
            <TabsTrigger
              value="resources"
              className="flex-1 md:flex-none px-4 py-2 text-sm rounded-md data-[state=active]:bg-purple-900/50 data-[state=active]:text-purple-300 dark:data-[state=active]:bg-purple-900/50 dark:data-[state=active]:text-purple-300 transition-all duration-200">
              <FileCode className="h-4 w-4 md:mr-2 md:inline-block" />
              <span className="hidden md:inline">Resources</span>
            </TabsTrigger>
            <TabsTrigger
              value="quiz"
              className="flex-1 md:flex-none px-4 py-2 text-sm rounded-md data-[state=active]:bg-purple-900/50 data-[state=active]:text-purple-300 dark:data-[state=active]:bg-purple-900/50 dark:data-[state=active]:text-purple-300 transition-all duration-200">
              <HelpCircle className="h-4 w-4 md:mr-2 md:inline-block" />
              <span className="hidden md:inline">Quiz</span>
            </TabsTrigger>
            <TabsTrigger
              value="practice"
              className="flex-1 md:flex-none px-4 py-2 text-sm rounded-md data-[state=active]:bg-purple-900/50 data-[state=active]:text-purple-300 dark:data-[state=active]:bg-purple-900/50 dark:data-[state=active]:text-purple-300 transition-all duration-200">
              <Code className="h-4 w-4 md:mr-2 md:inline-block" />
              <span className="hidden md:inline">Practice</span>
            </TabsTrigger>
          </TabsList>

          {/* Theory Section - Refined */}
          <TabsContent value="theory" className="focus-visible:outline-none focus-visible:ring-0">
            <Card className="border border-gray-800 dark:border-gray-800 shadow-md animate-fade-in bg-gray-900">
              <CardHeader className="bg-gradient-to-r from-purple-900 to-purple-800 p-6">
                <Badge className="w-fit bg-white/10 text-white mb-3">
                  FUNDAMENTALS
                </Badge>
                <CardTitle className="text-xl md:text-2xl text-white flex items-center">
                  <BookOpen className="mr-3 h-5 w-5" />
                  Introduction to Web Development
                </CardTitle>
                <CardDescription className="text-purple-100">
                  Core concepts and fundamental principles
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6">
                <div className="prose max-w-none text-gray-300 dark:text-gray-300">
                  <p className="text-lg leading-relaxed mb-6">
                    Web development involves two main components: the <strong>front-end</strong> that users interact with, and the <strong>back-end</strong> that powers functionality behind the scenes.
                  </p>

                  <h3 className="text-lg font-semibold mt-6 mb-3 text-purple-400 dark:text-purple-400 flex items-center gap-2">
                    <Star className="h-4 w-4" /> Front-End Technologies
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
                    <div className="bg-gray-800/50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-md">
                      <h4 className="font-medium text-purple-400 dark:text-purple-400 mb-2">HTML</h4>
                      <p className="text-sm">The structural foundation that defines the content of web pages.</p>
                    </div>

                    <div className="bg-gray-800/50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-md">
                      <h4 className="font-medium text-purple-400 dark:text-purple-400 mb-2">CSS</h4>
                      <p className="text-sm">The styling language that controls the presentation and layout.</p>
                    </div>

                    <div className="bg-gray-800/50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-md">
                      <h4 className="font-medium text-purple-400 dark:text-purple-400 mb-2">JavaScript</h4>
                      <p className="text-sm">The programming language that adds interactivity and dynamic behavior.</p>
                    </div>
                  </div>

                  <div className="bg-purple-900/20 dark:bg-purple-900/20 p-4 rounded-lg my-6 border border-purple-800/50 dark:border-purple-800/50">
                    <h4 className="font-medium mb-2 text-purple-400 dark:text-purple-400 flex items-center gap-2">
                      <Zap className="h-4 w-4" /> Modern Frameworks
                    </h4>
                    <p className="text-sm">
                      Modern development often leverages frameworks like React, Vue, and Angular to create reusable component-based interfaces more efficiently.
                    </p>
                  </div>

                  <h3 className="text-lg font-semibold mt-6 mb-3 text-purple-400 dark:text-purple-400 flex items-center gap-2">
                    <Star className="h-4 w-4" /> Back-End Development
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
                    <div className="flex items-start gap-3 p-3 bg-gray-800/50 dark:bg-gray-800/50 rounded-lg border border-gray-700/50 dark:border-gray-700/50">
                      <div className="bg-purple-900/50 dark:bg-purple-900/50 p-2 rounded-full">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-purple-400 dark:text-purple-400">
                          <path d="M20 16l-4-4 4-4" />
                          <path d="M4 8l4 4-4 4" />
                          <path d="M16 4l-8 16" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Server Processing</h4>
                        <p className="text-xs text-gray-400 dark:text-gray-400">Logic and functionality handling.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-gray-800/50 dark:bg-gray-800/50 rounded-lg border border-gray-700/50 dark:border-gray-700/50">
                      <div className="bg-purple-900/50 dark:bg-purple-900/50 p-2 rounded-full">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-purple-400 dark:text-purple-400">
                          <path d="M3 3h18v18H3z" />
                          <path d="M7 7h10v10H7z" />
                          <path d="M15 15h2v2h-2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Database Systems</h4>
                        <p className="text-xs text-gray-400 dark:text-gray-400">Data storage and retrieval.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-900/20 dark:bg-purple-900/20 p-4 rounded-lg my-6 border border-purple-800/50 dark:border-purple-800/50">
                    <h4 className="font-medium mb-2 text-purple-400 dark:text-purple-400 flex items-center gap-2">
                      <Zap className="h-4 w-4" /> Backend Technologies
                    </h4>
                    <p className="text-sm">
                      Common technologies include Node.js, Python (Django, Flask), Ruby (Rails), PHP, and Java. Database systems like MongoDB, MySQL, and PostgreSQL manage data storage.
                    </p>
                  </div>
                </div>

                <div className="flex justify-center mt-6">
                  <Button
                    onClick={() => {
                      toast({
                        title: "Module Completed",
                        description: "You've unlocked the next section",
                      });
                      setProgress((prev) => Math.min(prev + 10, 100));
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white transition-all duration-300"
                  >
                    Mark as Completed
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Section - Refined */}
          <TabsContent value="resources" className="focus-visible:outline-none focus-visible:ring-0">
            <Card className="border border-gray-800 dark:border-gray-800 shadow-md animate-fade-in bg-gray-900">
              <CardHeader className="bg-gradient-to-r from-purple-900 to-purple-800 p-6">
                <Badge className="w-fit bg-white/20 text-white mb-3">
                  LEARNING MATERIALS
                </Badge>
                <CardTitle className="text-xl md:text-2xl text-white flex items-center">
                  <FileCode className="mr-3 h-5 w-5" />
                  Resources Collection
                </CardTitle>
                <CardDescription className="text-purple-100">
                  Essential tools and references for developers
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6">
                <ResourceList resources={resources} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quiz Section - Refined */}
          <TabsContent value="quiz" className="focus-visible:outline-none focus-visible:ring-0">
            <Card className="border border-gray-800 dark:border-gray-800 shadow-md animate-fade-in bg-gray-900">
              <CardHeader className="bg-gradient-to-r from-purple-900 to-purple-800 p-6">
                <Badge className="w-fit bg-white/20 text-white mb-3">
                  KNOWLEDGE CHECK
                </Badge>
                <CardTitle className="text-xl md:text-2xl text-white flex items-center">
                  <HelpCircle className="mr-3 h-5 w-5" />
                  Quiz Challenge
                </CardTitle>
                <CardDescription className="text-purple-100">
                  Test your understanding of web development concepts
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6">
                <div className="flex justify-center">
                  <div className="w-full max-w-3xl">
                    <QuizSection
                      onComplete={() => {
                        toast({
                          title: "Quiz Completed",
                          description: "Great job on the assessment!",
                        });
                        setProgress((prev) => Math.min(prev + 15, 100));
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Practice Section - Refined */}
          <TabsContent value="practice" className="focus-visible:outline-none focus-visible:ring-0">
            <Card className="border border-gray-800 dark:border-gray-800 shadow-md animate-fade-in bg-gray-900">
              <CardHeader className="bg-gradient-to-r from-purple-900 to-purple-800 p-6">
                <Badge className="w-fit bg-white/20 text-white mb-3">
                  HANDS-ON
                </Badge>
                <CardTitle className="text-xl md:text-2xl text-white flex items-center">
                  <Code className="mr-3 h-5 w-5" />
                  Coding Practice
                </CardTitle>
                <CardDescription className="text-purple-100">
                  Apply your knowledge through practical exercises
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="bg-gray-800/50 dark:bg-gray-800/50 p-5 rounded-lg border border-gray-700/50 dark:border-gray-700/50">
                    <h3 className="text-lg font-medium mb-3 text-purple-400 dark:text-purple-400">Challenge: Responsive Navigation</h3>
                    <p className="mb-3 text-gray-300 dark:text-gray-300 text-sm">Create a responsive navigation bar with the following features:</p>
                    <ul className="list-disc list-inside mb-4 text-gray-300 dark:text-gray-300 text-sm space-y-1">
                      <li>Logo/Brand name on the left</li>
                      <li>Navigation links in the center</li>
                      <li>Login/Signup buttons on the right</li>
                      <li>Mobile-responsive design</li>
                    </ul>
                  </div>

                  <CodeEditor
                    initialCode={`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Responsive Navigation</title>
  <style>
    /* Your CSS here */
    
  </style>
</head>
<body>
  <!-- Your HTML here -->
  
</body>
</html>`}
                    onSave={() => {
                      toast({
                        title: "Code Saved",
                        description: "Your solution has been stored",
                      });
                      setProgress((prev) => Math.min(prev + 20, 100));
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Community Section - Refined */}
      <div className="max-w-6xl mx-auto px-4 mt-10">
        <Card className="border border-gray-800 dark:border-gray-800 shadow-md animate-fade-in bg-gray-900">
          <CardHeader className="bg-gradient-to-r from-purple-900 to-purple-800 p-6">
            <Badge className="w-fit bg-white/20 text-white mb-3">
              COMMUNITY
            </Badge>
            <CardTitle className="text-xl md:text-2xl text-white flex items-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="mr-3" strokeWidth={2}>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              Developer Community
            </CardTitle>
            <CardDescription className="text-purple-100">
              Connect with fellow developers and share knowledge
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800 dark:bg-gray-800 p-5 rounded-lg border border-gray-700 dark:border-gray-700 shadow-sm transition-all duration-300 hover:shadow-md">
                <h3 className="font-medium text-lg text-purple-400 dark:text-purple-400 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 8v8"></path>
                    <path d="M8 12h8"></path>
                  </svg>
                  Discussion Forums
                </h3>
                <p className="mt-2 text-gray-300 dark:text-gray-300 text-sm">
                  Join topic-based discussion groups to ask questions and share solutions with the community.
                </p>
                <Button variant="outline" size="sm" className="mt-4 border-purple-700 dark:border-purple-700 text-purple-400 dark:text-purple-400 hover:bg-purple-900/20 dark:hover:bg-purple-900/20 transition-all duration-300">
                  Browse Forums
                </Button>
              </div>

              <div className="bg-gray-800 dark:bg-gray-800 p-5 rounded-lg border border-gray-700 dark:border-gray-700 shadow-sm transition-all duration-300 hover:shadow-md">
                <h3 className="font-medium text-lg text-purple-400 dark:text-purple-400 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                  Live Chat
                </h3>
                <p className="mt-2 text-gray-300 dark:text-gray-300 text-sm">
                  Real-time conversations with peers and mentors to solve problems and share ideas.
                </p>
                <Button variant="outline" size="sm" className="mt-4 border-purple-700 dark:border-purple-700 text-purple-400 dark:text-purple-400 hover:bg-purple-900/20 dark:hover:bg-purple-900/20 transition-all duration-300">
                  Join Chat
                </Button>
              </div>

              <div className="bg-gray-800 dark:bg-gray-800 p-5 rounded-lg border border-gray-700 dark:border-gray-700 shadow-sm transition-all duration-300 hover:shadow-md">
                <h3 className="font-medium text-lg text-purple-400 dark:text-purple-400 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <path d="M21 15l-5-5L5 21"></path>
                  </svg>
                  Project Showcase
                </h3>
                <p className="mt-2 text-gray-300 dark:text-gray-300 text-sm">
                  Share your completed projects and get feedback from the community.
                </p>
                <Button variant="outline" size="sm" className="mt-4 border-purple-700 dark:border-purple-700 text-purple-400 dark:text-purple-400 hover:bg-purple-900/20 dark:hover:bg-purple-900/20 transition-all duration-300">
                  View Showcase
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events Section */}
      <div className="max-w-6xl mx-auto px-4 mt-10">
        <Card className="border border-gray-800 dark:border-gray-800 shadow-md animate-fade-in bg-gray-900">
          <CardHeader className="bg-gradient-to-r from-purple-900 to-purple-800 p-6">
            <Badge className="w-fit bg-white/20 text-white mb-3">
              EVENTS
            </Badge>
            <CardTitle className="text-xl md:text-2xl text-white flex items-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="mr-3" strokeWidth={2}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              Upcoming Events
            </CardTitle>
            <CardDescription className="text-purple-100">
              Workshops, webinars, and meetups to enhance your skills
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Event 1 */}
              <div className="flex flex-col md:flex-row gap-4 bg-gray-800 dark:bg-gray-800 p-4 rounded-lg border border-gray-700 dark:border-gray-700 overflow-hidden">
                <div className="flex-shrink-0 w-full md:w-36 h-24 bg-purple-900/30 dark:bg-purple-900/30 rounded-md flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-purple-400 dark:text-purple-400">MAY</span>
                  <span className="text-2xl font-bold text-white dark:text-white">15</span>
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium text-lg text-purple-400 dark:text-purple-400">Advanced React Patterns Workshop</h3>
                  <p className="text-sm text-gray-300 dark:text-gray-300 mt-1">Learn about React's advanced patterns for scalable component composition.</p>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant="outline" className="border-purple-700/50 dark:border-purple-700/50 text-purple-400 dark:text-purple-400">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="mr-1">
                        <path d="M12 2v2"></path>
                        <path d="M12 20v2"></path>
                        <path d="M2 12h2"></path>
                        <path d="M20 12h2"></path>
                        <path d="M18.36 18.36l-1.41-1.41"></path>
                        <path d="M5.64 5.64l1.41 1.41"></path>
                        <path d="M18.36 5.64l-1.41 1.41"></path>
                        <path d="M5.64 18.36l1.41-1.41"></path>
                      </svg>
                      Advanced
                    </Badge>
                    <Badge variant="outline" className="border-purple-700/50 dark:border-purple-700/50 text-purple-400 dark:text-purple-400">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="mr-1">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      2 Hours
                    </Badge>
                  </div>
                </div>
                <div className="flex-shrink-0 flex items-center justify-center md:justify-end mt-3 md:mt-0">
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-all duration-300">
                    Register
                  </Button>
                </div>
              </div>

              {/* Event 2 */}
              <div className="flex flex-col md:flex-row gap-4 bg-gray-800 dark:bg-gray-800 p-4 rounded-lg border border-gray-700 dark:border-gray-700 overflow-hidden">
                <div className="flex-shrink-0 w-full md:w-36 h-24 bg-purple-900/30 dark:bg-purple-900/30 rounded-md flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-purple-400 dark:text-purple-400">MAY</span>
                  <span className="text-2xl font-bold text-white dark:text-white">22</span>
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium text-lg text-purple-400 dark:text-purple-400">Full-Stack Development with Next.js</h3>
                  <p className="text-sm text-gray-300 dark:text-gray-300 mt-1">Explore how to build complete applications with Next.js and modern backend technologies.</p>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant="outline" className="border-purple-700/50 dark:border-purple-700/50 text-purple-400 dark:text-purple-400">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="mr-1">
                        <rect x="2" y="2" width="20" height="20" rx="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.5" y2="6.5"></line>
                      </svg>
                      Intermediate
                    </Badge>
                    <Badge variant="outline" className="border-purple-700/50 dark:border-purple-700/50 text-purple-400 dark:text-purple-400">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="mr-1">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      3 Hours
                    </Badge>
                  </div>
                </div>
                <div className="flex-shrink-0 flex items-center justify-center md:justify-end mt-3 md:mt-0">
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-all duration-300">
                    Register
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer Section */}
      <footer className="max-w-6xl mx-auto px-4 mt-12 py-6 border-t border-gray-800 dark:border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <Code className="h-5 w-5 text-purple-500 dark:text-purple-400" strokeWidth={2.5} />
            <span className="font-semibold text-white dark:text-white">WebDevPath</span>
          </div>

          <div className="flex items-center gap-2 text-gray-400 dark:text-gray-400 text-sm">
            <a href="#" className="hover:text-purple-400 dark:hover:text-purple-400 transition-colors duration-200">About</a>
            <span>•</span>
            <a href="#" className="hover:text-purple-400 dark:hover:text-purple-400 transition-colors duration-200">Privacy</a>
            <span>•</span>
            <a href="#" className="hover:text-purple-400 dark:hover:text-purple-400 transition-colors duration-200">Terms</a>
            <span>•</span>
            <a href="#" className="hover:text-purple-400 dark:hover:text-purple-400 transition-colors duration-200">Contact</a>
          </div>

          <div className="flex gap-3">
            <Button variant="ghost" size="icon" className="rounded-full bg-gray-800/50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-400 hover:text-purple-400 dark:hover:text-purple-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </svg>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full bg-gray-800/50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-400 hover:text-purple-400 dark:hover:text-purple-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full bg-gray-800/50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-400 hover:text-purple-400 dark:hover:text-purple-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </Button>
          </div>
        </div>

        <div className="text-center mt-6 text-xs text-gray-500 dark:text-gray-500">
          © 2025 WebDevPath. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default WebDevelopmentCourse;