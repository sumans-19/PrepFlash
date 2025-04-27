import React from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from './ui/button';

export function FeaturesCTA() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="bg-gradient-to-br from-gray-900 to-purple-900/50 rounded-3xl p-8 md:p-16 relative overflow-hidden border border-white/10">
        {/* Background effects */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl"></div>
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
          
          {/* Decorative elements */}
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              className="absolute text-yellow-300 opacity-50"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 20 + 10}px`,
                height: `${Math.random() * 20 + 10}px`,
                animation: `pulse ${Math.random() * 3 + 2}s infinite alternate`
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Ready to Transform Your Interview Experience?
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-300 mb-10">
            Join thousands of successful candidates who have aced their interviews
            with our comprehensive preparation platform.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Button variant="primary" size="lg" className="group">
              
              <span>Get Started For Free</span>
            </Button>
            <Button variant="outline" size="lg">
              Schedule a Demo
            </Button>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-gray-400">
            <span>No credit card required</span>
            <span>•</span>
            <span>14-day free trial</span>
            <span>•</span>
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </div>
  );
}