import React from 'react';
import { MessageSquare, Sparkles, Bot, Languages } from 'lucide-react';
import { Card, CardContent, CardTitle } from '../ui/card';

export function AIChat() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-4">
            <Bot className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">AI Assistant</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Intelligent Conversation
            </span>
            <br />
            With Our AI Chatbot
          </h2>
          
          <p className="text-lg text-gray-300 mb-8">
            Our advanced AI chatbot provides personalized assistance throughout your journey,
            offering intelligent insights, answering questions, and guiding your preparation.
          </p>
          
          <div className="space-y-4">
            {[
              {
                icon: <Sparkles className="w-5 h-5 text-purple-400" />,
                title: "Personalized Guidance",
                description: "Adaptive AI that understands your strengths and weaknesses"
              },
              {
                icon: <MessageSquare className="w-5 h-5 text-blue-400" />,
                title: "Natural Conversations",
                description: "Human-like interactions that feel intuitive and engaging"
              },
              {
                icon: <Languages className="w-5 h-5 text-pink-400" />,
                title: "Multilingual Support",
                description: "Communicate in your preferred language with our polyglot AI"
              }
            ].map((feature, index) => (
              <div key={index} className="flex items-start">
                <div className="bg-white/5 p-2 rounded-lg mr-4">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute -z-10 top-0 right-0 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl"></div>
          
          <div className="bg-gradient-to-b from-purple-900/30 to-blue-900/30 backdrop-blur-sm rounded-2xl border border-white/10 p-6 shadow-xl max-w-md mx-auto">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center mr-3">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">Interview Assistant</h3>
                <p className="text-xs text-gray-400">Online • Responds instantly</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="bg-white/5 rounded-lg rounded-tl-none p-3 border border-white/10 max-w-xs">
                <p className="text-sm text-gray-200">Hi there! I'm your interview prep assistant. How can I help you today?</p>
              </div>
              
              <div className="bg-purple-600/20 rounded-lg rounded-tr-none p-3 border border-purple-600/20 ml-auto max-w-xs">
                <p className="text-sm text-gray-200">I have a technical interview coming up. Can you help me prepare?</p>
              </div>
              
              <div className="bg-white/5 rounded-lg rounded-tl-none p-3 border border-white/10 max-w-xs">
                <p className="text-sm text-gray-200">Absolutely! I can help you with technical questions, create a personalized study plan, or conduct a mock interview. What role are you applying for?</p>
              </div>
              
              <div className="bg-white/5 rounded-lg rounded-tl-none p-3 border border-white/10 max-w-xs">
                <div className="flex space-x-2 mb-2">
                  <button className="bg-white/10 hover:bg-white/20 text-xs rounded-full px-3 py-1 text-white">Create study plan</button>
                  <button className="bg-white/10 hover:bg-white/20 text-xs rounded-full px-3 py-1 text-white">Mock interview</button>
                </div>
                <p className="text-xs text-gray-400">Choose an option or type your response</p>
              </div>
            </div>
            
            <div className="relative">
              <input 
                type="text" 
                placeholder="Type your message..." 
                className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-full">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}