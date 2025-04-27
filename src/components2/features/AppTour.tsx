import React from 'react';
import { Compass, MapPin, RouteOff, Map } from 'lucide-react';
import { Card, CardContent, CardTitle } from '../ui/card';

export function AppTour() {
  return (
    <div className="container mx-auto px-4 py-16 relative">
      {/* Background elements */}
      <div className="absolute -z-10 bottom-20 left-20 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl"></div>
      
      <div className="text-center mb-16">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-4">
          <Compass className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">Interactive Experience</span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Guided App Tour
          </span>
        </h2>
        
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Navigate through our app with ease using our interactive tour. 
          Discover powerful features and learn how to make the most of your preparation journey.
        </p>
      </div>
      
      <div className="relative">
        <div className="mx-auto max-w-4xl relative">
          {/* App frame */}
          <div className="bg-gradient-to-b from-gray-900 to-purple-900/40 rounded-xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="border-b border-white/10 bg-black/20 py-3 px-4 flex items-center justify-between">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 text-center">
                <span className="text-sm text-gray-400">Interview Prep App</span>
              </div>
              <div className="w-16"></div>
            </div>
            
            <div className="p-8 relative min-h-80">
              {/* App content */}
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 mb-4">
                  <h3 className="text-xl font-bold text-white mb-1">Welcome to the App Tour!</h3>
                  <p className="text-gray-300">Discover all the powerful features to accelerate your interview preparation</p>
                </div>
                
                {[
                  {
                    title: "AI Mock Interviews",
                    icon: <MapPin className="w-5 h-5 text-pink-400" />,
                    active: true
                  },
                  {
                    title: "Smart Resume Builder",
                    icon: <MapPin className="w-5 h-5 text-gray-400" />,
                    active: false
                  },
                  {
                    title: "Personalized Roadmaps",
                    icon: <MapPin className="w-5 h-5 text-gray-400" />,
                    active: false
                  },
                  {
                    title: "Community Features",
                    icon: <MapPin className="w-5 h-5 text-gray-400" />,
                    active: false
                  }
                ].map((item, index) => (
                  <div key={index} className={`bg-white/5 border ${item.active ? 'border-pink-500/50 ring-2 ring-pink-500/20' : 'border-white/10'} rounded-lg p-4 flex items-center`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${item.active ? 'bg-pink-500/20' : 'bg-white/5'}`}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{item.title}</h4>
                      <p className="text-xs text-gray-400">Step {index + 1} of 4</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Tour overlay */}
              <div className="absolute left-1/3 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-pink-500 to-purple-500 opacity-30 blur-lg rounded-full"></div>
                  <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-full w-12 h-12 flex items-center justify-center relative">
                    <span className="text-white font-bold">1</span>
                  </div>
                </div>
                <div className="absolute w-40 h-px bg-gradient-to-r from-pink-500 to-transparent -right-40 top-1/2"></div>
              </div>
              
              {/* Tour popup */}
              <div className="absolute top-1/3 right-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 shadow-xl w-64">
                <h4 className="font-bold text-white mb-2">AI Mock Interviews</h4>
                <p className="text-sm text-gray-300 mb-3">Practice with our AI interviewer that simulates real interview conditions and provides instant feedback.</p>
                <div className="flex justify-between">
                  <button className="text-xs text-gray-300 hover:text-white">Skip tour</button>
                  <button className="text-xs bg-gradient-to-r from-pink-500 to-purple-500 px-3 py-1 rounded-full text-white">Next step</button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tour controls */}
          <div className="flex justify-center mt-8 space-x-2">
            {[0, 1, 2, 3].map((step) => (
              <button 
                key={step} 
                className={`w-3 h-3 rounded-full ${step === 0 ? 'bg-pink-500' : 'bg-white/20'}`}
                aria-label={`Go to step ${step + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}