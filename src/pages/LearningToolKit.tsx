import { useState, useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Book, Route, ArrowRight, ChevronRight, Star, Sparkles, Compass, BookOpen, GraduationCap, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import FlipCard from "@/components/learningtoolkit/FlipCard";
import NavigationArrow from "@/components/learningtoolkit/NavigationArrow";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { DashboardNav } from "@/components/DashboardNav";

// Custom animated components
const AnimatedCard = motion(Card);
const AnimatedTitle = motion.h1;
const AnimatedSubtitle = motion.p;

// Animated wave background
const WaveBackground = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <svg className="absolute top-0 left-0 w-full opacity-5" viewBox="0 0 1200 120" preserveAspectRatio="none">
      <path 
        d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
        className="fill-primary/20"
      />
    </svg>
    <svg className="absolute bottom-0 left-0 w-full opacity-5 rotate-180" viewBox="0 0 1200 120" preserveAspectRatio="none">
      <path 
        d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
        className="fill-primary/10"
      />
    </svg>
  </div>
);

// Floating particles animation
const ParticlesBackground = () => {
  const particles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    size: Math.random() * 6 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    opacity: Math.random() * 0.5 + 0.1
  }));

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-primary"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.opacity
          }}
          animate={{
            y: ["0%", "-20%", "0%"],
            opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity]
          }}
          transition={{
            duration: 3 + Math.random() * 7,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: Math.random() * 5
          }}
        />
      ))}
    </div>
  );
};

// Enhanced learning resource data
const beginnerResources = [
  {
    title: "Foundation Principles",
    description: "Learn the core concepts and fundamentals",
    details: "This comprehensive guide covers all the basic principles needed to build a strong foundation. Master the essential concepts before moving to more advanced topics.",
    icon: BookOpen,
    color: "from-blue-500/20 to-cyan-400/20",
    accent: "blue"
  },
  {
    title: "Interactive Tutorials",
    description: "Practice with guided examples and exercises",
    details: "Reinforce your knowledge through interactive examples and hands-on exercises designed to help you apply concepts in practical scenarios.",
    icon: Compass,
    color: "from-purple-500/20 to-pink-400/20",
    accent: "purple"
  },
  {
    title: "Starter Projects",
    description: "Build your first projects with step-by-step guidance",
    details: "Complete beginner-friendly projects that will help you apply what you've learned and build confidence in your abilities through practical application.",
    icon: Star,
    color: "from-amber-500/20 to-orange-400/20",
    accent: "amber"
  },
];

const advancedResources = [
  {
    title: "Advanced Techniques",
    description: "Master complex patterns and methodologies",
    details: "Dive deep into sophisticated techniques that will elevate your skills to an expert level. Learn optimization strategies and advanced problem-solving approaches.",
    icon: Brain,
    color: "from-emerald-500/20 to-green-400/20",
    accent: "emerald"
  },
  {
    title: "Real-world Applications",
    description: "Apply knowledge to complex, real-world scenarios",
    details: "Work on industry-level challenges that simulate real-world problems. Learn how to architect solutions for scalability, performance, and maintainability.",
    icon: GraduationCap,
    color: "from-rose-500/20 to-red-400/20",
    accent: "rose"
  },
];

