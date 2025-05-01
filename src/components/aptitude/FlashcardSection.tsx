
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FlipHorizontal } from 'lucide-react';
import { Formula } from '@/types/aptitude';

interface FlashcardSectionProps {
  formula: Formula;
  isLoading?: boolean;
}

const FlashcardSection: React.FC<FlashcardSectionProps> = ({ 
  formula,
  isLoading = false
}) => {
  const [showAnswer, setShowAnswer] = useState(false);

  const handleFlip = () => {
    setShowAnswer(!showAnswer);
  };

  return (
    <div className="relative h-full flex flex-col">
      <Card 
        className={`h-64 w-full cursor-pointer transition-all duration-300 transform ${
          showAnswer ? 'scale-[1.02]' : ''
        } ${isLoading ? 'opacity-50' : 'opacity-100'}`}
        onClick={handleFlip}
      >
        <CardContent className="p-0 h-full">
          <div className="relative h-full w-full">
            {/* Front of card - Formula */}
            <div
              className={`absolute inset-0 p-6 flex flex-col items-center justify-center transition-all duration-500 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-slate-800 rounded-t-lg
              ${showAnswer ? 'opacity-0 -translate-y-2' : 'opacity-100'}`}
            >
              <h3 className="text-xl font-semibold mb-4">{formula.title}</h3>
              <div className="text-center">
                <p className="text-lg font-medium p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg shadow-sm">
                  {formula.expression}
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                  {formula.description}
                </p>
              </div>
            </div>

            {/* Back of card - Example */}
            <div
              className={`absolute inset-0 p-6 flex items-center justify-center transition-all duration-500 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-slate-700 rounded-t-lg
              ${showAnswer ? 'opacity-100' : 'opacity-0 translate-y-2'}`}
            >
              <div className="text-center">
                <h4 className="font-medium mb-4">Example:</h4>
                <p className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg shadow-sm">
                  {formula.example}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t p-3 flex justify-center">
          <p className="text-sm text-muted-foreground">
            {showAnswer ? "Click to see formula" : "Click to see example"}
          </p>
        </CardFooter>
      </Card>

      <Button 
        variant="outline" 
        onClick={handleFlip} 
        className="mt-4 mx-auto transition-all hover:scale-105"
        disabled={isLoading}
      >
        <FlipHorizontal className="mr-2 h-4 w-4" />
        Flip Card
      </Button>
    </div>
  );
};

export default FlashcardSection;
