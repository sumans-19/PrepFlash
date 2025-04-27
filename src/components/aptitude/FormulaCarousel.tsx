
import React, { useState } from 'react';
import { Formula, Topic } from '@/types/aptitude';
import FormulaCard from './FormulaCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FormulaCarouselProps {
  formulas: Formula[];
  topics: Topic[];
  selectedTopic: string;
  onSelectTopic: (topic: string) => void;
}

const FormulaCarousel = ({ formulas, topics, selectedTopic, onSelectTopic }: FormulaCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const topicFormulas = formulas.filter(formula => formula.topic === selectedTopic);

  const nextFormula = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 1 >= topicFormulas.length ? 0 : prevIndex + 1
    );
  };

  const prevFormula = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex - 1 < 0 ? topicFormulas.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <ToggleGroup 
          type="single" 
          value={selectedTopic}
          onValueChange={(value) => {
            if (value) {
              setCurrentIndex(0);
              onSelectTopic(value);
            }
          }}
          className="flex flex-wrap justify-center gap-2"
        >
          {topics.map((topic) => (
            <ToggleGroupItem
              key={topic.id}
              value={topic.id}
              aria-label={`Filter by ${topic.name}`}
              className="px-3 py-2 text-sm"
            >
              {topic.name}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="relative">
        {topicFormulas.length > 0 ? (
          <div className="relative h-64">
            <div className="absolute left-0 right-0 h-full flex items-center justify-between px-1 z-10 pointer-events-none">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm pointer-events-auto"
                onClick={prevFormula}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm pointer-events-auto"
                onClick={nextFormula}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {topicFormulas.map((formula, index) => (
              <div
                key={formula.id}
                className={`absolute inset-0 transition-transform duration-300 ease-in-out ${
                  index === currentIndex 
                    ? 'translate-x-0 opacity-100 scale-100' 
                    : index < currentIndex 
                    ? '-translate-x-full opacity-0 scale-95' 
                    : 'translate-x-full opacity-0 scale-95'
                }`}
                style={{ display: Math.abs(index - currentIndex) <= 1 ? 'block' : 'none' }}
              >
                <FormulaCard formula={formula} className="h-full" />
              </div>
            ))}

            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
              {topicFormulas.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentIndex ? 'w-4 bg-primary' : 'w-1.5 bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          <Card className="h-64 flex items-center justify-center">
            <CardContent>
              <p className="text-muted-foreground">No formulas available for this topic.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FormulaCarousel;
