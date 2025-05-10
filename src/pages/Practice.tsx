import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Video, Mic, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DashboardNav } from '@/components/DashboardNav';

const practiceTypes = [
  {
    id: "chat",
    icon: <MessageSquare className="h-6 w-6" />,
    title: "Chat Practice",
    description: "Perfect your interview responses through text-based conversations with our AI interviewer.",
    features: ["Real-time feedback", "Unlimited practice sessions", "Personal improvement insights"],
    gradient: ["#9b87f5", "#7E69AB"],
    to: "/chat-practices"
  },
  {
    id: "video",
    icon: <Video className="h-6 w-6" />,
    title: "Video Interview",
    description: "Simulate real interview environments with comprehensive video analysis.",
    features: ["Body language analysis", "Expression feedback", "Professional evaluation"],
    gradient: ["#7E69AB", "#D6BCFA"],
    to: "/video-mode"
  },
  {
    id: "voice",
    icon: <Mic className="h-6 w-6" />,
    title: "Voice Practice",
    description: "Master your verbal communication with advanced voice analysis.",
    features: ["Speech clarity check", "Tone analysis", "Confidence scoring"],
    gradient: ["#D6BCFA", "#9b87f5"],
    to: "http://localhost:5173/"
  }
];

const Practice = () => {
  const handleExternalNavigation = (url: string) => {
    window.location.href = url;
  };

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
            Choose Your Interview Practice Mode
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select the practice mode that best suits your preparation style and goals
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {practiceTypes.map((type, index) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <Card className="relative overflow-hidden border-2 h-full dark:bg-gray-800/50 bg-white/50 backdrop-blur-sm">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    background: `linear-gradient(135deg, ${type.gradient[0]}40 0%, ${type.gradient[1]}40 100%)`,
                  }}
                />
                <CardHeader className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="p-2 rounded-lg" style={{ backgroundColor: `${type.gradient[0]}20`, color: type.gradient[0] }}>
                      {type.icon}
                    </span>
                    <CardTitle className="text-xl">{type.title}</CardTitle>
                  </div>
                  <CardDescription className="text-sm">
                    {type.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <ul className="space-y-2 mb-6">
                    {type.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: type.gradient[0] }}></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {type.to.startsWith('http') ? (
                    <button
                      onClick={() => handleExternalNavigation(type.to)}
                      className="w-full inline-flex items-center justify-center font-medium px-4 py-2 rounded-md text-white"
                      style={{
                        background: `linear-gradient(135deg, ${type.gradient[0]} 0%, ${type.gradient[1]} 100%)`,
                      }}
                    >
                      Start {type.title}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  ) : (
                    <Button
                      asChild
                      className="w-full font-medium"
                      style={{
                        background: `linear-gradient(135deg, ${type.gradient[0]} 0%, ${type.gradient[1]} 100%)`,
                      }}
                    >
                      <Link to={type.to}>
                        Start {type.title}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Practice;
