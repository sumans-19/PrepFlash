import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Mic, MicOff, Copy } from 'lucide-react';

interface LiveTranscriptionProps {
  text: string;
  isActive: boolean;
  className?: string;
  onCopy?: () => void;
  speakerName?: string;
}

const LiveTranscription: React.FC<LiveTranscriptionProps> = ({
  text,
  isActive,
  className,
  onCopy,
  speakerName = "You"
}) => {
  const transcriptionRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [lastActivity, setLastActivity] = useState<number | null>(null);
  const [textChunks, setTextChunks] = useState<string[]>([]);
  const [fadeIn, setFadeIn] = useState(false);

  // Auto-scroll to the bottom of the transcription when text updates
  useEffect(() => {
    if (transcriptionRef.current && isActive) {
      transcriptionRef.current.scrollTop = transcriptionRef.current.scrollHeight;
    }
    
    // Animation timing for new text
    if (text) {
      setFadeIn(true);
      const timer = setTimeout(() => setFadeIn(false), 300);
      return () => clearTimeout(timer);
    }
  }, [text, isActive]);

  // Update activity timestamp when active
  useEffect(() => {
    if (isActive) {
      setLastActivity(Date.now());
    }
  }, [isActive, text]);

  // Parse text into chunks for better visualization
  useEffect(() => {
    if (!text) {
      setTextChunks([]);
      return;
    }
    
    // Split text by sentences or natural pauses
    const chunks = text
      .replace(/([.!?])\s+/g, "$1|")
      .split("|")
      .filter(chunk => chunk.trim().length > 0);
      
    setTextChunks(chunks);
  }, [text]);

  // Handle copy functionality
  const handleCopy = () => {
    if (!text) return;
    
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      if (onCopy) onCopy();
    });
  };

  // Calculate time since last activity
  const getActivityStatus = () => {
    if (!isActive || !lastActivity) return null;
    
    const secondsAgo = Math.floor((Date.now() - lastActivity) / 1000);
    if (secondsAgo < 3) return "active";
    if (secondsAgo < 10) return "waiting";
    return "idle";
  };
  
  const activityStatus = getActivityStatus();
  
  return (
    <Card 
      className={cn(
        "w-full overflow-hidden border transition-all duration-300", 
        {
          "border-green-500 shadow-lg": isActive,
          "border-gray-200 hover:border-gray-300": !isActive,
          "ring-2 ring-green-200": isActive && activityStatus === "active",
        },
        className
      )}
    >
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
          <div className="flex items-center space-x-2">
            {isActive ? (
              <div className="relative">
                <Mic size={18} className="text-green-500" />
                <span className={cn(
                  "absolute top-0 left-0 h-full w-full rounded-full animate-ping opacity-75",
                  "bg-green-500 -z-10",
                  {
                    "opacity-75": activityStatus === "active",
                    "opacity-30": activityStatus === "waiting",
                    "opacity-0": activityStatus === "idle"
                  }
                )} />
              </div>
            ) : (
              <MicOff size={18} className="text-gray-400" />
            )}
            <h3 className="text-lg font-medium">
              {isActive ? "Listening..." : "Transcription"}
            </h3>
          </div>
          
          <div className="flex items-center">
            <button
              onClick={handleCopy}
              disabled={!text}
              className={cn(
                "flex items-center space-x-1 px-2 py-1 rounded-md text-sm transition-colors",
                "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500",
                {
                  "text-gray-400 cursor-not-allowed": !text,
                  "text-gray-600": text && !copied,
                  "text-green-500": copied
                }
              )}
            >
              <Copy size={16} />
              <span>{copied ? "Copied!" : "Copy"}</span>
            </button>
          </div>
        </div>
        
        {/* Transcription Content */}
        <div
          ref={transcriptionRef}
          className="min-h-[150px] max-h-[300px] overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white"
        >
          {textChunks.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-start mb-2">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-medium mr-2">
                  {speakerName[0]}
                </div>
                <div className="text-sm text-blue-500 mt-1">{speakerName}</div>
              </div>
              
              {textChunks.map((chunk, index) => (
                <p 
                  key={index} 
                  className={cn(
                    "text-gray-700 leading-relaxed transition-opacity duration-300",
                    {
                      "opacity-80": index < textChunks.length - 1,
                      "font-medium": index === textChunks.length - 1,
                      "animate-fade-in": index === textChunks.length - 1 && fadeIn
                    }
                  )}
                >
                  {chunk}
                </p>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="text-gray-300 mb-4">
                {isActive ? (
                  <Mic size={32} className="animate-pulse" />
                ) : (
                  <MicOff size={32} />
                )}
              </div>
              <p className="text-gray-400 italic max-w-sm">
                {isActive
                  ? "Start speaking and your words will appear here..."
                  : "No transcription available yet"}
              </p>
              {isActive && (
                <div className="mt-4 flex space-x-1">
                  <span className="h-2 w-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="h-2 w-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  <span className="h-2 w-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "600ms" }}></span>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Footer with status */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-500">
          <div>
            {isActive ? (
              <span className="flex items-center">
                <span 
                  className={cn(
                    "inline-block h-2 w-2 rounded-full mr-2",
                    {
                      "bg-green-500": activityStatus === "active",
                      "bg-yellow-500": activityStatus === "waiting",
                      "bg-gray-400": activityStatus === "idle"
                    }
                  )}
                />
                {activityStatus === "active" ? "Recording..." : 
                 activityStatus === "waiting" ? "Waiting for speech..." : 
                 "Listening..."}
              </span>
            ) : (
              <span>Ready to transcribe</span>
            )}
          </div>
          
          {text && (
            <div>
              {text.length} characters | {text.split(/\s+/).length} words
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Add keyframe animation for new text appearing
const styles = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
`;

// Inject styles into document head
if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);
}

export default LiveTranscription;