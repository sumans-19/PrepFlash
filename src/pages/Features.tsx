
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RoadmapTimeline } from '@/components/RoadmapTimeline';
import FeatureCard from '@/components/FeatureCard';
import { ParallaxBackground } from '@/components/ParallaxBackground';
import { ScrollProgress } from '@/components/ScrollProgress';
import { 
  CircleCheck, 
  CircleDot, 
  ListCheck, 
  MapPin,
  StarHalf, 
  FileText,
  ListOrdered
} from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';

// Define our feature sections
const featureSections = [
  {
    title: 'AI Interview Practice',
    features: [
      {
        title: 'Interactive AI Interviews',
        description: 'Practice with our emotion-aware AI interviewer that adapts to your responses and provides real-time feedback.',
        icon: <CircleDot className="h-6 w-6 text-white" />
      },
      {
        title: 'Role-Based Sessions',
        description: 'Customize your interview practice for specific job roles, tech stacks, and difficulty levels.',
        icon: <ListCheck className="h-6 w-6 text-white" />
      },
      {
        title: 'Performance Analytics',
        description: 'Track your improvement with detailed analytics on your interview performance over time.',
        icon: <StarHalf className="h-6 w-6 text-white" />
      }
    ]
  },
  {
    title: 'Personalized Learning',
    features: [
      {
        title: 'Tech Trend Updates',
        description: 'Stay updated with the latest industry trends and technologies relevant to your career path.',
        icon: <CircleCheck className="h-6 w-6 text-white" />
      },
      {
        title: 'Skill Roadmaps',
        description: 'Follow personalized learning roadmaps based on your current skills and career goals.',
        icon: <MapPin className="h-6 w-6 text-white" />
      },
      {
        title: 'Weekly Challenges',
        description: 'Test your knowledge with weekly technical challenges designed to improve specific skill areas.',
        icon: <ListOrdered className="h-6 w-6 text-white" />
      }
    ]
  },
  {
    title: 'Resume & Profile Optimization',
    features: [
      {
        title: 'Smart Resume Builder',
        description: 'Create professional, ATS-optimized resumes with our AI-powered builder that highlights your strengths.',
        icon: <FileText className="h-6 w-6 text-white" />
      },
      {
        title: 'Comparative Analysis',
        description: 'See how your profile stacks up against industry standards and job requirements.',
        icon: <CircleDot className="h-6 w-6 text-white" />
      },
      {
        title: 'Skills Gap Assessment',
        description: 'Identify skills gaps between your current profile and your dream job requirements.',
        icon: <StarHalf className="h-6 w-6 text-white" />
      }
    ]
  }
];

