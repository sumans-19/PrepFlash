import React from 'react';
import { BookOpen, BarChart3, Share2, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardTitle } from '../ui/card';

export function LearningTools() {
  return (
    <div className="container mx-auto px-4 py-16 relative">
      <div className="absolute -z-10 bottom-40 right-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"></div>
      
      <div className="text-center mb-16">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 mb-4">
          <BookOpen className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">Comprehensive Learning</span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          <span className="bg-gradient-to-r from-blue-400 to-green-500 bg-clip-text text-transparent">
            Powerful Learning Tools
          </span>
        </h2>
        
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Access a complete suite of learning resources designed to accelerate your interview preparation
          and help you master essential skills for your dream role.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            icon: <BookOpen className="w-12 h-12 text-blue-400" />,
            title: "Role-Based Roadmaps",
            description: "Follow personalized learning paths designed specifically for your target role. Track your progress and master key competencies step by step.",
            features: ["Structured learning paths", "Progress tracking", "Expert-curated content", "Interactive checkpoints"]
          },
          {
            icon: <BarChart3 className="w-12 h-12 text-purple-400" />,
            title: "Performance Analytics",
            description: "Gain deep insights into your preparation with detailed analytics. Identify strengths and weaknesses to focus your efforts effectively.",
            features: ["Skill gap analysis", "Progress visualization", "Comparison benchmarks", "Improvement suggestions"]
          },
          {
            icon: <Share2 className="w-12 h-12 text-green-400" />,
            title: "Project Showcase",
            description: "Build and showcase real-world projects that demonstrate your skills to potential employers and get feedback from the community.",
            features: ["Project templates", "Peer reviews", "Portfolio integration", "Employer visibility"]
          }
        ].map((tool, index) => (
          <Card key={index} className="backdrop-blur-md bg-gradient-to-b from-white/5 to-white/2 overflow-hidden group">
            <div className="p-6">
              <div className="mb-4">{tool.icon}</div>
              
              <CardTitle>{tool.title}</CardTitle>
              
              <CardContent className="px-0 pt-3">
                <p className="text-gray-300 mb-6">{tool.description}</p>
                
                <ul className="space-y-2">
                  {tool.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </div>
            
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
          </Card>
        ))}
      </div>
    </div>
  );
}