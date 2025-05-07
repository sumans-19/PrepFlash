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
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { 
  Brain, 
  Database, 
  HelpCircle, 
  Code, 
  FileText, 
  Sun, 
  Moon, 
  Rocket, 
  Star, 
  Zap, 
  FileCode,
  BarChart4,
  Network
} from 'lucide-react';

// Theme toggle component
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

// Learning resources for AI/ML
const aimlResources = [
  {
    id: "resource-1",
    title: "TensorFlow Documentation",
    description: "Comprehensive documentation for TensorFlow",
    url: "https://www.tensorflow.org/docs",
    category: "Documentation",
    icon: <Brain size={24} />,
    thumbnailUrl: "/api/placeholder/500/300"
  },
  {
    id: "resource-2",
    title: "Kaggle",
    description: "Platform for data science competitions and datasets",
    url: "https://www.kaggle.com",
    category: "Practice",
    icon: <Database size={24} />,
    thumbnailUrl: "/api/placeholder/500/300"
  },
  {
    id: "resource-3",
    title: "PyTorch Tutorials",
    description: "Learn deep learning using PyTorch",
    url: "https://pytorch.org/tutorials/",
    category: "Tutorial",
    icon: <Code size={24} />,
    thumbnailUrl: "/api/placeholder/500/300"
  },
  {
    id: "resource-4",
    title: "arXiv",
    description: "Repository of electronic preprints for AI/ML research papers",
    url: "https://arxiv.org/",
    category: "Research",
    icon: <FileText size={24} />,
    thumbnailUrl: "/api/placeholder/500/300"
  },
  {
    id: "resource-5",
    title: "Machine Learning Mastery",
    description: "Practical tutorials on machine learning algorithms",
    url: "https://machinelearningmastery.com/",
    category: "Tutorial",
    icon: <Brain size={24} />,
    thumbnailUrl: "/api/placeholder/500/300"
  },
  {
    id: "resource-6",
    title: "Hugging Face",
    description: "Platform for state-of-the-art NLP models",
    url: "https://huggingface.co/",
    category: "NLP",
    icon: <FileCode size={24} />,
    thumbnailUrl: "/api/placeholder/500/300"
  },
  {
    id: "resource-7",
    title: "Papers with Code",
    description: "Free and open resource of ML papers with code",
    url: "https://paperswithcode.com/",
    category: "Research",
    icon: <FileText size={24} />,
    thumbnailUrl: "/api/placeholder/500/300"
  },
  {
    id: "resource-8",
    title: "Google AI",
    description: "Google's AI research and tools",
    url: "https://ai.google/",
    category: "Research",
    icon: <Brain size={24} />,
    thumbnailUrl: "/api/placeholder/500/300"
  },
  {
    id: "resource-9",
    title: "Coursera - Andrew Ng's ML Course",
    description: "Foundational machine learning course",
    url: "https://www.coursera.org/learn/machine-learning",
    category: "Course",
    icon: <FileText size={24} />,
    thumbnailUrl: "/api/placeholder/500/300"
  }
];