const Features = () => {
  const [activeSection, setActiveSection] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollY } = useScroll();
  
  const rotateX = useTransform(scrollY, [0, 1000], [20, 0]);
  const opacity = useTransform(scrollY, [0, 100], [0.3, 1]);
  
  // Handle scroll to update the active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      
      sectionRefs.current.forEach((section, index) => {
        if (!section) return;
        
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          setActiveSection(index);
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      <ScrollProgress />
      <ParallaxBackground />
      <AnimatedBackground />
      
      <header className="border-b bg-background/80 backdrop-blur-md fixed w-full z-40">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-full bg-gradient-to-br from-[#9b87f5] to-[#7E69AB] grid place-items-center text-white font-bold">P</span>
            <span className="font-semibold text-lg">PrepWise</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/features" className="text-sm font-medium hover:text-foreground transition-colors">
              Features
            </Link>
            <Link to="/practice" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Practice
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link to="/auth">Log In</Link>
            </Button>
            <Button asChild style={{ background: 'linear-gradient(135deg, #9b87f5 0%, #7E69AB 100%)' }}>
              <Link to="/auth">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>
      
      <main className="pt-16">
        {/* Hero Section */}
        <div className="container px-4 pt-20 pb-24 flex flex-col items-center justify-center min-h-[60vh]">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-4 max-w-4xl"
          >
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-[#9b87f5] via-[#7E69AB] to-[#33C3F0]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Your Interview Success Roadmap
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              Discover the complete suite of features designed to transform your interview preparation
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Button
                size="lg"
                className="mt-8 font-medium text-lg"
                style={{
                  background: `linear-gradient(135deg, #9b87f5 0%, #7E69AB 100%)`,
                }}
                asChild
              >
                <Link to="/practice">
                  Start Your Journey
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Roadmap Section */}
        <div ref={containerRef} className="container px-4 py-20">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-[#9b87f5] to-[#7E69AB]">
              Your Path to Interview Success
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Our comprehensive features work together to build your confidence and skills
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Timeline */}
            <div className="hidden md:block md:col-span-2">
              <div className="sticky top-32 h-[500px]">
                <RoadmapTimeline 
                  activeSection={activeSection} 
                  sections={featureSections.length}
                />
              </div>
            </div>
            
            {/* Feature Cards */}
            <div className="md:col-span-10 space-y-32">
              {featureSections.map((section, sectionIndex) => (
                <div
                  key={sectionIndex}
                  ref={el => sectionRefs.current[sectionIndex] = el}
                  className="scroll-mt-32"
                >
                  <motion.h3
                    className="text-2xl md:text-3xl font-bold mb-12 pl-4 border-l-4 border-[#9b87f5]"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: false, margin: "-100px 0px" }}
                  >
                    {section.title}
                  </motion.h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {section.features.map((feature, index) => (
                      <FeatureCard
                        key={index}
                        title={feature.title}
                        description={feature.description}
                        icon={feature.icon}
                        index={index}
                        direction={index % 2 === 0 ? 'left' : 'right'}
                        delay={sectionIndex * 0.1}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* 3D Floating Card */}
        <div className="container px-4 py-32 flex flex-col items-center justify-center">
          <motion.div 
            className="perspective-1000 w-full max-w-4xl"
            style={{ 
              rotateX,
              opacity,
              filter: "drop-shadow(0 25px 25px rgba(0, 0, 0, 0.15))",
            }}
          >
            <motion.div 
              className="relative w-full bg-gradient-to-r from-[#9b87f5]/10 via-[#7E69AB]/20 to-[#33C3F0]/10 rounded-xl border border-white/20 backdrop-blur-sm overflow-hidden p-8 md:p-12"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#9b87f5]/30 via-[#7E69AB]/20 to-[#33C3F0]/10 opacity-30" />
              <div className="relative z-10 text-center space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#9b87f5] to-[#33C3F0]">
                  Ready to Transform Your Interview Skills?
                </h2>
                <p className="text-lg max-w-2xl mx-auto text-muted-foreground">
                  Join thousands of job seekers who have improved their confidence and landing their dream jobs with PrepWise.
                </p>
                <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" style={{ background: 'linear-gradient(135deg, #9b87f5 0%, #7E69AB 100%)' }} asChild>
                    <Link to="/auth">Get Started Free</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/practice">Try Demo</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-muted/30 backdrop-blur-md py-12 border-t">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="h-8 w-8 rounded-full bg-gradient-to-br from-[#9b87f5] to-[#7E69AB] grid place-items-center text-white font-bold">P</span>
                <span className="font-semibold">PrepWise</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered interview preparation to help you land your dream job
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/features" className="hover:text-foreground transition-colors">AI Interviews</Link></li>
                <li><Link to="/features" className="hover:text-foreground transition-colors">Learning Paths</Link></li>
                <li><Link to="/features" className="hover:text-foreground transition-colors">Resume Optimization</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/" className="hover:text-foreground transition-colors">Documentation</Link></li>
                <li><Link to="/" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link to="/" className="hover:text-foreground transition-colors">FAQs</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link to="/" className="hover:text-foreground transition-colors">Privacy</Link></li>
                <li><Link to="/" className="hover:text-foreground transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-muted-foreground/20 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} PrepWise. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Features;
