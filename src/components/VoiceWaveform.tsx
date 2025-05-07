
import React, { useEffect, useState } from 'react';

interface VoiceWaveformProps {
  isActive: boolean;
  className?: string;
}

const VoiceWaveform: React.FC<VoiceWaveformProps> = ({ isActive, className }) => {
  const [heights, setHeights] = useState([0.3, 0.5, 0.7, 0.5, 0.3]);
  
  // Number of bars in the waveform
  const numberOfBars = 5;

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setHeights(heights => 
          Array.from({ length: numberOfBars }, () => 
            isActive ? Math.random() * 0.8 + 0.2 : 0.15
          )
        );
      }, 150);
      
      return () => clearInterval(interval);
    } else {
      // Set static low heights when inactive
      setHeights(Array.from({ length: numberOfBars }, (_, i) => 
        // Alternate heights for aesthetic when inactive
        i % 2 === 0 ? 0.2 : 0.15
      ));
    }
  }, [isActive]);

  return (
    <div className={`flex items-center justify-center h-16 gap-1.5 ${className || ''}`}>
      {heights.map((height, index) => (
        <div
          key={index}
          className={`voice-wave transition-all duration-150 ease-in-out ${
            isActive ? 'bg-interview-accent' : 'bg-gray-300'
          }`}
          style={{
            transform: `scaleY(${height})`,
            animationDelay: `${index * 0.1}s`,
            opacity: isActive ? 1 : 0.7,
            height: '100%',
            width: '6px', 
            borderRadius: '2px'
          }}
        />
      ))}
    </div>
  );
};

export default VoiceWaveform;
