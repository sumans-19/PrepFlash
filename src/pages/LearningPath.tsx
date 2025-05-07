// LearningPath.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CourseSelector from "@/components/learningpath/CourseSelector";
import CourseCard from "@/components/learningpath/CourseCard";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Rocket, Globe, Brain, Phone, Cloud, GamepadIcon, Apple, 
  BarChart, CloudCog, CloudLightning, Hash, Layers, Package, Puzzle, 
  Settings, Book, Code, Server, Layout, UploadCloud, BookOpen, CircleCheck
} from "lucide-react";
import { DashboardNav } from "@/components/DashboardNav";

// Enhanced animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring",
      stiffness: 90,
      damping: 12
    } 
  }
};

const pulseVariant = {
  initial: { scale: 1 },
  animate: { 
    scale: [1, 1.05, 1],
    transition: { 
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

interface Course {
  type: string;
  title: string;
  description: string;
}

const pathIcons = {
  "Web Development": <Globe className="w-6 h-6 mr-2" />,
  "AI/ML": <Brain className="w-6 h-6 mr-2" />,
  "Mobile Development": <Phone className="w-6 h-6 mr-2" />,
  "Cloud Computing": <Cloud className="w-6 h-6 mr-2" />,
  "Game Development": <GamepadIcon className="w-6 h-6 mr-2" />
};

const learningPaths: { [key: string]: Course[] } = {
  "Web Development": [
    {
      type: "frontend",
      title: "🌐 Frontend Fundamentals",
      description: "Master HTML, CSS, and JavaScript for interactive web pages.",
    },
    {
      type: "backend",
      title: "⚙️ Backend Development",
      description: "Learn server-side logic, databases, and APIs.",
    },
    {
      type: "frameworks",
      title: "⚛️ Modern Frameworks",
      description: "Explore React, Angular, or Vue.js for scalable applications.",
    },
    {
      type: "deployment",
      title: "🚀 Deployment & Hosting",
      description: "Deploy your web applications to the cloud.",
    },
  ],
  "AI/ML": [
    {
      type: "python",
      title: "🐍 Python for AI/ML",
      description: "Essential Python libraries like NumPy, Pandas, and Scikit-learn.",
    },
    {
      type: "machineLearning",
      title: "🤖 Machine Learning Basics",
      description: "Understand core ML algorithms and concepts.",
    },
    {
      type: "deepLearning",
      title: "🧠 Deep Learning",
      description: "Explore neural networks and deep learning frameworks like TensorFlow and PyTorch.",
    },
    {
      type: "dataScience",
      title: "📊 Data Science & Analysis",
      description: "Learn to analyze and visualize data for AI applications.",
    },
  ],
  "Mobile Development": [
    {
      type: "reactNative",
      title: "⚛️ React Native",
      description: "Build cross-platform mobile apps with JavaScript and React.",
    },
    {
      type: "android",
      title: "📱 Native Android",
      description: "Develop native Android applications with Kotlin or Java.",
    },
    {
      type: "ios",
      title: "🍎 Native iOS",
      description: "Build native iOS applications with Swift and Xcode.",
    },
    {
      type: "mobileDeployment",
      title: "📦 Mobile App Deployment",
      description: "Learn to package and deploy your mobile applications.",
    },
  ],
  "Cloud Computing": [
    {
      type: "aws",
      title: "☁️ AWS Fundamentals",
      description: "Get started with Amazon Web Services and its core services.",
    },
    {
      type: "azure",
      title: "🟦 Azure Basics",
      description: "Explore Microsoft Azure and its cloud computing platform.",
    },
    {
      type: "gcp",
      title: "🚀 Google Cloud Platform",
      description: "Learn about Google Cloud's services and solutions.",
    },
    {
      type: "devops",
      title: "🛠️ DevOps Practices",
      description: "Understand CI/CD, infrastructure as code, and cloud automation.",
    },
  ],
  "Game Development": [
    {
      type: "unity",
      title: "🕹️ Unity Engine",
      description: "Learn to create 2D and 3D games with the Unity platform.",
    },
    {
      type: "unreal",
      title: "🎮 Unreal Engine",
      description: "Explore the power of Unreal Engine for high-fidelity games.",
    },
    {
      type: "csharp",
      title: "👾 C# for Games",
      description: "Master C# programming for game development in Unity.",
    },
    {
      type: "gameDesign",
      title: "🎨 Game Design Principles",
      description: "Understand the fundamentals of creating engaging game experiences.",
    },
  ],
};

const LearningPath = () => {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [modalCourse, setModalCourse] = useState<null | string>(null);
  const [coursePath, setCoursePath] = useState<null | string>(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showPathTitle, setShowPathTitle] = useState<boolean>(false);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handlePathSelect = (path: string) => {
    setIsLoading(true);
    setShowPathTitle(false);
    
    setTimeout(() => {
      setSelectedPath(path);
      setIsLoading(false);
      
      // Show path title with a small delay for better animation flow
      setTimeout(() => {
        setShowPathTitle(true);
      }, 300);
    }, 600);
  };

  const handleStartJourney = () => {
    if (selectedPath) {
      navigate(`/${selectedPath.toLowerCase().replace(/\s+/g, '-')}`);
    } else {
      alert("Please select a learning path first!");
    }
  };

  const handleLearnMore = (type: string) => {
    setModalCourse(type);
    setCoursePath(selectedPath);
  };

  const closeModal = () => {
    setModalCourse(null);
  };

  const currentCourses = selectedPath ? learningPaths[selectedPath] : [];
  const startJourneyText = selectedPath ? `✨ Start ${selectedPath} Journey` : "✨ Select a Path to Begin";

  const getCourseDetails = (path: string | null, course: string | null) => {
    const details: { [key: string]: { [key: string]: string } } = {
      "Web Development": {
        "frontend": "Learn the foundations of HTML, CSS, and JavaScript. Build responsive layouts, create interactive elements, and understand modern web standards. By the end of this course, you'll be able to create beautiful, functional website frontends from scratch.",
        "backend": "Dive into server-side programming with Node.js, Express, and databases like MongoDB or PostgreSQL. Learn to build RESTful APIs, handle authentication, and implement business logic. You'll understand how to structure backend applications for scalability and performance.",
        "frameworks": "Master modern JavaScript frameworks like React, Angular, or Vue.js. Learn component-based architecture, state management, and how to build single-page applications. You'll be able to create complex, interactive UIs with clean, maintainable code.",
        "deployment": "Understand CI/CD pipelines, containerization with Docker, and cloud hosting options. Learn to deploy your applications to platforms like Vercel, Netlify, AWS, or Google Cloud. You'll be able to take your projects from development to production with confidence."
      },
      "AI/ML": {
        "python": "Master Python and essential data science libraries including NumPy, Pandas, Matplotlib, and Seaborn. Learn data manipulation, analysis, and visualization techniques. This foundation will prepare you for all aspects of AI and machine learning development.",
        "machineLearning": "Understand the core principles of machine learning, including supervised and unsupervised learning algorithms, regression, classification, clustering, and model evaluation. Build practical ML models using scikit-learn and solve real-world problems.",
        "deepLearning": "Dive into neural networks, convolutional networks, and recurrent networks using TensorFlow and PyTorch. Learn about transfer learning, GANs, and transformers. Build cutting-edge AI models for image recognition, NLP, and more.",
        "dataScience": "Master the end-to-end data science workflow from data collection and cleaning to analysis and visualization. Learn statistical methods, feature engineering, and how to communicate insights. Apply your skills to real-world datasets and business problems."
      },
      "Mobile Development": {
        "reactNative": "Learn to build cross-platform mobile apps with React Native. Master component structure, navigation systems, and state management. Integrate with device features and APIs to create production-ready mobile applications that run on both iOS and Android.",
        "android": "Dive into native Android development with Kotlin. Learn Android Studio, UI design with Material Components, data persistence, and integration with device features. Build robust, high-performance applications for the Android ecosystem.",
        "ios": "Master iOS development with Swift and the SwiftUI framework. Understand Apple's design principles, Core Data, networking, and app architecture patterns. Create beautiful, intuitive applications for the entire Apple ecosystem.",
        "mobileDeployment": "Learn the complete process of preparing, testing, and publishing mobile applications. Understand app store requirements, analytics integration, crash reporting, and continuous delivery. Get your apps into users' hands with professional deployment practices."
      },
      "Cloud Computing": {
        "aws": "Explore the comprehensive suite of Amazon Web Services. Learn to configure and manage EC2, S3, RDS, Lambda, and other core services. Understand cloud architecture principles and how to build scalable, secure applications on AWS.",
        "azure": "Master Microsoft Azure's cloud platform. Learn about Azure VMs, App Services, Azure Functions, and database options. Understand identity management, networking, and how to architect solutions using Microsoft's enterprise-focused cloud.",
        "gcp": "Dive into Google Cloud Platform's innovative services. Master Compute Engine, App Engine, Cloud Functions, BigQuery, and Google's AI/ML offerings. Build modern applications leveraging Google's infrastructure and cutting-edge technologies.",
        "devops": "Learn DevOps practices and tools including Git, GitHub Actions, Jenkins, Terraform, and Kubernetes. Understand infrastructure as code, container orchestration, and automated testing. Implement robust CI/CD pipelines for seamless software delivery."
      },
      "Game Development": {
        "unity": "Master the Unity game engine for 2D and 3D game development. Learn the Unity Editor, C# scripting, physics systems, animation, and audio integration. Build complete games from concept to publishable product using industry-standard tools.",
        "unreal": "Dive into Unreal Engine's powerful features for high-fidelity game development. Learn Blueprint visual scripting, C++ programming, material systems, and advanced rendering techniques. Create visually stunning and performant games for multiple platforms.",
        "csharp": "Build a strong foundation in C# programming for game development. Master object-oriented principles, game architecture patterns, and Unity-specific implementations. Create clean, maintainable code that powers engaging gameplay experiences.",
        "gameDesign": "Understand core game design principles including level design, gameplay mechanics, player psychology, and game balancing. Learn to create compelling experiences through iterative design and player-centered thinking. Transform good technical implementations into great games."
      }
    };

    return path && course && details[path] ? details[path][course] || "Course details not available." : "Course details not available.";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          {/* <DashboardNav /> */}
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white p-6 md:p-12 overflow-hidden relative">
      {/* Enhanced Animated Background with multiple layers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="stars absolute inset-0 z-0"></div>
        <div className="twinkling absolute inset-0 z-0"></div>
        <div className="clouds absolute inset-0 z-0"></div>
        
        {/* Decorative floating particles */}
        <div className="particles absolute inset-0 z-0">
          {Array.from({ length: 25 }).map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-white/5 backdrop-blur-sm"
              style={{
                width: `${Math.random() * 10 + 2}px`,
                height: `${Math.random() * 10 + 2}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 10 + 15}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Subtle glass morphism orbs */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/5 backdrop-blur-md"
            style={{
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 15 + 30}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 10}s`,
              opacity: 0.4
            }}
          />
        ))}
      </div>
  
      <motion.div
        className="max-w-6xl mx-auto space-y-12 relative z-10"
        initial="hidden"
        animate="show"
        variants={fadeIn}
      >
        {/* Header Section */}
        <div className="text-center space-y-6">
          <motion.div 
            className="flex items-center justify-center space-x-3 mb-2"
            variants={pulseVariant}
            initial="initial"
            animate="animate"
          >
            <Sparkles className="w-8 h-8 text-yellow-300" />
            <Rocket className="w-8 h-8 text-blue-300" />
            <Sparkles className="w-8 h-8 text-yellow-300" />
          </motion.div>
  
          <motion.h1
            className="text-6xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 drop-shadow-lg tracking-tight"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            Learning Journey
          </motion.h1>
          
          <motion.p 
            className="text-gray-300 max-w-2xl mx-auto text-xl backdrop-blur-sm p-5 rounded-xl bg-white/5 border border-white/10 shadow-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Embark on an epic learning adventure. Choose your path and transform your skills into superpowers.
          </motion.p>
        </div>
  
        {/* Course Selector */}
        <motion.div 
          className="backdrop-blur-lg bg-black/30 border border-white/20 rounded-2xl p-6 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <CourseSelector onSelect={handlePathSelect} paths={Object.keys(learningPaths)} />
        </motion.div>
  
        {/* Loading or Course Display */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              className="flex justify-center items-center h-64"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="loading"
            >
              <div className="orbit-spinner">
                <div className="orbit"></div>
                <div className="orbit"></div>
                <div className="orbit"></div>
              </div>
            </motion.div>
          ) : selectedPath && currentCourses.length > 0 ? (
            <motion.div
              key="courses"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="space-y-8"
            >
              <AnimatePresence>
                {showPathTitle && (
                  <motion.div
                    className="flex items-center justify-center space-x-4 bg-gradient-to-r from-indigo-900/80 to-purple-900/80 backdrop-blur-lg py-4 px-8 rounded-xl border border-white/20 shadow-lg max-w-max mx-auto"
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 200, 
                      damping: 20 
                    }}
                  >
                    <div className="p-2 rounded-full bg-white/10">
                      {selectedPath && pathIcons[selectedPath]}
                    </div>
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">{selectedPath} Path</h2>
                  </motion.div>
                )}
              </AnimatePresence>
  
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {currentCourses.map((course, index) => (
                  <motion.div
                    key={course.type}
                    variants={cardVariant}
                    custom={index}
                    whileHover={{ 
                      scale: 1.03, 
                      transition: { duration: 0.2 },
                      boxShadow: "0 0 25px 5px rgba(139, 92, 246, 0.3)"
                    }}
                  >
                    <CourseCard
                      type={course.type}
                      title={course.title}
                      description={course.description}
                      onLearnMore={handleLearnMore}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
  
        {/* Start Journey Button */}
        <motion.div
          className="flex justify-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <motion.button
            onClick={handleStartJourney}
            disabled={!selectedPath}
            className={`relative group px-16 py-4 text-xl font-bold rounded-full transition-all duration-500 overflow-hidden ${
              selectedPath ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white shadow-lg' : 'bg-gray-800 text-gray-400 cursor-not-allowed'
            }`}
            whileHover={selectedPath ? { scale: 1.05, boxShadow: "0 0 30px 5px rgba(139, 92, 246, 0.5)" } : {}}
            whileTap={selectedPath ? { scale: 0.95 } : {}}
          >
            <span className={`absolute inset-0 rounded-full ${selectedPath ? 
              'bg-gradient-to-r from-purple-500/50 to-blue-500/50 opacity-0 group-hover:opacity-100' : ''} transition-opacity duration-500`}>
            </span>
            
            <span className="relative z-10 flex items-center justify-center space-x-3">
              <Rocket className={`w-6 h-6 ${selectedPath ? 'text-white' : 'text-gray-500'}`} />
              <span>{startJourneyText}</span>
            </span>
            
            {selectedPath && (
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            )}
          </motion.button>
        </motion.div>
      </motion.div>
  
      {/* Enhanced Course Details Modal */}
      <AnimatePresence>
        {modalCourse && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="bg-gradient-to-br from-gray-900 to-purple-900/90 border border-white/20 p-8 rounded-2xl max-w-2xl w-full text-white space-y-6 shadow-2xl"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br from-white/20 to-white/5 ${modalCourse && getIconColor(modalCourse)}`}>
                  {modalCourse && getIcon(modalCourse)}
                </div>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
                  {currentCourses.find(c => c.type === modalCourse)?.title || modalCourse}
                </h2>
              </div>
              
              <div className="space-y-5">
                <p className="text-lg text-gray-200 leading-relaxed">
                  {getCourseDetails(coursePath, modalCourse)}
                </p>
                
                <div className="flex flex-wrap gap-3 pt-2">
                  {["Beginner", "12 weeks", "24 modules", "Certificate"].map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-white/10 rounded-full text-sm font-medium border border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between pt-6">
                <Button 
                  onClick={closeModal} 
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 hover:text-white"
                >
                  Close
                </Button>
                
                <Button 
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500"
                >
                  Enroll Now
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* CSS for animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        .stars {
          background: black url(http://www.script-tutorials.com/demos/360/images/stars.png) repeat top center;
          z-index: 0;
        }
        
        .twinkling {
          background: transparent url(http://www.script-tutorials.com/demos/360/images/twinkling.png) repeat top center;
          z-index: 1;
          animation: twinkle 200s linear infinite;
        }
        
        .clouds {
          background: transparent url(http://www.script-tutorials.com/demos/360/images/clouds3.png) repeat top center;
          z-index: 2;
          opacity: 0.2;
          animation: clouds 200s linear infinite;
        }
        
        @keyframes twinkle {
          from {background-position:0 0;}
          to {background-position:-10000px 5000px;}
        }
        
        @keyframes clouds {
          from {background-position:0 0;}
          to {background-position:10000px 0;}
        }
        
        .shadow-glow {
          box-shadow: 0 0 25px 5px rgba(139, 92, 246, 0.5);
        }
        
        .orbit-spinner {
          height: 100px;
          width: 100px;
          border-radius: 50%;
          perspective: 800px;
          position: relative;
        }
        
        .orbit {
          position: absolute;
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 3px solid transparent;
        }
        
        .orbit:nth-child(1) {
          border-top-color: #8b5cf6;
          animation: orbit-spin 1s linear infinite;
        }
        
        .orbit:nth-child(2) {
          border-right-color: #6366f1;
          animation: orbit-spin 1s linear infinite 0.33s;
        }
        
        .orbit:nth-child(3) {
          border-bottom-color: #ec4899;
          animation: orbit-spin 1s linear infinite 0.66s;
        }
        
        @keyframes orbit-spin {
          0% {
            transform: rotateX(0deg) rotateY(0deg);
          }
          100% {
            transform: rotateX(360deg) rotateY(360deg);
          }
        }
        
        /* Enhanced particle animations */
        .particles div {
          box-shadow: 0 0 10px 2px rgba(139, 92, 246, 0.3);
          opacity: 0.6;
        }
        
        /* Improved focus states for accessibility */
        button:focus, a:focus {
          outline: 2px solid rgba(139, 92, 246, 0.5);
          outline-offset: 2px;
        }
        
        /* Animated gradient buttons */
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .bg-gradient-animated {
          background-size: 200% 200%;
          animation: gradientShift 5s ease infinite;
        }
        `
      }} />
    </div>
    </div>
  );
};

// Helper functions to maintain compatibility with original component
const getIcon = (type: string) => {
  switch (type) {
    case "frontend":
      return <Code className="w-6 h-6" />;
    case "backend":
      return <Server className="w-6 h-6" />;
    case "frameworks":
      return <Layout className="w-6 h-6" />;
    case "deployment":
      return <UploadCloud className="w-6 h-6" />;
    case "python":
      return <Hash className="w-6 h-6" />;
    case "machineLearning":
      return <Brain className="w-6 h-6" />;
    case "deepLearning":
      return <Layers className="w-6 h-6" />;
    case "dataScience":
      return <BarChart className="w-6 h-6" />;
    case "reactNative":
      return <Phone className="w-6 h-6" />;
    case "android":
      return <Package className="w-6 h-6" />;
    case "ios":
      return <Apple className="w-6 h-6" />;
    case "mobileDeployment":
      return <Package className="w-6 h-6" />;
    case "aws":
      return <Cloud className="w-6 h-6" />;
    case "azure":
      return <CloudCog className="w-6 h-6" />;
    case "gcp":
      return <CloudLightning className="w-6 h-6" />;
    case "devops":
      return <Settings className="w-6 h-6" />;
    case "unity":
      return <GamepadIcon className="w-6 h-6" />;
    case "unreal":
      return <Puzzle className="w-6 h-6" />;
      case "csharp":
        return <Code className="w-6 h-6" />;
      case "gameDesign":
        return <BookOpen className="w-6 h-6" />;
      default:
        return <CircleCheck className="w-6 h-6" />;
    }
  };
  
  const getIconColor = (type: string) => {
    switch (type) {
      case "frontend":
      case "backend":
      case "frameworks":
      case "deployment":
        return "text-blue-400";
      case "python":
      case "machineLearning":
      case "deepLearning":
      case "dataScience":
        return "text-purple-400";
      case "reactNative":
      case "android":
      case "ios":
      case "mobileDeployment":
        return "text-green-400";
      case "aws":
      case "azure":
      case "gcp":
      case "devops":
        return "text-cyan-400";
      case "unity":
      case "unreal":
      case "csharp":
      case "gameDesign":
        return "text-red-400";
      default:
        return "text-white";
    }
  };
  
  export default LearningPath;