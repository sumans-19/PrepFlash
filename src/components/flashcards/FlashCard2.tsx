
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FlashCard as FlashCardType } from "@/types";
import { cn } from "@/lib/utils";

interface FlashCardProps {
  card: FlashCardType;
}

const FlashCard: React.FC<FlashCardProps> = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="perspective-1000 w-full h-[300px]" onClick={handleFlip}>
      <Card 
        className={cn(
          "cursor-pointer h-full w-full transition-transform duration-500 transform-style-3d relative",
          isFlipped ? "rotate-y-180" : ""
        )}
      >
        {/* Front Side */}
        <CardContent className={cn(
          "absolute w-full h-full flex flex-col justify-center items-center p-6 backface-hidden bg-white",
          isFlipped ? "hidden" : ""
        )}>
          <div className="bg-prep-light p-2 px-4 mb-4 rounded-full">
            <span className="text-xs font-medium text-prep-secondary">Question</span>
          </div>
          <h3 className="text-xl font-medium text-center text-prep-dark">{card.question}</h3>
          <div className="mt-auto text-sm text-gray-500">Click to flip</div>
        </CardContent>

        {/* Back Side */}
        <CardContent className={cn(
          "absolute w-full h-full flex flex-col justify-center items-center p-6 backface-hidden bg-prep-light rotate-y-180",
          !isFlipped ? "hidden" : ""
        )}>
          <div className="bg-white p-2 px-4 mb-4 rounded-full">
            <span className="text-xs font-medium text-prep-secondary">Answer</span>
          </div>
          <p className="text-md text-center text-prep-dark">{card.answer}</p>
          <div className="mt-auto text-sm text-gray-500">Click to flip back</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FlashCard;
