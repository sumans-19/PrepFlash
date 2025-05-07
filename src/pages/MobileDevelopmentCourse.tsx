
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
import ResourceList from '@/components/webdev/ResourceList';
import { BookOpen, Code, FileCode, HelpCircle, ExternalLink } from 'lucide-react';

const MobileDevelopmentCourse = () => {
  const { toast } = useToast();
  const [progress, setProgress] = useState(0);
  
  // Resources data
  const resources = [
    {
      id: "resource-1",
      title: "React Native",
      description: "Learn once, write anywhere - build mobile apps with JavaScript and React",
      url: "https://reactnative.dev",
      category: "Framework",
      icon: <Code size={24} />
    },
    {
      id: "resource-2",
      title: "Flutter",
      description: "Google's UI toolkit for building beautiful, natively compiled applications",
      url: "https://flutter.dev",
      category: "Framework",
      icon: <Code size={24} />
    },
    {
      id: "resource-3",
      title: "Android Developers",
      description: "Official resources for Android app developers",
      url: "https://developer.android.com",
      category: "Documentation",
      icon: <BookOpen size={24} />
    },
    {
      id: "resource-4",
      title: "Swift.org",
      description: "The official language for iOS app development",
      url: "https://swift.org",
      category: "Language",
      icon: <FileCode size={24} />
    },
    {
      id: "resource-5",
      title: "Ionic Framework",
      description: "Build cross-platform mobile apps with web technologies",
      url: "https://ionicframework.com",
      category: "Framework",
      icon: <Code size={24} />
    },
    {
      id: "resource-6",
      title: "Apple Developer",
      description: "Official resources for iOS app developers",
      url: "https://developer.apple.com",
      category: "Documentation",
      icon: <BookOpen size={24} />
    },
    {
      id: "resource-7",
      title: "Xamarin",
      description: "Microsoft's platform for building cross-platform mobile apps with C#",
      url: "https://dotnet.microsoft.com/apps/xamarin",
      category: "Framework",
      icon: <Code size={24} />
    },
    {
      id: "resource-8",
      title: "NativeScript",
      description: "Open-source framework to build native apps with Angular, Vue.js, TypeScript, or JavaScript",
      url: "https://nativescript.org/",
      category: "Framework",
      icon: <Code size={24} />
    },
    {
      id: "resource-9",
      title: "Mobile UI Patterns",
      description: "Collection of mobile UI design patterns and examples",
      url: "https://mobbin.design/",
      category: "Design",
      icon: <HelpCircle size={24} />
    }
  ];
  
  // Simulate progress increase
  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(15), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 pb-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-6 md:p-16 animate-fade-in">
        <div className="max-w-6xl mx-auto">
          <Badge className="mb-4 bg-white/20 hover:bg-white/30">Mobile Development</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Master Mobile Development</h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl">
            Learn to build native and cross-platform mobile applications for iOS and Android
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
              <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
                <CardTitle className="text-2xl">Introduction to Mobile Development</CardTitle>
                <CardDescription className="text-white/80">
                  Understanding mobile platforms and development approaches
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 animate-fade-in">
                <div className="prose max-w-none">
                  <p className="text-lg leading-relaxed mb-4">
                    Mobile development focuses on creating applications for mobile devices such as smartphones and tablets. 
                    The field includes native development (platform-specific) and cross-platform approaches that allow 
                    developers to build apps that work on multiple platforms.
                  </p>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3 section-header pb-2">Mobile Development Approaches</h3>
                  <p className="mb-4">There are several approaches to mobile development:</p>
                  <ul className="space-y-3 list-disc pl-5 mb-6">
                    <li>
                      <span className="font-semibold">Native Development</span>: Using platform-specific languages and tools (Swift/Objective-C for iOS, Java/Kotlin for Android)
                    </li>
                    <li>
                      <span className="font-semibold">Cross-Platform Frameworks</span>: Using technologies like React Native, Flutter, or Xamarin
                    </li>
                    <li>
                      <span className="font-semibold">Progressive Web Apps (PWAs)</span>: Web applications that provide a mobile app-like experience
                    </li>
                    <li>
                      <span className="font-semibold">Hybrid Apps</span>: Web apps wrapped in a native container using tools like Cordova
                    </li>
                  </ul>
                  
                  <div className="bg-accent p-4 rounded-lg mb-6">
                    <h4 className="font-semibold mb-2">Popular Mobile Development Frameworks</h4>
                    <p>
                      React Native, Flutter, Xamarin, and Ionic are among the most popular frameworks 
                      for building cross-platform mobile applications, each with its own strengths and trade-offs.
                    </p>
                  </div>
                  
                  <h3 className="text-xl font-semibold mt-8 mb-3 section-header pb-2">Key Mobile Development Concepts</h3>
                  <p className="mb-4">Important concepts in mobile development include:</p>
                  <ul className="space-y-3 list-disc pl-5 mb-6">
                    <li>Responsive UI design and adaptability to different screen sizes</li>
                    <li>Offline functionality and data persistence</li>
                    <li>Power and resource efficiency</li>
                    <li>Authentication and security</li>
                    <li>Push notifications and background processes</li>
                  </ul>
                  
                  <div className="bg-accent p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">App Store and Distribution</h4>
                    <p>
                      Understanding app store guidelines, submission processes, and best practices for both 
                      the Apple App Store and Google Play Store is essential for successful mobile app deployment.
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
                    className="bg-gradient-to-r from-blue-600 to-cyan-500"
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
            
            <ResourceList resources={resources} />
          </TabsContent>
          
          {/* Quiz Section */}
          <TabsContent value="quiz">
            <QuizSection />
          </TabsContent>
          
          {/* Practice Section */}
          <TabsContent value="practice">
            <Card className="glassmorphism mb-8 animate-fade-in">
              <CardHeader>
                <CardTitle>Practice Exercise: Mobile App UI</CardTitle>
                <CardDescription>
                  Practice building a simple mobile app interface
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-2">Instructions:</h3>
                  <p className="mb-4">
                    Create a simple mobile app login screen with the following elements:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-1">
                    <li>App logo or title</li>
                    <li>Username input field</li>
                    <li>Password input field</li>
                    <li>Login button</li>
                    <li>"Forgot password" link</li>
                  </ul>
                </div>
                
                <CodeEditor 
                  defaultCode={`<!-- Create a simple mobile login UI -->
<div class="mobile-container">
  <!-- Your code here -->
  
</div>

<style>
  .mobile-container {
    width: 320px;
    height: 568px;
    margin: 0 auto;
    border: 1px solid #ccc;
    border-radius: 20px;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
  }
  
  /* Add your styles here */
  
</style>`}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MobileDevelopmentCourse;