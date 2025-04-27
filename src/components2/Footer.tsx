import React from 'react';
import { Sparkles, Facebook, Twitter, Linkedin, Instagram, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-white/10 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-8 h-8 text-purple-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">PrepMaster</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Revolutionizing interview preparation with AI-powered tools, personalized learning experiences,
              and a supportive global community.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: <Facebook className="w-5 h-5" />, label: "Facebook" },
                { icon: <Twitter className="w-5 h-5" />, label: "Twitter" },
                { icon: <Linkedin className="w-5 h-5" />, label: "LinkedIn" },
                { icon: <Instagram className="w-5 h-5" />, label: "Instagram" },
                { icon: <Github className="w-5 h-5" />, label: "GitHub" }
              ].map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors duration-200 text-gray-300 hover:text-white"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          
          {[
            {
              title: "Product",
              links: ["Features", "Roadmaps", "Pricing", "Updates", "Security", "Beta Program"]
            },
            {
              title: "Resources",
              links: ["Documentation", "Tutorials", "Blog", "Community", "Success Stories", "Interview Tips"]
            },
            {
              title: "Company",
              links: ["About Us", "Careers", "Press", "Contact", "Partners", "Legal"]
            }
          ].map((column, index) => (
            <div key={index}>
              <h3 className="font-semibold text-white mb-4">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © 2025 PrepMaster. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Cookie Policy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}