// Enhanced Learning guide section component
const LearningGuideSection = () => {
  const [activeSection, setActiveSection] = useState("topKnot");
  const topKnotRef = useRef(null);
  const advancedRef = useRef(null);
  const [isVisible, setIsVisible] = useState({
    topKnot: false,
    advanced: false
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.target === topKnotRef.current) {
            setIsVisible(prev => ({ ...prev, topKnot: entry.isIntersecting }));
          } else if (entry.target === advancedRef.current) {
            setIsVisible(prev => ({ ...prev, advanced: entry.isIntersecting }));
          }
        });
      },
      { threshold: 0.1 }
    );

    if (topKnotRef.current) observer.observe(topKnotRef.current);
    if (advancedRef.current) observer.observe(advancedRef.current);

    return () => {
      if (topKnotRef.current) observer.unobserve(topKnotRef.current);
      if (advancedRef.current) observer.unobserve(advancedRef.current);
    };
  }, []);

  const scrollToSection = (section) => {
    setActiveSection(section);
    if (section === "advanced" && advancedRef.current) {
      advancedRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (section === "topKnot" && topKnotRef.current) {
      topKnotRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-24 relative py-8">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/4"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -z-10 transform -translate-x-1/3 translate-y-1/4"></div>
      
      {/* Top Knot Section */}
      <motion.div 
        ref={topKnotRef} 
        className="relative"
        initial={{ opacity: 0, y: 50 }}
        animate={isVisible.topKnot ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <AnimatedCard 
          className="overflow-visible shadow-lg border-0 bg-gradient-to-br from-primary/5 to-primary/10"
          whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-2xl -z-10"></div>
          <CardHeader className="pb-2">
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <CardTitle className="flex items-center gap-3 text-3xl font-bold">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Book className="h-8 w-8 text-primary" />
                </div>
                <span>Top Knot</span>
                <Sparkles className="h-6 w-6 text-amber-500 ml-2" />
              </CardTitle>
              <CardDescription className="text-lg pl-16 mt-1">
                Begin your learning journey with these foundational resources
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="flex flex-col lg:flex-row gap-8 relative py-6">
              {beginnerResources.map((resource, index) => (
                <motion.div 
                  key={index} 
                  className="flex-1 h-[320px] relative"
                  initial={{ opacity: 0, x: index * 50 }}
                  animate={isVisible.topKnot ? { opacity: 1, x: 0 } : { opacity: 0, x: index * 50 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                >
                  <FlipCard
                    frontContent={
                      <Card className="h-full border-0 shadow-md bg-gradient-to-br from-white to-white/80 dark:from-gray-900 dark:to-gray-800/90">
                        <div className={`absolute inset-0 bg-gradient-to-br ${resource.color} opacity-30 rounded-xl`}></div>
                        <CardHeader>
                          <CardTitle className="text-2xl font-bold">{resource.title}</CardTitle>
                          <CardDescription className="text-base">{resource.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-center h-28">
                            <div className={`p-4 rounded-full bg-${resource.accent}-100 dark:bg-${resource.accent}-900/30`}>
                              <resource.icon className="h-16 w-16 text-primary" />
                            </div>
                          </div>
                          <p className="text-center text-muted-foreground text-sm mt-6 font-medium">
                            Hover to explore details
                          </p>
                        </CardContent>
                      </Card>
                    }
                    backContent={
                      <Card className="h-full border-0 shadow-md bg-gradient-to-br from-primary/10 to-transparent backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle className="text-2xl font-bold">{resource.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground text-lg">
                            {resource.details}
                          </p>
                        </CardContent>
                        <CardFooter className="absolute bottom-0 left-0 right-0 justify-center pb-6">
                          <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-lg">
                            Explore Now <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    }
                  />
                  
                  {/* Navigation arrows between cards */}
                  {index < beginnerResources.length - 1 && (
                    <NavigationArrow className="lg:flex hidden" />
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="justify-center pb-8 pt-4">
            <Link to="/learningpath">
              <Button className="group bg-primary hover:bg-primary/90 shadow-lg px-6 py-6 text-lg font-medium h-auto transition-all duration-300 ease-in-out hover:translate-y-[-2px]">
                Continue to Advanced Topics
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardFooter>
        </AnimatedCard>
      </motion.div>

      {/* Advanced Topics Section */}
      <motion.div 
        ref={advancedRef} 
        className="relative"
        initial={{ opacity: 0, y: 50 }}
        animate={isVisible.advanced ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <AnimatedCard 
          className="overflow-visible shadow-lg border-0 bg-gradient-to-br from-primary/10 to-primary/20"
          whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-2xl -z-10"></div>
          <CardHeader className="pb-2">
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <CardTitle className="flex items-center gap-3 text-3xl font-bold">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <span>Advanced Topics</span>
                <Star className="h-6 w-6 text-amber-500 ml-2" />
              </CardTitle>
              <CardDescription className="text-lg pl-16 mt-1">
                Dive deeper with more advanced learning materials
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="flex flex-col lg:flex-row gap-8 relative py-6">
              {advancedResources.map((resource, index) => (
                <motion.div 
                  key={index} 
                  className="flex-1 h-[320px] relative"
                  initial={{ opacity: 0, x: index * 50 }}
                  animate={isVisible.advanced ? { opacity: 1, x: 0 } : { opacity: 0, x: index * 50 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                >
                  <FlipCard
                    frontContent={
                      <Card className="h-full border-0 shadow-md bg-gradient-to-br from-white to-white/80 dark:from-gray-900 dark:to-gray-800/90">
                        <div className={`absolute inset-0 bg-gradient-to-br ${resource.color} opacity-30 rounded-xl`}></div>
                        <CardHeader>
                          <CardTitle className="text-2xl font-bold">{resource.title}</CardTitle>
                          <CardDescription className="text-base">{resource.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-center h-28">
                            <div className={`p-4 rounded-full bg-${resource.accent}-100 dark:bg-${resource.accent}-900/30`}>
                              <resource.icon className="h-16 w-16 text-primary" />
                            </div>
                          </div>
                          <p className="text-center text-muted-foreground text-sm mt-6 font-medium">
                            Hover to explore details
                          </p>
                        </CardContent>
                      </Card>
                    }
                    backContent={
                      <Card className="h-full border-0 shadow-md bg-gradient-to-br from-primary/10 to-transparent backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle className="text-2xl font-bold">{resource.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground text-lg">
                            {resource.details}
                          </p>
                        </CardContent>
                        <CardFooter className="absolute bottom-0 left-0 right-0 justify-center pb-6">
                          <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-lg">
                            Explore Now <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    }
                  />
                  {/* Navigation arrows between cards */}
                  {index < advancedResources.length - 1 && (
                    <NavigationArrow className="lg:flex hidden" />
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="justify-center pb-8 pt-4">
            <Button 
              onClick={() => scrollToSection("topKnot")} 
              className="group bg-primary hover:bg-primary/90 shadow-lg px-6 py-6 text-lg font-medium h-auto transition-all duration-300 ease-in-out hover:translate-y-[-2px]"
            >
              Back to Top Knot
              <ChevronRight className="ml-2 h-5 w-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
            </Button>
          </CardFooter>
        </AnimatedCard>
      </motion.div>
    </div>
  );
};

// Enhanced Roadmap guide section component
const RoadmapGuideSection = () => {
  const [activeStep, setActiveStep] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const roadmapRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.target === roadmapRef.current) {
            setIsVisible(entry.isIntersecting);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (roadmapRef.current) observer.observe(roadmapRef.current);
    return () => {
      if (roadmapRef.current) observer.unobserve(roadmapRef.current);
    };
  }, []);

  const beginnerPath = [
    {
      title: "Foundations",
      description: "Master the core principles and essential concepts to build a strong knowledge base.",
      icon: BookOpen,
      color: "bg-blue-500",
    },
    {
      title: "Guided Practice",
      description: "Apply your knowledge with interactive exercises designed to reinforce learning.",
      icon: Compass,
      color: "bg-purple-500",
    },
    {
      title: "First Project",
      description: "Complete your first end-to-end project with guidance and detailed feedback.",
      icon: Star,
      color: "bg-amber-500",
    }
  ];

  const advancedPath = [
    {
      title: "Advanced Concepts",
      description: "Explore complex methodologies and cutting-edge techniques for deeper mastery.",
      icon: Brain,
      color: "bg-emerald-500",
    },
    {
      title: "Complex Projects",
      description: "Build sophisticated solutions that demonstrate your expertise and problem-solving abilities.",
      icon: GraduationCap,
      color: "bg-rose-500",
    },
    {
      title: "Real-World Contribution",
      description: "Collaborate on actual applications and contribute to meaningful projects with impact.",
      icon: Sparkles,
      color: "bg-sky-500",
    }
  ];

  return (
    
    <div className="space-y-16 py-8" ref={roadmapRef}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <AnimatedCard className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden">
          <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-2xl -z-10"></div>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-3xl font-bold">
              <div className="p-2 rounded-lg bg-primary/10">
                <Route className="h-8 w-8 text-primary" />
              </div>
              <span>Beginner Path</span>
            </CardTitle>
            <CardDescription className="text-lg pl-16 mt-1">Your first steps in the learning journey</CardDescription>
          </CardHeader>
          <CardContent className="relative pt-6">
            {/* Animated path line */}
            <motion.div 
              className="absolute left-10 top-4 h-full w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-amber-500 rounded-full"
              initial={{ scaleY: 0, originY: 0 }}
              animate={isVisible ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            ></motion.div>
            
            <ul className="space-y-12 relative">
              {beginnerPath.map((step, index) => (
                <motion.li 
                  key={index}
                  className="ml-24 relative"
                  initial={{ opacity: 0, x: -30 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.2 }}
                  onMouseEnter={() => setActiveStep(`beginner-${index}`)}
                  onMouseLeave={() => setActiveStep(null)}
                >
                  <motion.div 
                    className={`absolute -left-24 top-0 h-16 w-16 rounded-full ${step.color} flex items-center justify-center text-white shadow-lg`}
                    whileHover={{ scale: 1.1 }}
                    animate={activeStep === `beginner-${index}` ? { scale: 1.1, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" } : { scale: 1 }}
                  >
                    <step.icon className="h-8 w-8" />
                  </motion.div>
                  
                  <Card className={`border-l-4 border-${step.color.replace('bg-', '')} p-2 shadow-md transform transition-all duration-300 ${activeStep === `beginner-${index}` ? 'scale-105' : ''}`}>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-xl font-bold">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 p-4">
                      <p className="text-muted-foreground text-base">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </AnimatedCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
      >
        <AnimatedCard className="border-0 shadow-lg bg-gradient-to-br from-primary/10 to-primary/20 overflow-hidden">
          <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-2xl -z-10"></div>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-3xl font-bold">
              <div className="p-2 rounded-lg bg-primary/10">
                <Route className="h-8 w-8 text-primary" />
              </div>
              <span>Advanced Path</span>
            </CardTitle>
            <CardDescription className="text-lg pl-16 mt-1">Continue your journey with expert-level content</CardDescription>
          </CardHeader>
          <CardContent className="relative pt-6">
            {/* Animated path line */}
            <motion.div 
              className="absolute left-10 top-4 h-full w-1 bg-gradient-to-b from-emerald-500 via-rose-500 to-sky-500 rounded-full"
              initial={{ scaleY: 0, originY: 0 }}
              animate={isVisible ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
            ></motion.div>
            
            <ul className="space-y-12 relative">
              {advancedPath.map((step, index) => (
                <motion.li 
                  key={index}
                  className="ml-24 relative"
                  initial={{ opacity: 0, x: -30 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
                  onMouseEnter={() => setActiveStep(`advanced-${index}`)}
                  onMouseLeave={() => setActiveStep(null)}
                >
                  <motion.div 
                    className={`absolute -left-24 top-0 h-16 w-16 rounded-full ${step.color} flex items-center justify-center text-white shadow-lg`}
                    whileHover={{ scale: 1.1 }}
                    animate={activeStep === `advanced-${index}` ? { scale: 1.1, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" } : { scale: 1 }}
                  >
                    <step.icon className="h-8 w-8" />
                  </motion.div>
                  
                  <Card className={`border-l-4 border-${step.color.replace('bg-', '')} p-2 shadow-md transform transition-all duration-300 ${activeStep === `advanced-${index}` ? 'scale-105' : ''}`}>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-xl font-bold">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 p-4">
                      <p className="text-muted-foreground text-base">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </AnimatedCard>
      </motion.div>
    </div>
  );
};

const LearningToolKit = () => {
  const [activeTab, setActiveTab] = useState("learning-guide");
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);

  useEffect(() => {
    setIsHeaderVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <DashboardNav />
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 relative overflow-x-hidden">
      {/* Background elements */}
      <WaveBackground />
      <ParticlesBackground />
      
      <Header />
      
      <div className="container mx-auto py-16 px-6 flex-1 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="mb-16 text-center"
            initial={{ opacity: 0, y: -30 }}
            animate={isHeaderVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <AnimatedTitle 
              className="text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Learning Tool Kit
            </AnimatedTitle>
            
            <AnimatedSubtitle
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              Explore our comprehensive learning resources designed to help you master concepts 
              at your own pace with interactive guides and structured pathways.
            </AnimatedSubtitle>
          </motion.div>
          
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-1 mb-12">
              <TabsTrigger 
                value="learning-guide"
                className="text-lg py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Book className="mr-2 h-5 w-5" />
                Learning Guide
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="learning-guide" className="mt-6 focus-visible:outline-none focus-visible:ring-0">
              <LearningGuideSection />
            </TabsContent>
            
            <TabsContent value="learning-path" className="mt-6 focus-visible:outline-none focus-visible:ring-0">
              <RoadmapGuideSection />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Call to action footer */}
      <motion.div 
        className="bg-gradient-to-r from-primary/80 to-primary py-16 px-6 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <svg className="absolute top-0 left-0 w-full opacity-10" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path 
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
              className="fill-white"
            />
          </svg>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-white">Ready to start your learning journey?</h2>
              <p className="text-xl text-white/90">
                Join thousands of learners who have accelerated their growth with our structured learning paths and comprehensive resources.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/roadmap">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 h-auto font-medium">
                  Explore Roadmap
                </Button>
                </Link>
              </div>
            </div>
            
            <div className="p-8 bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
              <ul className="space-y-4">
                {[
                  { text: "Interactive learning experience with immediate feedback", icon: Sparkles },
                  { text: "Structured paths tailored to your skill level", icon: Route },
                  { text: "Expert-created content that's regularly updated", icon: Book },
                  { text: "Track your progress with detailed analytics", icon: Star },
                ].map((item, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                  >
                    <div className="bg-white/20 p-2 rounded-full mt-0.5">
                      <item.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-white/90 text-lg">{item.text}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
    </div>
  );
};

export default LearningToolKit;