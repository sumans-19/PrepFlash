import React, { useRef, useEffect } from 'react';
import { Sparkles, BarChart3, Zap } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from "@/lib/utils"

interface CardData {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function FeatureHero() {
  const cardRefs = useRef<HTMLDivElement[]>([]);


  useEffect(() => {


    cardRefs.current.forEach((card) => {
      if (card) {
        card.addEventListener('mouseenter', (e) => {
          const target = e.currentTarget as HTMLDivElement;
          // Show text on hover with magical effect
          const titleElement = target.querySelector('.card-title') as HTMLElement;
          const descriptionElement = target.querySelector('.card-description') as HTMLElement;

          if (titleElement) {
            titleElement.style.opacity = '1';
            titleElement.style.transform = 'translateY(0)';
            titleElement.style.filter = 'blur(0px)';
            titleElement.style.transition = 'opacity 0.5s, transform 0.5s, filter 0.5s';
          }
          if (descriptionElement) {
            descriptionElement.style.opacity = '1';
            descriptionElement.style.transform = 'translateY(0)';
            descriptionElement.style.filter = 'blur(0px)';
            descriptionElement.style.transition = 'opacity 0.5s, transform 0.5s, filter 0.5s';
          }
        });

        card.addEventListener('mouseleave', (e) => {
          const target = e.currentTarget as HTMLDivElement;
          // Hide text on mouse leave
          const titleElement = target.querySelector('.card-title') as HTMLElement;
          const descriptionElement = target.querySelector('.card-description') as HTMLElement;
          if (titleElement) {
            titleElement.style.opacity = '0';
            titleElement.style.transform = 'translateY(10px)';
            titleElement.style.filter = 'blur(5px)';
          }
          if (descriptionElement) {
            descriptionElement.style.opacity = '0';
            descriptionElement.style.transform = 'translateY(10px)';
            descriptionElement.style.filter = 'blur(5px)';
          }
        });
      }
    });

    return () => {

      cardRefs.current.forEach(card => {
        if (card) {
          card.removeEventListener('mouseenter', () => { });
          card.removeEventListener('mouseleave', () => { });
        }
      });
    };
  }, []);

  const cardData: CardData[] = [
    {
      icon: <Sparkles className="w-10 h-10 text-purple-400" />,
      title: "AI-Powered Assistance",
      description: "Get personalized guidance with our intelligent AI assistant that adapts to your learning style."
    },
    {
      icon: <BarChart3 className="w-10 h-10 text-blue-400" />,
      title: "Comprehensive Learning",
      description: "Access role-specific roadmaps, projects, and practice exercises designed by industry experts."
    },
    {
      icon: <Zap className="w-10 h-10 text-pink-400" />,
      title: "Real-time Feedback",
      description: "Receive instant analysis on your responses with actionable suggestions for improvement."
    }
  ];

  return (
    <div className="relative pb-12 pt-20 overflow-hidden">

      {/* Background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-900/20 to-transparent"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-60 -left-20 w-60 h-60 bg-blue-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="inline-block mb-4 py-1 px-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <span className="flex items-center text-purple-400">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Supercharge Your Interview Prep</span>
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Features That Transform
            </span>
            <br />
            Your Interview Journey
          </h1>

          <p className="text-xl text-gray-300 max-w-3xl mb-8">
            Experience a revolutionary approach to interview preparation with AI-powered tools,
            personalized feedback, and immersive learning experiences.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="primary" size="lg">
              Take a Tour
            </Button>
            <Button variant="outline" size="lg">
              Explore Features
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {cardData.map((item, index) => (
            <div
              key={index}
              ref={el => cardRefs.current[index] = el!}
              className={cn(
                "bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10",
                "transition-all duration-500 relative overflow-hidden",
                "transform-style: preserve-3d"
              )}
              style={{
                transform: 'perspective(1000px)',
              }}
            >
              <div className="mb-4 flex justify-center" style={{ transform: 'rotate(0deg)' }}>
                <span style={{ fontSize: '2.5rem' }}>{item.icon}</span>
              </div>
              <h3
                className="text-xl font-bold mb-3 card-title"
                style={{
                  transform: 'translateY(10px)',
                  opacity: '0',
                  transition: 'opacity 0.5s, transform 0.5s, filter 0.5s',
                  filter: 'blur(5px)',
                }}
              >
                {item.title}
              </h3>
              <p
                className="text-gray-300 card-description"
                style={{
                  transform: 'translateY(10px)',
                  opacity: '0',
                  transition: 'opacity 0.5s, transform 0.5s, filter 0.5s',
                  filter: 'blur(5px)',
                }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

