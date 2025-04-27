
import { Card, CardContent } from "@/components/ui/card";
import { FeatureCard } from "@/components/ui/feature-card";
import { BrainCircuit, CalendarCheck, FileSpreadsheet, Heart, MessageSquare, Mic, Star, Video } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export const Features = () => {
  const [animationTriggered, setAnimationTriggered] = useState(false);
  
  const features = [
    {
      icon: <CalendarCheck className="w-6 h-6" />,
      title: "Personalized Daily Roadmap",
      description: "Get a tailored preparation plan based on your job preferences, strengths, and weaknesses.",
      gradient: "from-prep-primary to-prep-secondary",
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "AI Mock Interviews",
      description: "Practice with realistic interview simulations in chat, speech, or video modes.",
      gradient: "from-prep-secondary to-prep-accent",
    },
    {
      icon: <BrainCircuit className="w-6 h-6" />,
      title: "Emotional Intelligence",
      description: "Get insights on your facial expressions, tone, and emotional signals during interviews.",
      gradient: "from-prep-accent to-prep-primary",
    },
    {
      icon: <FileSpreadsheet className="w-6 h-6" />,
      title: "Resume Analysis",
      description: "Get AI-powered suggestions to optimize your resume for specific job descriptions.",
      gradient: "from-prep-primary to-prep-secondary",
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Anxiety Management",
      description: "CBT-based tools to help manage interview anxiety and build confidence.",
      gradient: "from-prep-secondary to-prep-accent", 
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Gamified Learning",
      description: "Earn points and badges as you improve your interview skills and complete challenges.",
      gradient: "from-prep-accent to-prep-primary",
    },
  ];

  const techTitleRef = useRef<HTMLHeadingElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const roadmapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const techTitle = techTitleRef.current;
    const featuresSection = featuresRef.current;
    const roadmapSection = roadmapRef.current;

    if (techTitle && featuresSection && roadmapSection) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (entry.target === techTitle) {
                techTitle.classList.add('animate-text-pulse');
              } else if (entry.target === featuresSection) {
                const featureCards = featuresSection.querySelectorAll('.feature-card');
                featureCards.forEach((card, index) => {
                  setTimeout(() => {
                    card.classList.add('animate-fade-in');
                    card.classList.remove('opacity-0');
                  }, index * 150);
                });
              } else if (entry.target === roadmapSection) {
                setAnimationTriggered(true);
              }
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      observer.observe(techTitle);
      observer.observe(featuresSection);
      observer.observe(roadmapSection);

      return () => {
        observer.unobserve(techTitle);
        observer.unobserve(featuresSection);
        observer.unobserve(roadmapSection);
      };
    }
  }, []);

  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            AI-Powered <span className="text-prep-accent">Features</span> for Interview Success
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            PrepFlash combines cutting-edge AI technology with emotional intelligence to help you prepare for interviews like never before.
          </p>
        </div>

        <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="feature-card opacity-0 transition-all duration-500">
              <FeatureCard
                
                      title={feature.title}
                      description={feature.description}
                      variant={index % 3 === 1 ? "accent" : "default"}
                      className={`h-full transform transition-all duration-500 hover:-translate-y-2`} icon={undefined}              />
            </div>
          ))}
        </div>

        {/* Interactive Roadmap Preview */}
        <div ref={roadmapRef} className="mt-32 mb-20 text-center animate-on-scroll">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Explore Our Complete <span className="text-prep-accent">Interview Roadmap</span>
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
            Follow our systematic approach to interview mastery with our interactive roadmap
          </p>
          
          <div className="relative py-12 px-4 overflow-hidden">
            {/* Animated roadmap preview */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-prep-accent/30 transform -translate-x-1/2"></div>
            
            <div className={`absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-prep-lavender via-blue-500 to-purple-500 transform -translate-x-1/2 transition-all duration-1500 ease-in-out ${animationTriggered ? 'h-full' : 'h-0'}`}></div>
            
            {/* Roadmap nodes */}
            {['Preparation', 'Practice', 'Feedback', 'Mastery'].map((stage, index) => (
              <div 
                key={stage}
                className={`relative flex items-center mb-24 transition-all duration-700 delay-${index * 300} ${animationTriggered ? 'opacity-100' : 'opacity-0'}`}
                style={{
                  transform: animationTriggered ? 'translateY(0)' : 'translateY(20px)',
                  transitionDelay: `${index * 300}ms`
                }}
              >
                {/* Node */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-black border-2 border-prep-accent z-10 flex items-center justify-center">
                  <span className="text-prep-accent font-bold">{index + 1}</span>
                </div>
                
                {/* Content - alternating sides */}
                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:ml-auto' : 'md:mr-auto'} bg-card/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-prep-accent/20`}>
                  <h4 className="text-xl font-bold mb-2">{stage}</h4>
                  <p className="text-muted-foreground mb-4">
                    {index === 0 && "Build your knowledge and plan your interview strategy."}
                    {index === 1 && "Practice with AI mock interviews in multiple formats."}
                    {index === 2 && "Get detailed feedback and analytics on your performance."}
                    {index === 3 && "Refine your approach and achieve interview confidence."}
                  </p>
                </div>
              </div>
            ))}
            
            {/* CTA Button */}
            <div className={`text-center mt-8 transition-all duration-700 delay-1200 ${animationTriggered ? 'opacity-100' : 'opacity-0'}`}>
              <Button asChild className="bg-gradient-to-r from-prep-primary to-prep-accent text-white">
                <Link to="/roadmap">View Full Roadmap</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Tech Stack Banner - Animated */}
        <div className="mt-20 glass p-8 sm:p-12 rounded-2xl animate-on-scroll">
          <h3 ref={techTitleRef} className="text-xl md:text-2xl font-bold mb-8 text-center bg-gradient-to-r from-prep-primary via-prep-secondary to-prep-accent bg-clip-text text-transparent">
            Powered by Advanced Technology
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 mt-8">
            <div className="text-center transform transition-transform duration-300 hover:scale-110">
              <div className="w-16 h-16 mx-auto bg-card rounded-xl border border-border p-4 shadow-sm flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-prep-primary">
                  <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                  <path d="M17.5 17.5 12 12V6" />
                </svg>
              </div>
              <p className="text-sm font-medium">React Native</p>
              <p className="text-xs text-muted-foreground">Frontend</p>
            </div>
            <div className="text-center transform transition-transform duration-300 hover:scale-110">
              <div className="w-16 h-16 mx-auto bg-card rounded-xl border border-border p-4 shadow-sm flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-prep-secondary">
                  <path d="M20 4 8.5 15.5 4 12" />
                  <path d="M20 20H4" />
                </svg>
              </div>
              <p className="text-sm font-medium">Node.js</p>
              <p className="text-xs text-muted-foreground">Backend</p>
            </div>
            <div className="text-center transform transition-transform duration-300 hover:scale-110">
              <div className="w-16 h-16 mx-auto bg-card rounded-xl border border-border p-4 shadow-sm flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-prep-accent">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
              </div>
              <p className="text-sm font-medium">OpenAI</p>
              <p className="text-xs text-muted-foreground">AI Engine</p>
            </div>
            <div className="text-center transform transition-transform duration-300 hover:scale-110">
              <div className="w-16 h-16 mx-auto bg-card rounded-xl border border-border p-4 shadow-sm flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-prep-primary">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <p className="text-sm font-medium">Firebase</p>
              <p className="text-xs text-muted-foreground">Database</p>
            </div>
            <div className="text-center transform transition-transform duration-300 hover:scale-110">
              <div className="w-16 h-16 mx-auto bg-card rounded-xl border border-border p-4 shadow-sm flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-prep-secondary">
                  <path d="M12 2a10 10 0 0 0-7.743 16.33L12 22l7.743-3.67A10 10 0 0 0 12 2z" />
                  <circle cx="12" cy="12" r="4" />
                </svg>
              </div>
              <p className="text-sm font-medium">TensorFlow</p>
              <p className="text-xs text-muted-foreground">Facial Analysis</p>
            </div>
            <div className="text-center transform transition-transform duration-300 hover:scale-110">
              <div className="w-16 h-16 mx-auto bg-card rounded-xl border border-border p-4 shadow-sm flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-prep-accent">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32" />
                </svg>
              </div>
              <p className="text-sm font-medium">WebRTC</p>
              <p className="text-xs text-muted-foreground">Video Analysis</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
