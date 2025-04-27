import React from 'react';
import { Languages, Globe, MessageSquare, Check } from 'lucide-react';

export function MultilingualSupport() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="order-2 lg:order-1 relative">
          <div className="absolute -z-10 top-20 left-20 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl"></div>
          
          <div className="bg-gradient-to-b from-gray-900 to-purple-900/40 rounded-xl border border-white/10 p-6 shadow-xl max-w-md mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-white">Language Settings</h3>
              <button className="bg-white/10 hover:bg-white/20 rounded-full p-2">
                <Globe className="w-5 h-5 text-white" />
              </button>
            </div>
            
            <div className="space-y-3 mb-6">
              {[
                { language: "English", code: "en", active: true },
                { language: "Spanish", code: "es", active: false },
                { language: "French", code: "fr", active: false },
                { language: "German", code: "de", active: false },
                { language: "Japanese", code: "ja", active: false },
                { language: "Chinese", code: "zh", active: false },
              ].map((lang, index) => (
                <div 
                  key={index} 
                  className={`flex justify-between items-center p-3 rounded-lg ${lang.active 
                    ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-purple-500/50' 
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  } cursor-pointer transition-all duration-200`}
                >
                  <div className="flex items-center">
                    <span className="inline-block w-6 h-6 text-lg mr-3">{getLanguageEmoji(lang.code)}</span>
                    <span className="font-medium text-white">{lang.language}</span>
                  </div>
                  {lang.active && (
                    <span className="bg-purple-500 rounded-full p-1">
                      <Check className="w-4 h-4 text-white" />
                    </span>
                  )}
                </div>
              ))}
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-sm text-gray-300 mb-3">
                Your interview content, feedback, and AI interactions will be provided in your selected language.
              </p>
              <div className="flex space-x-2">
                <button className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg">Cancel</button>
                <button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg">Apply</button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="order-1 lg:order-2">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-4">
            <Languages className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Global Accessibility</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Multilingual Support
            </span>
            <br />
            For Everyone
          </h2>
          
          <p className="text-lg text-gray-300 mb-8">
            Break language barriers with our comprehensive multilingual support.
            Practice interviews in your native language and improve your communication skills globally.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[
              {
                title: "12+ Languages",
                description: "Full support for major global languages"
              },
              {
                title: "Native Feedback",
                description: "Get assessment in your preferred language"
              },
              {
                title: "Cultural Context",
                description: "Region-specific interview preparation"
              },
              {
                title: "Language Learning",
                description: "Improve technical vocabulary in new languages"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {["🇺🇸", "🇪🇸", "🇫🇷", "🇩🇪", "🇯🇵", "🇨🇳", "🇮🇳", "🇧🇷", "🇷🇺", "🇰🇷"].map((flag, index) => (
              <span key={index} className="text-2xl" aria-hidden="true">{flag}</span>
            ))}
            <span className="text-gray-400">+ more</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function getLanguageEmoji(code: string): string {
  const emojiMap: Record<string, string> = {
    en: "🇺🇸",
    es: "🇪🇸",
    fr: "🇫🇷",
    de: "🇩🇪",
    ja: "🇯🇵",
    zh: "🇨🇳",
  };
  
  return emojiMap[code] || "🌐";
}