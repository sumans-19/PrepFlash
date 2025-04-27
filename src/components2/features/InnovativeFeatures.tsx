import React from 'react';
import { Lightbulb, Zap, BrainCircuit, Gauge, Fingerprint, Users } from 'lucide-react';
import { Card, CardContent, CardTitle } from '../ui/card';

export function InnovativeFeatures() {
  return (
    <div className="container mx-auto px-4 py-16 relative">
      <div className="absolute -z-10 top-0 left-20 w-80 h-80 bg-yellow-600/10 rounded-full blur-3xl"></div>
      
      <div className="text-center mb-16">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 mb-4">
          <Lightbulb className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">Cutting-Edge Technology</span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Innovative Features
          </span>
        </h2>
        
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Discover our revolutionary approach to interview preparation with these unique features
          that set us apart from traditional learning platforms.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          {
            icon: <BrainCircuit className="w-12 h-12 text-purple-400" />,
            title: "Emotion Recognition AI",
            description: "Our AI analyzes your facial expressions and tone during mock interviews, providing insights on your emotional presentation and suggestions for improvement.",
            gradient: "from-purple-500/20 to-blue-500/20"
          },
          {
            icon: <Fingerprint className="w-12 h-12 text-blue-400" />,
            title: "Personalized Learning DNA",
            description: "Our system creates a unique learning profile based on your skills, learning style, and career goals, then tailors all content specifically to you.",
            gradient: "from-blue-500/20 to-cyan-500/20"
          },
          {
            icon: <Gauge className="w-12 h-12 text-green-400" />,
            title: "Real-time Confidence Meter",
            description: "Track your confidence levels across different interview topics with our dynamic assessment tool that helps you focus on areas needing improvement.",
            gradient: "from-green-500/20 to-emerald-500/20"
          },
          {
            icon: <Zap className="w-12 h-12 text-yellow-400" />,
            title: "Accelerated Mastery Mode",
            description: "Leverage spaced repetition and cognitive science principles to master interview concepts in 40% less time than traditional study methods.",
            gradient: "from-yellow-500/20 to-orange-500/20"
          },
          {
            icon: <Users className="w-12 h-12 text-pink-400" />,
            title: "Peer Shadow Sessions",
            description: "Watch and learn from recorded successful interviews with anonymized real candidates who secured positions at your target companies.",
            gradient: "from-pink-500/20 to-rose-500/20"
          }
        ].map((feature, index) => (
          <Card 
            key={index} 
            className={`p-8 backdrop-blur-md bg-gradient-to-b ${feature.gradient} border-none overflow-hidden group hover:translate-y-[-4px] transition-all duration-300`}
          >
            <div className="mb-6 relative">
              <div className="absolute -inset-2 bg-white/5 rounded-full blur-md"></div>
              {feature.icon}
            </div>
            
            <CardTitle className="text-xl font-bold mb-3">
              {feature.title}
            </CardTitle>
            
            <CardContent className="p-0">
              <p className="text-gray-300">{feature.description}</p>
            </CardContent>
            
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-blue-500 to-green-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
          </Card>
        ))}
      </div>
    </div>
  );
}