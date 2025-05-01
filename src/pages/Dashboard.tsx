import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Sparkles, Code, BookOpen, Users, Lightbulb, Target, ListChecks, TrendingUp, User } from "lucide-react";
import { Link } from 'react-router-dom';
import { DashboardNav } from '@/components/DashboardNav';
import { useTheme } from '@/components/ui/theme-provider';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface SectionCardProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  features: string[];
  to: string;
  accentColor: string;
}

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  hover: { 
    y: -8,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
};

const SectionCard = ({ title, icon, description, features, to, accentColor }: SectionCardProps) => {
  const { theme } = useTheme();

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="w-full"
    >
      <Card className="relative overflow-hidden border-2 dark:bg-gray-800/50 bg-white/50 backdrop-blur-sm h-full">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: `linear-gradient(135deg, ${accentColor}40 0%, transparent 100%)`,
          }} />
        <CardHeader className="relative z-10">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg" style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
              {icon}
            </span>
            <CardTitle className="text-xl">{title}</CardTitle>
          </div>
          <CardDescription className="text-sm mt-2">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <ul className="space-y-2 mb-6">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Target className="h-4 w-4" style={{ color: accentColor }} />
                {feature}
              </li>
            ))}
          </ul>
          <Button
            asChild
            className="w-full font-medium"
            style={{
              background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}90 100%)`,
            }}
          >
            <Link to={to} className="flex items-center justify-center gap-2">
              Explore {title}
              <Target className="w-4 h-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Dashboard = () => {
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const fetchUserName = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, 'profiles', auth.currentUser.uid));
        if (userDoc.exists()) {
          setUserName(userDoc.data().firstName || '');
        }
      }
    };
    fetchUserName();
  }, []);

  const sections = [
    {
      title: "Mock Interview",
      icon: <Sparkles className="h-5 w-5" />,
      description: "Master your interview skills with our AI-powered mock interview system.",
      features: [
        "Interactive AI-driven interview practice",
        "Real-time performance feedback",
        "Form, criteria, and analysis metrics",
        "Speech quality assessment"
      ],
      to: "/practice",
      accentColor: "#9b87f5"
    },
    {
      title: "Aptitude Question Bank",
      icon: <Code className="h-5 w-5" />,
      description: "Comprehensive aptitude preparation with topic-specific questions.",
      features: [
        "Topic, difficulty & company specific",
        "Daily practice challenges",
        "Performance analytics",
        "Selection criteria preparation"
      ],
      to: "/aptitudehome",
      accentColor: "#7E69AB"
    },
    {
      title: "Preparation Toolkit",
      icon: <ListChecks className="h-5 w-5" />,
      description: "Structured preparation tools and resources for comprehensive interview prep.",
      features: [
        "Formula cards and flashcards",
        "Mini quizzes and practice sets",
        "Key concepts and logic training",
        "Progressive learning modules"
      ],
      to: "/prep-toolkit",
      accentColor: "#D6BCFA"
    },
    {
      title: "Learning Toolkit",
      icon: <BookOpen className="h-5 w-5" />,
      description: "Customized learning paths and resources for skill development.",
      features: [
        "Role-based learning roadmaps",
        "Smart resume builder",
        "Company requirements tracking",
        "Emerging technologies updates"
      ],
      to: "/learning",
      accentColor: "#33C3F0"
    },
    {
      title: "Community Activity",
      icon: <Users className="h-5 w-5" />,
      description: "Connect with peers and engage in collaborative learning.",
      features: [
        "Discussion forums and Q&A",
        "Daily tech trends and insights",
        "Leaderboard and achievements",
        "Collaborative study groups"
      ],
      to: "/community",
      accentColor: "#FFB86C"
    },
    {
      title: "Project Zone",
      icon: <Code className="h-5 w-5" />,
      description: "Hands-on project experience and portfolio building.",
      features: [
        "Mini and mega projects",
        "Challenge-based learning",
        "Project timeline tracking",
        "Portfolio showcase"
      ],
      to: "/projects",
      accentColor: "#50FA7B"
    },
    {
      title: "Profile Info",
      icon: <User className="h-5 w-5" />,
      description: "Manage your profile and track your progress.",
      features: [
        "Skills assessment and tracking",
        "Resume builder and analyzer",
        "Interview history logging",
        "Performance analytics"
      ],
      to: "/profile",
      accentColor: "#FF79C6"
    },
    {
      title: "Tech News & Trends",
      icon: <TrendingUp className="h-5 w-5" />,
      description: "Stay updated with latest industry trends and insights.",
      features: [
        "Daily tech news digest",
        "Industry insights and analysis",
        "Emerging technology updates",
        "Company-specific news"
      ],
      to: "/tech-news",
      accentColor: "#BD93F9"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <DashboardNav />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            {userName ? `Welcome back, ${userName}!` : 'Welcome to PrepFlash'}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your personalized interview preparation platform. Choose a section below to begin your journey towards interview success.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <SectionCard {...section} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
