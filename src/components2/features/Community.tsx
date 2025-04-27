import React from 'react';
import { Users, Heart, MessageCircle, Award } from 'lucide-react';

export function Community() {
  return (
    <div className="container mx-auto px-4 py-16 relative">
      <div className="absolute -z-10 top-20 right-20 w-72 h-72 bg-pink-600/10 rounded-full blur-3xl"></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 mb-4">
            <Users className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Community Powered</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text text-transparent">
              Join a Global Community
            </span>
            <br />
            of Interview Seekers
          </h2>
          
          <p className="text-lg text-gray-300 mb-8">
            Connect with peers, share experiences, and learn together in our thriving community.
            Get support, feedback, and motivation from others on the same journey.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {[
              {
                icon: <MessageCircle className="w-8 h-8 text-pink-400" />,
                title: "Discussion Forums",
                description: "Engage in topic-specific conversations with peers and experts"
              },
              {
                icon: <Award className="w-8 h-8 text-purple-400" />,
                title: "Achievement System",
                description: "Earn badges and recognition for your contributions and progress"
              },
              {
                icon: <Users className="w-8 h-8 text-blue-400" />,
                title: "Study Groups",
                description: "Form or join study groups for collaborative learning experiences"
              },
              {
                icon: <Heart className="w-8 h-8 text-red-400" />,
                title: "Peer Support",
                description: "Give and receive encouragement during challenging times"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-5 hover:border-purple-500/30 transition-all duration-300">
                <div className="mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="relative">
          <div className="bg-gradient-to-b from-gray-900 to-purple-900/40 rounded-xl border border-white/10 p-6 shadow-xl max-w-md mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-white">Community Highlights</h3>
              <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">1,240 Online</span>
            </div>
            
            <div className="space-y-4 mb-6">
              {[
                {
                  avatar: "👩‍💻",
                  name: "Sarah Chen",
                  role: "Frontend Developer",
                  content: "Just passed my Google interview! Thanks to everyone who helped me with mock interviews last week!",
                  likes: 34,
                  comments: 12,
                  time: "2h ago"
                },
                {
                  avatar: "👨‍💻",
                  name: "Miguel Rodriguez",
                  role: "Software Engineer",
                  content: "Hosting a mock system design interview session this Friday. Anyone interested in joining?",
                  likes: 18,
                  comments: 21,
                  time: "5h ago"
                },
                {
                  avatar: "👩‍🔬",
                  name: "Priya Sharma",
                  role: "Data Scientist",
                  content: "Shared my interview experience with 5 top tech companies in the resources section. Hope it helps!",
                  likes: 52,
                  comments: 8,
                  time: "1d ago"
                }
              ].map((post, index) => (
                <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-start mb-3">
                    <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center mr-3 text-lg">
                      {post.avatar}
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{post.name}</h4>
                      <p className="text-xs text-gray-400">{post.role} • {post.time}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-200 mb-3">{post.content}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center hover:text-pink-400">
                        <Heart className="w-4 h-4 mr-1" /> {post.likes}
                      </button>
                      <button className="flex items-center hover:text-blue-400">
                        <MessageCircle className="w-4 h-4 mr-1" /> {post.comments}
                      </button>
                    </div>
                    <button className="hover:text-purple-400">Share</button>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg text-sm">
              View More Community Posts
            </button>
          </div>
          
          {/* Floating badges */}
          <div className="absolute -top-6 -right-6 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}