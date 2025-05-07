
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import FlashCard from '../FlashCard';
import { flashCards } from '@/data/web/flashCardData';

const FlashCardQuiz: React.FC = () => {
  const [currentFlashcard, setCurrentFlashcard] = useState(0);

  const navigateFlashcard = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setCurrentFlashcard((prev) => (prev + 1) % flashCards.length);
    } else {
      setCurrentFlashcard((prev) => (prev - 1 + flashCards.length) % flashCards.length);
    }
  };

  return (
    <Card className="glassmorphism">
      <CardContent className="p-6">
        <div className="mb-6">
          <Progress value={((currentFlashcard + 1) / flashCards.length) * 100} className="mb-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Card {currentFlashcard + 1} of {flashCards.length}</span>
          </div>
        </div>
        
        <FlashCard 
          question={flashCards[currentFlashcard].question} 
          answer={flashCards[currentFlashcard].answer}
          explanation={flashCards[currentFlashcard].explanation}
        />
        
        <div className="flex justify-between mt-6">
          <Button 
            onClick={() => navigateFlashcard('prev')}
            variant="outline"
            className="px-8"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          
          {/* Question Navigation */}
          <div className="flex items-center">
            <div className="flex gap-1">
              {flashCards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFlashcard(index)}
                  className={`
                    w-2.5 h-2.5 rounded-full
                    ${currentFlashcard === index ? 'bg-primary' : 'bg-secondary hover:bg-secondary/80'}
                  `}
                />
              ))}
            </div>
          </div>
          
          <Button 
  onClick={() => navigateFlashcard('next')}
  className="px-8 bg-purple-300 text-purple-900 hover:bg-purple-400"
>
  Next <ChevronRight className="ml-2 h-4 w-4" />
</Button>

        </div>
      </CardContent>
    </Card>
  );
};

export default FlashCardQuiz;