// Resource List Component
const ResourceList = ({ resources }) => {
  const [filter, setFilter] = useState('all');
  const categories = ['all', ...new Set(resources.map(r => r.category))];
  
  const filteredResources = filter === 'all' 
    ? resources 
    : resources.filter(r => r.category === filter);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(cat => (
          <Badge 
            key={cat} 
            onClick={() => setFilter(cat)}
            className={`cursor-pointer px-3 py-1 capitalize ${
              filter === cat 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {cat}
          </Badge>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map(resource => (
          <a 
            href={resource.url} 
            target="_blank" 
            rel="noopener noreferrer"
            key={resource.id} 
            className="group"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
              <div className="h-40 bg-indigo-100 dark:bg-indigo-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 group-hover:opacity-70 transition-opacity duration-300"></div>
                <div className="flex items-center justify-center h-full text-indigo-600 dark:text-indigo-400">
                  {resource.icon && React.cloneElement(resource.icon, { size: 48 })}
                </div>
              </div>
              
              <div className="p-4 flex-1 flex flex-col">
                <div className="mb-2">
                  <Badge variant="outline" className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800">
                    {resource.category}
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                  {resource.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm flex-1">
                  {resource.description}
                </p>
                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                  <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                    Explore <Rocket size={14} className="transform group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

// Simple Quiz Component
const QuizSection = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  
  const questions = [
    {
      id: 1,
      question: "Which of the following is NOT a type of machine learning?",
      options: [
        "Supervised Learning", 
        "Unsupervised Learning", 
        "Deterministic Learning", 
        "Reinforcement Learning"
      ],
      correctAnswer: "Deterministic Learning"
    },
    {
      id: 2,
      question: "What is the primary goal of supervised learning?",
      options: [
        "To predict outcomes based on labeled data", 
        "To find hidden patterns in unlabeled data", 
        "To maximize rewards in a given environment", 
        "To reduce dimensionality of datasets"
      ],
      correctAnswer: "To predict outcomes based on labeled data"
    },
    {
      id: 3,
      question: "Which algorithm is commonly used for clustering in unsupervised learning?",
      options: [
        "Random Forest", 
        "K-Means", 
        "Logistic Regression", 
        "Support Vector Machine"
      ],
      correctAnswer: "K-Means"
    },
    {
      id: 4,
      question: "What is the purpose of the activation function in a neural network?",
      options: [
        "To initialize weights", 
        "To introduce non-linearity", 
        "To normalize input data", 
        "To prevent network training"
      ],
      correctAnswer: "To introduce non-linearity"
    },
    {
      id: 5,
      question: "Which layer in a CNN is responsible for feature extraction?",
      options: [
        "Fully Connected Layer", 
        "Output Layer", 
        "Convolutional Layer", 
        "Normalization Layer"
      ],
      correctAnswer: "Convolutional Layer"
    }
  ];
  
  const handleAnswer = (selectedOption) => {
    if (selectedOption === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowResults(true);
      onComplete && onComplete();
    }
  };
  
  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
  };
  
  return (
    <div className="space-y-6">
      {showResults ? (
        <div className="text-center py-8">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-3xl font-bold mb-4">
              {score}/{questions.length}
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              {score === questions.length 
                ? "Perfect Score!" 
                : score >= questions.length / 2 
                  ? "Well Done!" 
                  : "Keep Learning!"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {score === questions.length 
                ? "You're a cosmic AI genius!" 
                : score >= questions.length / 2 
                  ? "You're on your way to AI mastery." 
                  : "The AI universe has more secrets for you to uncover."}
            </p>
          </div>
          <Button 
            onClick={resetQuiz}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Try Again
          </Button>
        </div>
      ) : (
        <div>
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <Badge className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 px-3 py-1">
                Question {currentQuestion + 1} of {questions.length}
              </Badge>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Score: {score}
              </span>
            </div>
            <Progress 
              value={(currentQuestion / questions.length) * 100} 
              className="h-2 bg-gray-100 dark:bg-gray-800" 
            />
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6">
              {questions[currentQuestion].question}
            </h3>
            
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="w-full text-left p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors duration-200 text-gray-700 dark:text-gray-300 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Code Editor Mock Component
const CodeEditor = ({ initialCode, onSave }) => {
  const [code, setCode] = useState(initialCode);
  
  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700 shadow-xl">
      <div className="bg-gray-800 px-4 py-2 flex justify-between items-center">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-xs text-gray-400">python_ml_example.py</div>
        <div></div>
      </div>
      
      <div className="p-4 font-mono text-sm">
        <textarea
          className="w-full h-80 bg-gray-900 text-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck="false"
        />
      </div>
      
      <div className="bg-gray-800 px-4 py-3 flex justify-end">
        <Button 
          onClick={onSave}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Run Code
        </Button>
      </div>
    </div>
  );
};

// Weekly Goals Components
const WeeklyGoals = ({ courseType }) => {
  const goals = [
    { id: 1, title: "Complete Neural Networks basics", progress: 80 },
    { id: 2, title: "Build first classification model", progress: 60 },
    { id: 3, title: "Read 3 research papers", progress: 30 },
    { id: 4, title: "Complete Kaggle exercise", progress: 0 }
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">Your AI/ML Learning Goals</h2>
      <div className="space-y-4">
        {goals.map(goal => (
          <div key={goal.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-gray-800 dark:text-gray-200">{goal.title}</h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">{goal.progress}%</span>
            </div>
            <Progress value={goal.progress} className="h-2 bg-gray-200 dark:bg-gray-700" />
          </div>
        ))}
      </div>
    </div>
  );
};

const SetWeeklyGoals = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">Set Your AI/ML Learning Goals</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Goal Title</label>
          <input type="text" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200" placeholder="e.g., Complete Reinforcement Learning Tutorial" />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Target Completion Date</label>
          <input type="date" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200" />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
          <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        
        <div className="pt-4">
          <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
            Save Goal
          </Button>
        </div>
      </div>
    </div>
  );
};

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

const AIMLCourse = () => {
  const { toast } = useToast();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(25), 750);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen pb-16 relative bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-blue-50/50 dark:from-gray-900 dark:via-indigo-950/30 dark:to-purple-950/50 transition-all duration-500">
      {/* Top Bar Section */}
      <div className="mx-4 md:mx-8 mt-4 flex justify-between items-start z-10 relative">
        <Badge className="mb-4 bg-white/20 hover:bg-white/30 text-gray-800 dark:text-gray-200 transition-all duration-300"></Badge>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          {/* Weekly Goals dialog */}
          <WeeklyGoalsDialog title="Weekly Goals" component={() => <WeeklyGoals courseType="ai-ml" />}>
            <Button 
              size="sm" 
              variant="outline"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 shadow-md transition-all duration-300"
            >
              Weekly Goals
            </Button>
          </WeeklyGoalsDialog>
          
          {/* Set Weekly Goals dialog */}
          <WeeklyGoalsDialog title="Set Weekly Goals" component={() => <SetWeeklyGoals />}>
            <Button 
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white hover:opacity-90 shadow-md transition-all duration-300"
            >
              Set Weekly Goals
            </Button>
          </WeeklyGoalsDialog>
        </div>
      </div>

      {/* Enhanced Cosmic Background */}
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

      {/* Cosmic Hero Section */}
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
              <Brain className="mr-2 inline-block h-4 w-4" /> AI/ML Odyssey
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              Embark on Your<br/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">AI/ML Universe</span>
            </h1>
            
            <p className="text-lg md:text-xl text-indigo-100 max-w-2xl leading-relaxed">
              Unlock the secrets of artificial intelligence and machine learning. From neural networks to deep learning, prepare for liftoff into a new dimension of algorithmic mastery!
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
<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full glow-effect">
  <div className="absolute inset-0 bg-white opacity-80 rounded-full blur-lg animate-pulse"></div>
  <div className="absolute inset-2 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full flex items-center justify-center">
    <Brain size={36} className="text-white/90" />
  </div>
</div>

{/* Orbiting planets/nodes */}
<div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
  {/* Planet 1 */}
  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-orbit" style={{ animationDuration: '30s' }}>
    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/50">
      <Database size={18} className="text-white" />
    </div>
  </div>
  
  {/* Planet 2 */}
  <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 animate-orbit" style={{ animationDuration: '25s', animationDelay: '5s' }}>
    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50">
      <Network size={16} className="text-white" />
    </div>
  </div>
  
  {/* Planet 3 */}
  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 animate-orbit" style={{ animationDuration: '35s', animationDelay: '2s' }}>
    <div className="w-14 h-14 bg-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50">
      <Code size={20} className="text-white" />
    </div>
  </div>
  
  {/* Planet 4 */}
  <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 animate-orbit" style={{ animationDuration: '28s', animationDelay: '8s' }}>
    <div className="w-11 h-11 bg-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-pink-500/50">
      <BarChart4 size={17} className="text-white" />
    </div>
  </div>
</div>
</div>
</div>
</div>
</div>

{/* Main Content */}
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
<Tabs defaultValue="learn" className="w-full">
<TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto mb-8 bg-white/10 dark:bg-gray-800/30 backdrop-blur-md p-1 rounded-lg">
  <TabsTrigger value="learn" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-md py-2 transition-all duration-300">
    <FileText size={16} className="mr-2" /> Learn
  </TabsTrigger>
  <TabsTrigger value="practice" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-md py-2 transition-all duration-300">
    <Code size={16} className="mr-2" /> Practice
  </TabsTrigger>
  <TabsTrigger value="quiz" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-md py-2 transition-all duration-300">
    <HelpCircle size={16} className="mr-2" /> Quiz
  </TabsTrigger>
  <TabsTrigger value="resources" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-md py-2 transition-all duration-300">
    <Database size={16} className="mr-2" /> Resources
  </TabsTrigger>
</TabsList>

<TabsContent value="learn" className="mt-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    <Card className="shadow-md overflow-hidden border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
        <CardTitle className="flex items-center">
          <Brain className="mr-2 h-5 w-5" /> 
          Neural Networks Fundamentals
        </CardTitle>
        <CardDescription className="text-indigo-100">
          Understanding the basics of neural architecture
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="text-gray-600 dark:text-gray-300">
          Neural networks are inspired by the human brain's structure and function. Learn about neurons, activation functions, backpropagation, and how these networks learn patterns from data.
        </p>
        <div className="mt-4">
          <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">Beginner</Badge>
          <Badge className="ml-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">Module 1</Badge>
        </div>
        <Button className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white">
          Start Learning
        </Button>
      </CardContent>
    </Card>
    
    <Card className="shadow-md overflow-hidden border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
        <CardTitle className="flex items-center">
          <Code className="mr-2 h-5 w-5" /> 
          Deep Learning Architecture
        </CardTitle>
        <CardDescription className="text-purple-100">
          Explore advanced neural network structures
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="text-gray-600 dark:text-gray-300">
          Deep learning extends neural networks with multiple hidden layers, enabling the modeling of complex patterns. Discover CNNs, RNNs, LSTMs, and transformers for various AI tasks.
        </p>
        <div className="mt-4">
          <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">Intermediate</Badge>
          <Badge className="ml-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">Module 2</Badge>
        </div>
        <Button className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white">
          Start Learning
        </Button>
      </CardContent>
    </Card>
    
    <Card className="shadow-md overflow-hidden border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardTitle className="flex items-center">
          <Database className="mr-2 h-5 w-5" /> 
          Data Preprocessing & Feature Engineering
        </CardTitle>
        <CardDescription className="text-blue-100">
          Preparing data for machine learning models
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="text-gray-600 dark:text-gray-300">
          The success of machine learning models heavily depends on data quality. Learn essential techniques for cleaning data, handling missing values, normalization, and creating meaningful features.
        </p>
        <div className="mt-4">
          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">Intermediate</Badge>
          <Badge className="ml-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">Module 3</Badge>
        </div>
        <Button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white">
          Start Learning
        </Button>
      </CardContent>
    </Card>
    
    <Card className="shadow-md overflow-hidden border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-pink-500 to-pink-600 text-white">
        <CardTitle className="flex items-center">
          <Star className="mr-2 h-5 w-5" /> 
          Generative AI & Transformers
        </CardTitle>
        <CardDescription className="text-pink-100">
          Explore the cutting-edge of AI research
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="text-gray-600 dark:text-gray-300">
          Generative AI is revolutionizing how we create content. Dive into transformer architectures, attention mechanisms, and the latest advances in text, image, and audio generation.
        </p>
        <div className="mt-4">
          <Badge className="bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300">Advanced</Badge>
          <Badge className="ml-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">Module 4</Badge>
        </div>
        <Button className="mt-6 w-full bg-pink-600 hover:bg-pink-700 text-white">
          Start Learning
        </Button>
      </CardContent>
    </Card>
  </div>
</TabsContent>

<TabsContent value="practice" className="mt-6">
  <div className="grid grid-cols-1 gap-8">
    <Card className="shadow-md overflow-hidden border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <CardTitle>Interactive Code Practice</CardTitle>
        <CardDescription className="text-indigo-100">
          Write and execute Python code for ML tasks
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <CodeEditor
          initialCode={`import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import accuracy_score

# Load and prepare sample data
# This is a simple example using the iris dataset
from sklearn.datasets import load_iris

iris = load_iris()
X = iris.data
y = iris.target

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale the features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Create and train the neural network model
model = MLPClassifier(hidden_layer_sizes=(10, 5), max_iter=1000, random_state=42)
model.fit(X_train_scaled, y_train)

# Make predictions
y_pred = model.predict(X_test_scaled)

# Evaluate the model
accuracy = accuracy_score(y_test, y_pred)
print(f"Model accuracy: {accuracy:.4f}")

# Try modifying the hidden layer sizes or other parameters!
`}
          onSave={() => {
            toast({
              title: "Code Execution",
              description: "Model accuracy: 0.9667 - Great job! Your neural network is performing well.",
            });
          }}
        />
      </CardContent>
    </Card>
  </div>
</TabsContent>

<TabsContent value="quiz" className="mt-6">
  <Card className="shadow-md overflow-hidden border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
    <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <CardTitle>Test Your Knowledge</CardTitle>
      <CardDescription className="text-indigo-100">
        Challenge yourself with AI/ML concepts
      </CardDescription>
    </CardHeader>
    <CardContent className="pt-6">
      <QuizSection 
        onComplete={() => {
          toast({
            title: "Quiz Completed!",
            description: "Great job! You've earned 50 AI mastery points.",
          });
        }}
      />
    </CardContent>
  </Card>
</TabsContent>

<TabsContent value="resources" className="mt-6">
  <Card className="shadow-md overflow-hidden border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
    <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <CardTitle>AI/ML Learning Resources</CardTitle>
      <CardDescription className="text-indigo-100">
        Curated collection of helpful resources
      </CardDescription>
    </CardHeader>
    <CardContent className="pt-6">
      <ResourceList resources={aimlResources} />
    </CardContent>
  </Card>
</TabsContent>
</Tabs>
</div>

{/* Footer */}
<footer className="mt-16 py-8 border-t border-indigo-100 dark:border-gray-800">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <div className="flex flex-col md:flex-row justify-between items-center">
    <div className="mb-6 md:mb-0">
      <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center">
        <Brain size={24} className="mr-2" /> AI/ML Universe
      </h3>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Embark on your AI/ML journey and discover the cosmos of machine intelligence
      </p>
    </div>
    
    <div className="flex space-x-6">
      <a href="#" className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-300 transition-colors duration-300">
        <span className="sr-only">Documentation</span>
        <FileText size={20} />
      </a>
      <a href="#" className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-300 transition-colors duration-300">
        <span className="sr-only">Community</span>
        <Network size={20} />
      </a>
      <a href="#" className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-300 transition-colors duration-300">
        <span className="sr-only">GitHub</span>
        <Code size={20} />
      </a>
    </div>
  </div>
  
  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400">
    <p>© {new Date().getFullYear()} AI/ML Universe. All rights reserved.</p>
    <div className="mt-2 flex justify-center space-x-4">
      <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Privacy Policy</a>
      <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Terms of Service</a>
      <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Contact</a>
    </div>
  </div>
</div>
</footer>
</div>
);
};

export default AIMLCourse;