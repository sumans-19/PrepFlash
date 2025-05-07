
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { BarChart } from 'lucide-react';

interface EmotionBarsProps {
  emotions: Record<string, number>;
  dominantEmotion: string;
  showIcons?: boolean;
  isRecording?: boolean;
}

// Emotion colors
const emotionColors = {
  happy: '#4ade80',
  neutral: '#60a5fa',
  sad: '#94a3b8',
  surprised: '#fbbf24',
  angry: '#ef4444',
  fearful: '#a855f7',
  disgusted: '#84cc16',
  confused: '#f97316'
};

// Emotion icons (using emoji as placeholders)
const emotionIcons = {
  happy: '😊',
  neutral: '😐',
  sad: '😢',
  surprised: '😲',
  angry: '😠',
  fearful: '😨',
  disgusted: '🤢',
  confused: '😕'
};

// Emotion descriptions for tooltips
const emotionDescriptions = {
  happy: 'Positive, enthusiastic expression showing engagement',
  neutral: 'Default expression, neither positive nor negative',
  sad: 'Downcast expression that may indicate disappointment',
  surprised: 'Expression of shock or unexpected reaction',
  angry: 'Expression showing frustration or irritation',
  fearful: 'Expression indicating worry or anxiety',
  disgusted: 'Expression of dislike or aversion',
  confused: 'Expression showing uncertainty or puzzlement'
};

const EmotionBars: React.FC<EmotionBarsProps> = ({ emotions, dominantEmotion, showIcons = true, isRecording = false }) => {
  // Sort emotions by value (highest first)
  const sortedEmotions = Object.entries(emotions)
    .sort(([, valueA], [, valueB]) => valueB - valueA)
    .slice(0, 5); // Show top 5 emotions
  
  return (
    <Card className="p-4 relative">
      {isRecording && (
        <div className="absolute top-2 right-2">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-xs text-red-500 font-medium">Live</span>
          </div>
        </div>
      )}
      <div className="flex items-center mb-3">
        <BarChart className="h-4 w-4 mr-2 text-muted-foreground" />
        <h4 className="text-sm font-medium">Emotion Analysis</h4>
      </div>
      <div className="space-y-3">
        {sortedEmotions.map(([emotion, value]) => (
          <div key={emotion} className="flex items-center gap-2">
            {showIcons && (
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <div className="w-6 text-center" title={emotion}>
                    {emotionIcons[emotion as keyof typeof emotionIcons] || '🙂'}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="text-xs">{emotionDescriptions[emotion as keyof typeof emotionDescriptions] || emotion}</p>
                </TooltipContent>
              </Tooltip>
            )}
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1">
                <span className="capitalize font-medium">{emotion}</span>
                <span className="text-muted-foreground">{(value * 100).toFixed(0)}%</span>
              </div>
              <Progress 
                value={value * 100} 
                className="h-2" 
                style={{
                  backgroundColor: 'rgba(100, 116, 139, 0.2)',
                  '--progress-background': emotionColors[emotion as keyof typeof emotionColors] || '#60a5fa'
                } as React.CSSProperties}
              />
              {emotion === dominantEmotion && (
                <div className="w-full flex justify-end">
                  <span className="text-[10px] font-medium mt-0.5 text-muted-foreground">
                    dominant
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default EmotionBars;
