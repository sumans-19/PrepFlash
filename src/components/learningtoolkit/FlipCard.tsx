import { useState } from "react";
import { cn } from "@/lib/utils";

type FlipCardProps = {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  className?: string;
};

const FlipCard = ({ frontContent, backContent, className }: FlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={cn(
        "flip-card relative h-full w-full perspective-1000 cursor-pointer",
        className
      )}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className={cn(
          "flip-card-inner relative w-full h-full transition-transform duration-500 transform-style-3d",
          isFlipped ? "rotate-y-180" : ""
        )}
      >
        <div className="flip-card-front absolute w-full h-full backface-hidden">
          {frontContent}
        </div>
        <div className="flip-card-back absolute w-full h-full backface-hidden rotate-y-180">
          {backContent}
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
