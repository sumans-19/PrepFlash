import React from 'react';
import { FlashCard as FlashCardType } from '../../types/index';
import { Code } from 'lucide-react';

interface FlashCardProps {
  card: FlashCardType;
  isActive: boolean;
}

const FlashCard: React.FC<FlashCardProps> = ({ card, isActive }) => {
  return (
    <div 
      className={`
        w-full rounded-xl border border-border bg-card p-6 md:p-8
        transition-all duration-500 transform overflow-auto max-h-[calc(100vh-400px)]
        ${isActive ? 'scale-100 opacity-100 shadow-lg' : 'scale-95 opacity-0 pointer-events-none'}
      `}
    >
      <div className="mb-4 pb-4 border-b border-border">
        <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {card.topic}
        </h3>
      </div>
      
      <div className="prose prose-sm md:prose-base max-w-none">
        <p className="text-foreground leading-relaxed whitespace-pre-line">
          {card.content}
        </p>
        
        {card.codeExample && (
          <div className="mt-4 rounded-md bg-muted p-4 overflow-x-auto relative">
            <div className="absolute top-3 right-3 text-muted-foreground">
              <Code size={16} />
            </div>
            <pre className="text-sm font-mono">{card.codeExample}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashCard;